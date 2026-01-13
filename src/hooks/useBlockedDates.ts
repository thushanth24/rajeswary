import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BookingInfo {
  event_date: string;
  event_start_time: string | null;
  event_end_time: string | null;
  section_id: string | null;
}

interface BlockedDateInfo {
  date: string;
  hallId: string;
  reason: "confirmed" | "closed" | "partial";
}

function getSlotType(start: string | null, end: string | null): string {
  if (!start || !end) return "fullday";
  const normalizedStart = start.substring(0, 5);
  const normalizedEnd = end.substring(0, 5);
  if (normalizedStart === "09:00" && normalizedEnd === "14:00") return "morning";
  if (normalizedStart === "14:00" && normalizedEnd === "18:00") return "evening";
  if (normalizedStart === "09:00" && normalizedEnd === "18:00") return "fullday";
  return "fullday";
}

// Check if a date is fully booked (no available slots) - defined outside hook
function isDateFullyBooked(bookings: BookingInfo[], totalSections: number): boolean {
  const hasMultipleSections = totalSections > 1;

  const checkSlotBlocked = (slotId: string): boolean => {
    if (!hasMultipleSections) {
      return bookings.some((b) => {
        const bookingSlot = getSlotType(b.event_start_time, b.event_end_time);
        if (bookingSlot === "fullday" || slotId === "fullday") return true;
        return bookingSlot === slotId;
      });
    }

    const bookedSections = new Set<string>();
    let hasUnassigned = false;

    bookings.forEach((b) => {
      const bookingSlot = getSlotType(b.event_start_time, b.event_end_time);
      const conflicts = bookingSlot === "fullday" || slotId === "fullday" || bookingSlot === slotId;
      
      if (conflicts) {
        if (b.section_id) {
          bookedSections.add(b.section_id);
        } else {
          hasUnassigned = true;
        }
      }
    });

    if (hasUnassigned) return true;
    return bookedSections.size >= totalSections;
  };

  const morningBlocked = checkSlotBlocked("morning");
  const eveningBlocked = checkSlotBlocked("evening");
  const fulldayBlocked = checkSlotBlocked("fullday");

  return morningBlocked && eveningBlocked && fulldayBlocked;
}

export function useBlockedDates(hallId: string | null) {
  const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionCount, setSectionCount] = useState(1);

  useEffect(() => {
    if (!hallId) {
      setBlockedDates([]);
      setLoading(false);
      return;
    }

    const fetchBlockedDates = async () => {
      setLoading(true);

      const [sectionsResult, bookingsResult, closedResult] = await Promise.all([
        supabase
          .from("hall_sections")
          .select("id")
          .eq("hall_id", hallId)
          .eq("is_active", true),
        supabase
          .from("bookings")
          .select("event_date, event_start_time, event_end_time, section_id")
          .eq("hall_id", hallId)
          .in("status", ["new", "acknowledged", "confirmed"]),
        supabase
          .from("hall_closed_dates")
          .select("closed_date, hall_id")
          .eq("hall_id", hallId),
      ]);

      const sections = sectionsResult.data?.length || 1;
      setSectionCount(sections);

      const blocked: BlockedDateInfo[] = [];

      if (!closedResult.error && closedResult.data) {
        closedResult.data.forEach((closed) => {
          blocked.push({
            date: closed.closed_date,
            hallId: closed.hall_id,
            reason: "closed",
          });
        });
      }

      if (!bookingsResult.error && bookingsResult.data) {
        const bookingsByDate = new Map<string, BookingInfo[]>();
        
        bookingsResult.data.forEach((booking) => {
          const existing = bookingsByDate.get(booking.event_date) || [];
          existing.push(booking);
          bookingsByDate.set(booking.event_date, existing);
        });

        bookingsByDate.forEach((dateBookings, eventDate) => {
          if (blocked.some((b) => b.date === eventDate && b.reason === "closed")) {
            return;
          }

          const isFullyBlocked = isDateFullyBooked(dateBookings, sections);
          
          if (isFullyBlocked) {
            blocked.push({
              date: eventDate,
              hallId: hallId,
              reason: "confirmed",
            });
          }
        });
      }

      setBlockedDates(blocked);
      setLoading(false);
    };

    fetchBlockedDates();
  }, [hallId]);

  const isDateBlocked = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.some((b) => b.date === dateStr);
  };

  const getBlockedReason = (date: Date): "confirmed" | "closed" | "partial" | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    const blocked = blockedDates.find((b) => b.date === dateStr);
    return blocked?.reason || null;
  };

  return {
    blockedDates,
    loading,
    isDateBlocked,
    getBlockedReason,
    sectionCount,
  };
}