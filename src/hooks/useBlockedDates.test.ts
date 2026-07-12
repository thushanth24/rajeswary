import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const fromMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (...args: unknown[]) => fromMock(...args) },
}));

import { isDateFullyBooked, useBlockedDates } from "./useBlockedDates";

function chainResolving(data: unknown, error: unknown = null) {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "in", "limit", "order"]) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error }).then(resolve);
  return chain;
}

const morning = (section: string | null = null) => ({
  event_date: "2026-08-01",
  event_start_time: "09:00",
  event_end_time: "14:00",
  section_id: section,
});
const evening = (section: string | null = null) => ({
  event_date: "2026-08-01",
  event_start_time: "14:00",
  event_end_time: "18:00",
  section_id: section,
});
const fullday = (section: string | null = null) => ({
  event_date: "2026-08-01",
  event_start_time: "09:00",
  event_end_time: "18:00",
  section_id: section,
});

describe("isDateFullyBooked", () => {
  describe("single-section hall", () => {
    it("is not fully booked with no bookings", () => {
      expect(isDateFullyBooked([], 1)).toBe(false);
    });

    it("is fully booked by a fullday booking", () => {
      expect(isDateFullyBooked([fullday()], 1)).toBe(true);
    });

    it("is fully booked by a legacy booking with null times", () => {
      expect(
        isDateFullyBooked(
          [{ event_date: "2026-08-01", event_start_time: null, event_end_time: null, section_id: null }],
          1
        )
      ).toBe(true);
    });

    it("is not fully booked by a morning-only booking (evening still free)", () => {
      expect(isDateFullyBooked([morning()], 1)).toBe(false);
    });

    it("is fully booked when both morning and evening are taken", () => {
      expect(isDateFullyBooked([morning(), evening()], 1)).toBe(true);
    });
  });

  describe("multi-section hall (2 sections)", () => {
    it("is not fully booked when one section has a fullday booking", () => {
      expect(isDateFullyBooked([fullday("s1")], 2)).toBe(false);
    });

    it("is fully booked when every section has a fullday booking", () => {
      expect(isDateFullyBooked([fullday("s1"), fullday("s2")], 2)).toBe(true);
    });

    it("is fully booked when an unassigned booking blocks everything", () => {
      expect(isDateFullyBooked([fullday(null)], 2)).toBe(true);
    });

    it("is not fully booked with mixed partial bookings leaving free slots", () => {
      // s1 morning + s2 morning: evenings on both sections remain free
      expect(isDateFullyBooked([morning("s1"), morning("s2")], 2)).toBe(false);
    });

    it("is fully booked when all sections are taken morning and evening", () => {
      expect(
        isDateFullyBooked(
          [morning("s1"), morning("s2"), evening("s1"), evening("s2")],
          2
        )
      ).toBe(true);
    });
  });
});

describe("useBlockedDates", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  function mockTables(tables: Record<string, unknown[]>) {
    fromMock.mockImplementation((table: string) =>
      chainResolving(tables[table] ?? [])
    );
  }

  it("returns no blocked dates when nothing is booked or closed", async () => {
    mockTables({ hall_sections: [{ id: "s1" }], bookings: [], hall_closed_dates: [] });

    const { result } = renderHook(() => useBlockedDates("hall-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.blockedDates).toEqual([]);
    expect(result.current.isDateBlocked(new Date("2026-08-01"))).toBe(false);
  });

  it("blocks closed dates with reason 'closed'", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [],
      hall_closed_dates: [{ closed_date: "2026-08-15", hall_id: "hall-1" }],
    });

    const { result } = renderHook(() => useBlockedDates("hall-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isDateBlocked(new Date("2026-08-15"))).toBe(true);
    expect(result.current.getBlockedReason(new Date("2026-08-15"))).toBe("closed");
  });

  it("blocks fully booked dates with reason 'confirmed'", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [fullday("s1")],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() => useBlockedDates("hall-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isDateBlocked(new Date("2026-08-01"))).toBe(true);
    expect(result.current.getBlockedReason(new Date("2026-08-01"))).toBe("confirmed");
  });

  it("does not block partially booked dates", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [morning("s1")],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() => useBlockedDates("hall-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isDateBlocked(new Date("2026-08-01"))).toBe(false);
    expect(result.current.getBlockedReason(new Date("2026-08-01"))).toBeNull();
  });

  it("prefers the 'closed' reason when a date is both closed and booked", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [
        { ...fullday("s1"), event_date: "2026-08-15" },
      ],
      hall_closed_dates: [{ closed_date: "2026-08-15", hall_id: "hall-1" }],
    });

    const { result } = renderHook(() => useBlockedDates("hall-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.getBlockedReason(new Date("2026-08-15"))).toBe("closed");
    // must not be double-counted
    expect(
      result.current.blockedDates.filter((b) => b.date === "2026-08-15")
    ).toHaveLength(1);
  });

  it("exposes the hall's section count", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }, { id: "s2" }],
      bookings: [],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() => useBlockedDates("hall-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sectionCount).toBe(2);
  });

  it("returns an empty state without querying when hallId is null", async () => {
    mockTables({});
    const { result } = renderHook(() => useBlockedDates(null));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.blockedDates).toEqual([]);
    expect(fromMock).not.toHaveBeenCalled();
  });
});
