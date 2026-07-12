import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

// Mock the supabase client before importing the hook
const fromMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (...args: unknown[]) => fromMock(...args) },
}));

import {
  getSlotType,
  slotsConflict,
  useSectionAwareAvailability,
} from "./useSectionAwareAvailability";

/**
 * Builds a chainable supabase query mock: every builder method returns the
 * chain itself, and the chain is thenable, resolving to { data, error }.
 */
function chainResolving(data: unknown, error: unknown = null) {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "in", "limit", "order"]) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error }).then(resolve);
  return chain;
}

describe("getSlotType", () => {
  it("classifies the standard slots", () => {
    expect(getSlotType("09:00", "14:00")).toBe("morning");
    expect(getSlotType("14:00", "18:00")).toBe("evening");
    expect(getSlotType("09:00", "18:00")).toBe("fullday");
  });

  it("normalizes times that include seconds", () => {
    expect(getSlotType("09:00:00", "14:00:00")).toBe("morning");
    expect(getSlotType("14:00:00", "18:00:00")).toBe("evening");
  });

  it("treats null/missing times as fullday (legacy bookings)", () => {
    expect(getSlotType(null, null)).toBe("fullday");
    expect(getSlotType("09:00", null)).toBe("fullday");
    expect(getSlotType(null, "14:00")).toBe("fullday");
  });

  it("treats unknown time patterns as fullday for safety", () => {
    expect(getSlotType("10:00", "12:00")).toBe("fullday");
    expect(getSlotType("09:00", "17:00")).toBe("fullday");
  });
});

describe("slotsConflict", () => {
  it("fullday bookings conflict with every slot", () => {
    expect(slotsConflict("09:00", "18:00", "morning")).toBe(true);
    expect(slotsConflict("09:00", "18:00", "evening")).toBe(true);
    expect(slotsConflict("09:00", "18:00", "fullday")).toBe(true);
  });

  it("any booking conflicts with a new fullday slot", () => {
    expect(slotsConflict("09:00", "14:00", "fullday")).toBe(true);
    expect(slotsConflict("14:00", "18:00", "fullday")).toBe(true);
  });

  it("same slots conflict", () => {
    expect(slotsConflict("09:00", "14:00", "morning")).toBe(true);
    expect(slotsConflict("14:00", "18:00", "evening")).toBe(true);
  });

  it("morning and evening do not conflict", () => {
    expect(slotsConflict("09:00", "14:00", "evening")).toBe(false);
    expect(slotsConflict("14:00", "18:00", "morning")).toBe(false);
  });

  it("null-time (legacy) bookings block everything", () => {
    expect(slotsConflict(null, null, "morning")).toBe(true);
    expect(slotsConflict(null, null, "evening")).toBe(true);
  });
});

describe("useSectionAwareAvailability", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  function mockTables(tables: Record<string, unknown[]>) {
    fromMock.mockImplementation((table: string) =>
      chainResolving(tables[table] ?? [])
    );
  }

  it("reports full availability when there are no bookings", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() =>
      useSectionAwareAvailability("hall-1", "2026-08-01")
    );

    await waitFor(() => expect(result.current.sectionCount).toBe(1));
    expect(result.current.slotAvailability.morning.available).toBe(1);
    expect(result.current.slotAvailability.evening.available).toBe(1);
    expect(result.current.slotAvailability.fullday.available).toBe(1);
    expect(result.current.isSlotAvailable("morning")).toBe(true);
    expect(result.current.isClosed).toBe(false);
  });

  it("blocks all slots for a single-section hall with a fullday booking", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [
        { section_id: "s1", event_start_time: "09:00", event_end_time: "18:00" },
      ],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() =>
      useSectionAwareAvailability("hall-1", "2026-08-01")
    );

    await waitFor(() =>
      expect(result.current.slotAvailability.morning.available).toBe(0)
    );
    expect(result.current.isSlotAvailable("morning")).toBe(false);
    expect(result.current.isSlotAvailable("evening")).toBe(false);
    expect(result.current.isSlotAvailable("fullday")).toBe(false);
  });

  it("leaves the evening free when only the morning is booked (single section)", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [
        { section_id: "s1", event_start_time: "09:00", event_end_time: "14:00" },
      ],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() =>
      useSectionAwareAvailability("hall-1", "2026-08-01")
    );

    await waitFor(() =>
      expect(result.current.slotAvailability.morning.available).toBe(0)
    );
    expect(result.current.isSlotAvailable("evening")).toBe(true);
    // fullday overlaps the booked morning, so it must be blocked
    expect(result.current.isSlotAvailable("fullday")).toBe(false);
  });

  it("counts per-section availability for multi-section halls", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }, { id: "s2" }, { id: "s3" }],
      bookings: [
        { section_id: "s1", event_start_time: "09:00", event_end_time: "14:00" },
      ],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() =>
      useSectionAwareAvailability("hall-1", "2026-08-01")
    );

    await waitFor(() => expect(result.current.sectionCount).toBe(3));
    expect(result.current.hasMultipleSections).toBe(true);
    expect(result.current.slotAvailability.morning.available).toBe(2);
    expect(result.current.slotAvailability.evening.available).toBe(3);
    expect(result.current.isSectionAvailable("morning", "s1")).toBe(false);
    expect(result.current.isSectionAvailable("morning", "s2")).toBe(true);
    expect(result.current.isSectionAvailable("evening", "s1")).toBe(true);
  });

  it("treats an unassigned booking as blocking all sections", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }, { id: "s2" }],
      bookings: [
        { section_id: null, event_start_time: "09:00", event_end_time: "14:00" },
      ],
      hall_closed_dates: [],
    });

    const { result } = renderHook(() =>
      useSectionAwareAvailability("hall-1", "2026-08-01")
    );

    await waitFor(() =>
      expect(result.current.slotAvailability.morning.available).toBe(0)
    );
    expect(result.current.isSectionAvailable("morning", "s1")).toBe(false);
    expect(result.current.isSectionAvailable("morning", "s2")).toBe(false);
    // evening is untouched by a morning booking
    expect(result.current.slotAvailability.evening.available).toBe(2);
  });

  it("marks everything unavailable when the hall is closed that day", async () => {
    mockTables({
      hall_sections: [{ id: "s1" }],
      bookings: [],
      hall_closed_dates: [{ id: "closed-1" }],
    });

    const { result } = renderHook(() =>
      useSectionAwareAvailability("hall-1", "2026-08-01")
    );

    await waitFor(() => expect(result.current.isClosed).toBe(true));
    expect(result.current.isSlotAvailable("morning")).toBe(false);
    expect(result.current.isSectionAvailable("morning", "s1")).toBe(false);
  });

  it("does not query when hallId or date is missing", async () => {
    mockTables({});
    const { result } = renderHook(() =>
      useSectionAwareAvailability(null, null)
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bookings).toEqual([]);
    expect(result.current.sectionCount).toBe(0);
  });
});
