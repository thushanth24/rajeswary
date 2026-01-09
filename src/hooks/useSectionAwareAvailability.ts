import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BookingSlot {
  section_id: string | null;
  event_start_time: string | null;
  event_end_time: string | null;
}

interface SlotAvailability {
  morning: { available: number; total: number };
  evening: { available: number; total: number };
  fullday: { available: number; total: number };
}

interface DateAvailability {
  status: "available" | "partial" | "blocked" | "closed";
  slotAvailability: SlotAvailability;
  sectionCount: number;
}

// Check if two time slots conflict
function slotsConflict(
  existingStart: string | null,
  existingEnd: string | null,
  newSlotId: string
): boolean {
  // Determine existing slot type
  const existingSlot = getSlotType(existingStart, existingEnd);
  
  // Full day conflicts with everything
  if (existingSlot === "fullday" || newSlotId === "fullday") {
    return true;
  }
  
  // Same slots conflict
  if (existingSlot === newSlotId) {
    return true;
  }
  
  // Morning and evening don't conflict
  return false;
}

function getSlotType(start: string | null, end: string | null): string {
  // Handle null times (legacy bookings) - treat as fullday to be safe
  if (!start || !end) return "fullday";
  
  // Normalize time strings (remove seconds if present)
  const normalizedStart = start.substring(0, 5);
  const normalizedEnd = end.substring(0, 5);
  
  if (normalizedStart === "08:00" && normalizedEnd === "16:00") return "morning";
  if (normalizedStart === "17:00" && normalizedEnd === "00:00") return "evening";
  if (normalizedStart === "08:00" && normalizedEnd === "00:00") return "fullday";
  return "fullday"; // Unknown patterns treated as fullday for safety
}

