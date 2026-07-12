import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("@/integrations/supabase/client", async () => {
  const { supabaseMock } = await import("@/test/supabase-mock");
  return { supabase: supabaseMock };
});

import {
  setTableData,
  setTableError,
  resetSupabaseMock,
} from "@/test/supabase-mock";
import { useHalls, useHall } from "./useHalls";
import { useHallDetails } from "./useHallDetails";
import { useHallSections, useMultiSectionAvailability } from "./useHallSections";
import { useBungalowRooms, dbRoomToBungalow } from "./useBungalowRooms";
import { useIsMobile } from "./use-mobile";
import { reducer } from "./use-toast";
import { bungalows as staticBungalows } from "@/data/bungalows";

const dbHall = (overrides: Record<string, unknown> = {}) => ({
  id: "uuid-1",
  slug: "chelva-mahal",
  name: "Chelva Mahal",
  image_url: null,
  capacity_min: 300,
  capacity_max: 800,
  description: "desc",
  short_description: "short",
  features: ["Stage"],
  event_types: ["Wedding"],
  price_range: "₹1,00,000",
  has_ac: true,
  has_parking: null,
  has_dining: true,
  has_stage: true,
  has_power_backup: true,
  has_bride_room: true,
  has_groom_room: true,
  washrooms_count: null,
  is_active: true,
  ...overrides,
});

beforeEach(() => {
  resetSupabaseMock();
});

describe("useHalls", () => {
  it("maps DB halls to the UI shape with null-safe defaults", async () => {
    setTableData({ halls: [dbHall()] });

    const { result } = renderHook(() => useHalls());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const hall = result.current.halls[0];
    expect(hall.name).toBe("Chelva Mahal");
    expect(hall.capacity).toEqual({ min: 300, max: 800 });
    // nulls fall back to safe defaults
    expect(hall.facilities.parking).toBe(false);
    expect(hall.facilities.washrooms).toBe(0);
    // null image_url falls back to a static image
    expect(hall.image).toBeTruthy();
  });

  it("sorts halls by the fixed display order", async () => {
    setTableData({
      halls: [
        dbHall({ id: "1", slug: "chelva-mahal" }),
        dbHall({ id: "2", slug: "raajeshwariy-kondavil" }),
        dbHall({ id: "3", slug: "some-unknown-hall" }),
        dbHall({ id: "4", slug: "raajeshwariy-tellipalai" }),
      ],
    });

    const { result } = renderHook(() => useHalls());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.halls.map((h) => h.slug)).toEqual([
      "raajeshwariy-kondavil",
      "raajeshwariy-tellipalai",
      "chelva-mahal",
      "some-unknown-hall", // unknown slugs go last
    ]);
  });

  it("finds halls by id or slug", async () => {
    setTableData({ halls: [dbHall()] });
    const { result } = renderHook(() => useHalls());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.getHallById("uuid-1")?.name).toBe("Chelva Mahal");
    expect(result.current.getHallById("chelva-mahal")?.name).toBe("Chelva Mahal");
    expect(result.current.getHallBySlug("chelva-mahal")?.id).toBe("uuid-1");
    expect(result.current.getHallBySlug("nope")).toBeUndefined();
  });

  it("sets an error message when the query fails", async () => {
    setTableError("halls", "connection refused");
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useHalls());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to load halls");
    expect(result.current.halls).toEqual([]);
    errSpy.mockRestore();
  });
});

