import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BlockedDateInfo {
  date: string;
  hallId: string;
  reason: "confirmed" | "closed";
}

export function useBlockedDates(hallId: string | null) {
  const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hallId) {
      setBlockedDates([]);
      setLoading(false);
      return;
    }

    const fetchBlockedDates = async () => {
      setLoading(true);

      // Fetch confirmed bookings for this hall
      const { data: confirmedBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("event_date, hall_id")
        .eq("hall_id", hallId)
        .eq("status", "confirmed");

      // Fetch closed dates for this hall
      const { data: closedDates, error: closedError } = await supabase
        .from("hall_closed_dates")
        .select("closed_date, hall_id")
        .eq("hall_id", hallId);

      const blocked: BlockedDateInfo[] = [];

      if (!bookingsError && confirmedBookings) {
        confirmedBookings.forEach((booking) => {
          blocked.push({
            date: booking.event_date,
            hallId: booking.hall_id,
            reason: "confirmed",
          });
        });
      }

      if (!closedError && closedDates) {
        closedDates.forEach((closed) => {
          blocked.push({
            date: closed.closed_date,
            hallId: closed.hall_id,
            reason: "closed",
          });
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

  const getBlockedReason = (date: Date): "confirmed" | "closed" | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    const blocked = blockedDates.find((b) => b.date === dateStr);
    return blocked?.reason || null;
  };

  return {
    blockedDates,
    loading,
    isDateBlocked,
    getBlockedReason,
  };
}