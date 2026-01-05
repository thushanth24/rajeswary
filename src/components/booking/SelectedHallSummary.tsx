import { Users, Building2, CalendarIcon, Clock, X } from "lucide-react";
import { format } from "date-fns";
import type { Hall } from "@/hooks/useHalls";
import { cn } from "@/lib/utils";

interface SelectedHallSummaryProps {
  hall: Hall;
  eventDate?: Date;
  timeSlot?: string;
  guestCount?: number;
  onChangeHall?: () => void;
  className?: string;
}

const timeSlotLabels: Record<string, string> = {
  morning: "Morning (8 AM - 4 PM)",
  evening: "Evening (5 PM - 12 AM)",
  fullday: "Full Day",
};

export function SelectedHallSummary({
  hall,
  eventDate,
  timeSlot,
  guestCount,
  onChangeHall,
  className,
}: SelectedHallSummaryProps) {
  const isOverCapacity = guestCount && guestCount > hall.capacity.max;
  const isUnderCapacity = guestCount && guestCount < hall.capacity.min * 0.5;

  return (
    <div className={cn(
      "bg-muted/50 border border-border rounded-lg p-4 mb-6",
      className
    )}>
      <div className="flex items-start gap-4">
        <img
          src={hall.image}
          alt={hall.name}
          className="w-16 h-16 object-cover rounded-md shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <h4 className="font-semibold text-foreground truncate text-sm md:text-base">{hall.name}</h4>
            </div>
            {onChangeHall && (
              <button
                onClick={onChangeHall}
                className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
              >
                Change
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
            </div>
            
            {eventDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{format(eventDate, "MMM d, yyyy")}</span>
              </div>
            )}
            
            {timeSlot && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeSlotLabels[timeSlot] || timeSlot}</span>
              </div>
            )}
          </div>

          {/* Capacity Warning */}
          {isOverCapacity && (
            <div className="mt-2 flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
              <X className="h-3 w-3" />
              <span>Guest count exceeds hall capacity ({hall.capacity.max} max)</span>
            </div>
          )}
          
          {isUnderCapacity && (
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded">
              <Users className="h-3 w-3" />
              <span>Hall may be too large for {guestCount} guests (min recommended: {Math.floor(hall.capacity.min * 0.5)})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