export function useSectionAwareAvailability(
  hallId: string | null,
  date: string | null
) {
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [sectionCount, setSectionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Fetch section count
  useEffect(() => {
    const fetchSectionCount = async () => {
      if (!hallId) {
        setSectionCount(0);
        return;
      }

      const { data } = await supabase
        .from("hall_sections")
        .select("id")
        .eq("hall_id", hallId)
        .eq("is_active", true);

      setSectionCount(data?.length || 0);
    };

    fetchSectionCount();
  }, [hallId]);

  // Fetch bookings and closed status for the date
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!hallId || !date) {
        setBookings([]);
        setIsClosed(false);
        return;
      }

      setLoading(true);

      // Parallel fetch bookings and closed dates
      // Include new, acknowledged, and confirmed bookings - all count as "booked"
      const [bookingsResult, closedResult] = await Promise.all([
        supabase
          .from("bookings")
          .select("section_id, event_start_time, event_end_time")
          .eq("hall_id", hallId)
          .eq("event_date", date)
          .in("status", ["new", "acknowledged", "confirmed"]),
        supabase
          .from("hall_closed_dates")
          .select("id")
          .eq("hall_id", hallId)
          .eq("closed_date", date)
          .limit(1),
      ]);

      if (!bookingsResult.error && bookingsResult.data) {
        setBookings(bookingsResult.data);
      }

      setIsClosed(!!(closedResult.data && closedResult.data.length > 0));
      setLoading(false);
    };

    fetchAvailability();
  }, [hallId, date]);

  // Calculate availability for each time slot
  const slotAvailability = useMemo((): SlotAvailability => {
    const totalSections = sectionCount > 0 ? sectionCount : 1;
    const hasMultipleSections = sectionCount > 1;

    const calculateSlotAvailable = (slotId: string): number => {
      if (!hasMultipleSections) {
        // Single section hall: blocked if any booking conflicts with this slot
        const hasConflict = bookings.some((b) =>
          slotsConflict(b.event_start_time, b.event_end_time, slotId)
        );
        return hasConflict ? 0 : 1;
      }

      // Multi-section hall: count how many sections are available for this slot
      const bookedSectionsForSlot = new Set<string>();

      bookings.forEach((b) => {
        if (slotsConflict(b.event_start_time, b.event_end_time, slotId)) {
          if (b.section_id) {
            bookedSectionsForSlot.add(b.section_id);
          } else {
            // Unassigned booking - treat as blocking ALL sections for safety
            // (admin needs to assign section first)
            for (let i = 0; i < totalSections; i++) {
              bookedSectionsForSlot.add(`unassigned-${i}`);
            }
          }
        }
      });

      return Math.max(0, totalSections - bookedSectionsForSlot.size);
    };

    return {
      morning: { available: calculateSlotAvailable("morning"), total: totalSections },
      evening: { available: calculateSlotAvailable("evening"), total: totalSections },
      fullday: { available: calculateSlotAvailable("fullday"), total: totalSections },
    };
  }, [bookings, sectionCount]);

  // Get available sections for a specific time slot
  const getAvailableSections = useCallback(
    async (slotId: string): Promise<string[]> => {
      if (!hallId || !date || sectionCount <= 1) {
        return [];
      }

      // Fetch all sections
      const { data: sections } = await supabase
        .from("hall_sections")
        .select("id, name")
        .eq("hall_id", hallId)
        .eq("is_active", true)
        .order("display_order");

      if (!sections) return [];

      // Find which sections are booked for this slot
      const bookedSectionIds = new Set<string>();

      bookings.forEach((b) => {
        if (slotsConflict(b.event_start_time, b.event_end_time, slotId)) {
          if (b.section_id) {
            bookedSectionIds.add(b.section_id);
          }
        }
      });

      // Check for any unassigned bookings that conflict - if so, all sections are unavailable
      const hasUnassigned = bookings.some(
        (b) =>
          !b.section_id &&
          slotsConflict(b.event_start_time, b.event_end_time, slotId)
      );

      if (hasUnassigned) {
        return []; // All blocked due to unassigned booking
      }

      return sections
        .filter((s) => !bookedSectionIds.has(s.id))
        .map((s) => s.id);
    },
    [hallId, date, bookings, sectionCount]
  );

  // Check if a specific slot is available (at least one section)
  const isSlotAvailable = useCallback(
    (slotId: string): boolean => {
      if (isClosed) return false;
      const slot = slotAvailability[slotId as keyof SlotAvailability];
      return slot ? slot.available > 0 : false;
    },
    [slotAvailability, isClosed]
  );

  // Check if a specific section is available for a slot
  const isSectionAvailable = useCallback(
    (slotId: string, sectionId: string): boolean => {
      if (isClosed) return false;
      
      // Check if this section has a conflicting booking
      const hasConflict = bookings.some(
        (b) =>
          b.section_id === sectionId &&
          slotsConflict(b.event_start_time, b.event_end_time, slotId)
      );

      if (hasConflict) return false;

      // Check for unassigned bookings that would block all sections
      const hasUnassigned = bookings.some(
        (b) =>
          !b.section_id &&
          slotsConflict(b.event_start_time, b.event_end_time, slotId)
      );

      return !hasUnassigned;
    },
    [bookings, isClosed]
  );

  return {
    slotAvailability,
    sectionCount,
    hasMultipleSections: sectionCount > 1,
    loading,
    isClosed,
    isSlotAvailable,
    isSectionAvailable,
    getAvailableSections,
    bookings,
  };
}

// Hook for checking overall date availability (for calendar display)
export function useDateAvailability(hallId: string | null, date: string | null) {
  const {
    slotAvailability,
    sectionCount,
    hasMultipleSections,
    loading,
    isClosed,
  } = useSectionAwareAvailability(hallId, date);

  const dateStatus = useMemo((): DateAvailability => {
    if (isClosed) {
      return {
        status: "closed",
        slotAvailability,
        sectionCount,
      };
    }

    const totalSlots = sectionCount > 0 ? sectionCount : 1;

    // Check if any slot has any availability
    const allBlocked =
      slotAvailability.morning.available === 0 &&
      slotAvailability.evening.available === 0 &&
      slotAvailability.fullday.available === 0;

    // Check if fully available (all slots have full capacity)
    const fullyAvailable =
      slotAvailability.morning.available === totalSlots &&
      slotAvailability.evening.available === totalSlots &&
      slotAvailability.fullday.available === totalSlots;

    if (allBlocked) {
      return { status: "blocked", slotAvailability, sectionCount };
    }

    if (fullyAvailable) {
      return { status: "available", slotAvailability, sectionCount };
    }

    return { status: "partial", slotAvailability, sectionCount };
  }, [slotAvailability, sectionCount, isClosed]);

  return { ...dateStatus, loading, hasMultipleSections };
}
