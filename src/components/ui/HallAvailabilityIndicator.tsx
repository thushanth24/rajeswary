import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HallAvailabilityIndicatorProps {
  hallSlug: string;
}

interface BlockedDate {
  date: string;
  reason: "confirmed" | "closed";
}

export function HallAvailabilityIndicator({ hallSlug }: HallAvailabilityIndicatorProps) {
  const [hallId, setHallId] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch hall UUID
  useEffect(() => {
    const fetchHallId = async () => {
      const { data } = await supabase
        .from("halls")
        .select("id")
        .eq("slug", hallSlug)
        .maybeSingle();
      
      if (data) {
        setHallId(data.id);
      }
    };
    fetchHallId();
  }, [hallSlug]);

  // Fetch blocked dates for the current month
  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (!hallId) return;
      
      setLoading(true);
      const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

      // Fetch confirmed bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("event_date")
        .eq("hall_id", hallId)
        .eq("status", "confirmed")
        .gte("event_date", monthStart)
        .lte("event_date", monthEnd);

      // Fetch closed dates
      const { data: closedDates } = await supabase
        .from("hall_closed_dates")
        .select("closed_date")
        .eq("hall_id", hallId)
        .gte("closed_date", monthStart)
        .lte("closed_date", monthEnd);

      const blocked: BlockedDate[] = [];
      
      bookings?.forEach((b) => {
        blocked.push({ date: b.event_date, reason: "confirmed" });
      });
      
      closedDates?.forEach((c) => {
        blocked.push({ date: c.closed_date, reason: "closed" });
      });

      setBlockedDates(blocked);
      setLoading(false);
    };

    fetchBlockedDates();
  }, [hallId, currentMonth]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const isPast = (date: Date) => {
    return isBefore(date, startOfToday());
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const canGoPrev = currentMonth > new Date();

  return (
    <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevMonth();
          }}
          disabled={!canGoPrev}
          className={cn(
            "p-1 rounded hover:bg-muted transition-colors",
            !canGoPrev && "opacity-30 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <span className="text-xs font-medium text-foreground">
          {format(currentMonth, "MMM yyyy")}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextMonth();
          }}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="h-16 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-0.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[8px] text-muted-foreground font-medium">
              {d}
            </div>
          ))}
          {/* Empty cells for days before the first of month */}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const blockedInfo = blockedDates.find((b) => b.date === dateStr);
            const isBooked = blockedInfo?.reason === "confirmed";
            const isClosed = blockedInfo?.reason === "closed";
            const past = isPast(day);
            const today = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square flex items-center justify-center text-[9px] rounded-sm",
                  past && "text-muted-foreground/40",
                  !past && !isBooked && !isClosed && "text-primary bg-primary/10",
                  isBooked && !past && "text-destructive bg-destructive/15 font-medium",
                  isClosed && !past && "text-yellow-600 bg-yellow-500/15",
                  today && "ring-1 ring-primary"
                )}
                title={
                  isBooked
                    ? "Booked"
                    : isClosed
                    ? "Closed"
                    : past
                    ? "Past date"
                    : "Available"
                }
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mt-2 text-[9px] text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-primary/10 border border-primary/30" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-destructive/15 border border-destructive/30" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-yellow-500/15 border border-yellow-500/30" />
          <span>Closed</span>
        </div>
      </div>
    </div>
  );
}