describe("useHall", () => {
  it("loads a single hall by slug", async () => {
    setTableData({ halls: [dbHall()] });
    const { result } = renderHook(() => useHall("chelva-mahal"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hall?.name).toBe("Chelva Mahal");
    expect(result.current.error).toBeNull();
  });

  it("reports 'Hall not found' when no row matches", async () => {
    setTableData({ halls: [] });
    const { result } = renderHook(() => useHall("ghost-hall"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hall).toBeNull();
    expect(result.current.error).toBe("Hall not found");
  });

  it("does nothing when slug is undefined", async () => {
    const { result } = renderHook(() => useHall(undefined));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hall).toBeNull();
  });
});

describe("useHallDetails", () => {
  it("returns DB images, reviews and event photos when present", async () => {
    setTableData({
      halls: [{ floor_plan_url: "https://example.com/plan.png" }],
      hall_images: [{ id: "i1", image_url: "img.jpg", caption: "cap" }],
      hall_reviews: [
        {
          id: "r1",
          customer_name: "Priya",
          event_type: "Wedding",
          event_date: "2026-01-01",
          rating: 5,
          review_text: "Great!",
        },
      ],
      hall_event_photos: [
        { id: "p1", image_url: "photo.jpg", event_type: null, event_date: null, caption: null },
      ],
    });

    const { result } = renderHook(() => useHallDetails("some-hall-id"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.details.floorPlanUrl).toBe("https://example.com/plan.png");
    expect(result.current.details.images).toHaveLength(1);
    expect(result.current.details.reviews[0].customer_name).toBe("Priya");
    expect(result.current.details.eventPhotos).toHaveLength(1);
  });

  it("falls back to bundled static gallery images for known halls", async () => {
    setTableData({ halls: [], hall_images: [], hall_reviews: [], hall_event_photos: [] });

    // known hall UUID with a static gallery
    const { result } = renderHook(() =>
      useHallDetails("23bac0a2-9065-4e0a-8de8-8ef73fe4949f")
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.details.images.length).toBeGreaterThan(0);
    expect(result.current.details.images[0].id).toMatch(/^static-/);
  });

  it("returns empty images for unknown halls with no DB images", async () => {
    setTableData({ halls: [], hall_images: [], hall_reviews: [], hall_event_photos: [] });
    const { result } = renderHook(() => useHallDetails("unknown-hall"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.details.images).toEqual([]);
  });
});

describe("useHallSections", () => {
  it("loads active sections and reports multi-section state", async () => {
    setTableData({
      hall_sections: [
        { id: "s1", hall_id: "h1", name: "A", display_order: 1, is_active: true },
        { id: "s2", hall_id: "h1", name: "B", display_order: 2, is_active: true },
      ],
    });

    const { result } = renderHook(() => useHallSections("h1"));
    await waitFor(() => expect(result.current.sections).toHaveLength(2));
    expect(result.current.hasMultipleSections).toBe(true);
  });

  it("returns no sections when hallId is null", async () => {
    const { result } = renderHook(() => useHallSections(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sections).toEqual([]);
    expect(result.current.hasMultipleSections).toBe(false);
  });
});

describe("useMultiSectionAvailability", () => {
  it("counts sections for the hall", async () => {
    setTableData({ hall_sections: [{ id: "s1" }, { id: "s2" }, { id: "s3" }] });
    const { result } = renderHook(() => useMultiSectionAvailability("h1"));
    await waitFor(() => expect(result.current.sectionCount).toBe(3));
    expect(result.current.hasMultipleSections).toBe(true);
  });
});

describe("useBungalowRooms", () => {
  const dbRoom = {
    id: "room-1",
    name: "Deluxe AC",
    location: "East Wing",
    room_type: "Double Room",
    ac_type: "AC",
    max_adults: 2,
    max_children: 1,
    tariff_room_only: 6000,
    tariff_bb: 8000,
    tariff_full_board: 12000,
    amenities: ["Wi-Fi"],
    description: "desc",
    rules: ["No smoking"],
    check_in_time: "12:00 PM",
    check_out_time: "11:00 AM",
    images: ["https://cdn.example.com/room.jpg"],
    available: true,
    display_order: 1,
  };

  it("uses DB rooms when available", async () => {
    setTableData({ bungalow_rooms: [dbRoom] });
    const { result } = renderHook(() => useBungalowRooms());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.rooms).toHaveLength(1);
    expect(result.current.bungalowsList[0].name).toBe("Deluxe AC");
    expect(result.current.bungalowsList[0].tariff.fullBoard).toBe(12000);
  });

  it("falls back to static bungalows when the DB is empty", async () => {
    setTableData({ bungalow_rooms: [] });
    const { result } = renderHook(() => useBungalowRooms());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bungalowsList).toEqual(staticBungalows);
  });

  it("falls back to static bungalows on a DB error", async () => {
    setTableError("bungalow_rooms", "boom");
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useBungalowRooms());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bungalowsList).toEqual(staticBungalows);
    errSpy.mockRestore();
  });

  it("dbRoomToBungalow replaces unsplash placeholder images with local ones", () => {
    const converted = dbRoomToBungalow({
      ...dbRoom,
      images: ["https://images.unsplash.com/photo-123"],
    });
    expect(converted.images.every((i) => !i.includes("unsplash"))).toBe(true);
    expect(converted.images.length).toBeGreaterThan(0);
  });

  it("dbRoomToBungalow uses local images when the room has none", () => {
    const converted = dbRoomToBungalow({ ...dbRoom, images: [] });
    expect(converted.images.length).toBeGreaterThan(0);
  });
});

describe("useIsMobile", () => {
  it("returns false for desktop widths", async () => {
    window.innerWidth = 1280;
    const { result } = renderHook(() => useIsMobile());
    await waitFor(() => expect(result.current).toBe(false));
  });

  it("returns true below the 768px breakpoint", async () => {
    window.innerWidth = 375;
    const { result } = renderHook(() => useIsMobile());
    await waitFor(() => expect(result.current).toBe(true));
  });
});

describe("toast reducer", () => {
  const baseToast = { id: "1", open: true } as never;

  it("adds a toast and enforces the limit of 1", () => {
    const s1 = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: baseToast });
    expect(s1.toasts).toHaveLength(1);

    const second = { id: "2", open: true } as never;
    const s2 = reducer(s1, { type: "ADD_TOAST", toast: second });
    expect(s2.toasts).toHaveLength(1);
    expect(s2.toasts[0].id).toBe("2");
  });

  it("updates a toast in place", () => {
    const s1 = { toasts: [{ id: "1", open: true, title: "old" }] } as never;
    const s2 = reducer(s1, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "new" } as never,
    });
    expect(s2.toasts[0].title).toBe("new");
  });

  it("dismisses a toast by setting open to false", () => {
    const s1 = { toasts: [{ id: "1", open: true }] } as never;
    const s2 = reducer(s1, { type: "DISMISS_TOAST", toastId: "1" });
    expect(s2.toasts[0].open).toBe(false);
  });

  it("removes a toast entirely", () => {
    const s1 = { toasts: [{ id: "1", open: false }] } as never;
    const s2 = reducer(s1, { type: "REMOVE_TOAST", toastId: "1" });
    expect(s2.toasts).toHaveLength(0);
  });
});
