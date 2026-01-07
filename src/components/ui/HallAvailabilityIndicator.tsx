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
  reason: "confirmed" | "closed" | "partial";
  availableSections?: number;
  totalSections?: number;
}

export function HallAvailabilityIndicator({ hallSlug }: HallAvailabilityIndicatorProps) {
  const [hallId, setHallId] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [sectionCount, setSectionCount] = useState(0);

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

  // Fetch section count for this hall
  useEffect(() => {
    const fetchSectionCount = async () => {
      if (!hallId) return;
      
      const { data } = await supabase
        .from("hall_sections")
        .select("id")
        .eq("hall_id", hallId)
        .eq("is_active", true);
      
      setSectionCount(data?.length || 0);
    };
    fetchSectionCount();
  }, [hallId]);

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
        .select("event_date, section_id")
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
      const hasMultipleSections = sectionCount > 1;
      
      // Group bookings by date for multi-section halls
      if (hasMultipleSections) {
        const bookingsByDate = new Map<string, { withSection: number; withoutSection: number }>();
        
        bookings?.forEach((b) => {
          const existing = bookingsByDate.get(b.event_date) || { withSection: 0, withoutSection: 0 };
          if (b.section_id) {
            existing.withSection++;
          } else {
            existing.withoutSection++;
          }
          bookingsByDate.set(b.event_date, existing);
        });

        bookingsByDate.forEach((counts, date) => {
          const bookedSectionCount = counts.withSection;
          const unassignedCount = counts.withoutSection;
          const availableSections = sectionCount - bookedSectionCount;
          
          // If there are unassigned bookings, treat date as fully booked (manager needs to assign)
          if (unassignedCount > 0 || availableSections === 0) {
            blocked.push({ date, reason: "confirmed", availableSections: 0, totalSections: sectionCount });
          } else if (bookedSectionCount > 0) {
            // Some sections booked, some available
            blocked.push({ date, reason: "partial", availableSections, totalSections: sectionCount });
          }
        });
      } else {
        // Single section hall - original logic
        bookings?.forEach((b) => {
          blocked.push({ date: b.event_date, reason: "confirmed" });
        });
      }
      
      closedDates?.forEach((c) => {
        // Only add if not already in the list
        if (!blocked.find((b) => b.date === c.closed_date)) {
          blocked.push({ date: c.closed_date, reason: "closed" });
        }
      });

      setBlockedDates(blocked);
      setLoading(false);
    };

    fetchBlockedDates();
  }, [hallId, currentMonth, sectionCount]);

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
            const isPartial = blockedInfo?.reason === "partial";
            const isClosed = blockedInfo?.reason === "closed";
            const past = isPast(day);
            const today = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square flex items-center justify-center text-[9px] rounded-sm",
                  past && "text-muted-foreground/40",
                  !past && !isBooked && !isClosed && !isPartial && "text-green-700 bg-green-500/15",
                  isBooked && !past && "text-destructive bg-destructive/15 font-medium",
                  isPartial && !past && "text-blue-600 bg-blue-500/15",
                  isClosed && !past && "text-yellow-600 bg-yellow-500/15",
                  today && "ring-1 ring-green-600"
                )}
                title={
                  isBooked
                    ? "Fully Booked"
                    : isPartial
                    ? `${blockedInfo?.availableSections}/${blockedInfo?.totalSections} sections available`
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
          <div className="w-2 h-2 rounded-sm bg-green-500/15 border border-green-500/30" />
          <span>Available</span>
        </div>
        {sectionCount > 1 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-blue-500/15 border border-blue-500/30" />
            <span>Partial</span>
          </div>
        )}
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