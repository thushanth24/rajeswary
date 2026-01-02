import { useState, useEffect, useMemo } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  customer_name: string;
  event_type: string;
  event_date: string;
  status: string;
  hall_id: string;
  customer_phone: string;
  expected_guests: number | null;
  event_start_time: string | null;
  event_end_time: string | null;
  special_requests: string | null;
}

interface Hall {
  id: string;
  name: string;
  slug: string;
}

interface ClosedDate {
  id: string;
  hall_id: string;
  closed_date: string;
  reason: string | null;
}

const AdminCalendar = () => {
  const { toast } = useToast();
  const { isSuperAdmin, isAdmin, user } = useAuth();
  const isAdminOrAbove = isSuperAdmin || isAdmin;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([]);
  const [selectedHallFilter, setSelectedHallFilter] = useState<string>("all");
  const [managerHallId, setManagerHallId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Close date dialog state
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeDateReason, setCloseDateReason] = useState("");
  const [dateToClose, setDateToClose] = useState<Date | null>(null);

  // Booking details dialog
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  // Fetch manager's hall assignment
  useEffect(() => {
    const fetchManagerHall = async () => {
      if (!user?.id || isAdminOrAbove) return;

      const { data, error } = await supabase
        .from("hall_managers")
        .select("hall_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        setManagerHallId(data.hall_id);
      }
    };

    fetchManagerHall();
  }, [user?.id, isAdminOrAbove]);

  // Fetch halls
  useEffect(() => {
    const fetchHalls = async () => {
      const { data, error } = await supabase
        .from("halls")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("name");

      if (!error && data) {
        setHalls(data);
      }
    };

    fetchHalls();
  }, []);

  // Fetch bookings and closed dates for the visible month range
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const start = startOfWeek(startOfMonth(currentMonth));
      const end = endOfWeek(endOfMonth(currentMonth));

      // Build booking query
      let bookingQuery = supabase
        .from("bookings")
        .select("id, customer_name, event_type, event_date, status, hall_id, customer_phone, expected_guests, event_start_time, event_end_time, special_requests")
        .gte("event_date", format(start, "yyyy-MM-dd"))
        .lte("event_date", format(end, "yyyy-MM-dd"))
        .neq("status", "cancelled");

      // For managers, filter by their hall
      if (!isAdminOrAbove && managerHallId) {
        bookingQuery = bookingQuery.eq("hall_id", managerHallId);
      }

      const { data: bookingsData, error: bookingsError } = await bookingQuery;

      if (!bookingsError && bookingsData) {
        setBookings(bookingsData);
      }

      // Fetch closed dates
      let closedQuery = supabase
        .from("hall_closed_dates")
        .select("id, hall_id, closed_date, reason")
        .gte("closed_date", format(start, "yyyy-MM-dd"))
        .lte("closed_date", format(end, "yyyy-MM-dd"));

      if (!isAdminOrAbove && managerHallId) {
        closedQuery = closedQuery.eq("hall_id", managerHallId);
      }

      const { data: closedData, error: closedError } = await closedQuery;

      if (!closedError && closedData) {
        setClosedDates(closedData);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentMonth, managerHallId, isAdminOrAbove]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let filtered = bookings.filter((b) => b.event_date === dateStr);
    
    if (selectedHallFilter !== "all" && isAdminOrAbove) {
      filtered = filtered.filter((b) => b.hall_id === selectedHallFilter);
    }
    
    return filtered;
  };

  // Get closed dates for a specific date
  const getClosedDatesForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let filtered = closedDates.filter((c) => c.closed_date === dateStr);
    
    if (selectedHallFilter !== "all" && isAdminOrAbove) {
      filtered = filtered.filter((c) => c.hall_id === selectedHallFilter);
    }
    
    return filtered;
  };

  // Check if a date has confirmed bookings
  const hasConfirmedBooking = (date: Date) => {
    const dayBookings = getBookingsForDate(date);
    return dayBookings.some((b) => b.status === "confirmed");
  };

  // Check if a date is closed
  const isDateClosed = (date: Date) => {
    return getClosedDatesForDate(date).length > 0;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const dayBookings = getBookingsForDate(date);
    setSelectedDate(date);
    
    if (dayBookings.length > 0) {
      setSelectedBookings(dayBookings);
      setShowBookingDetails(true);
    }
  };

  // Handle closing a date
  const handleCloseDate = async () => {
    if (!dateToClose) return;

    const hallId = isAdminOrAbove && selectedHallFilter !== "all" 
      ? selectedHallFilter 
      : managerHallId;

    if (!hallId) {
      toast({
        title: "Error",
        description: "Please select a hall to close the date for.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("hall_closed_dates")
      .insert({
        hall_id: hallId,
        closed_date: format(dateToClose, "yyyy-MM-dd"),
        reason: closeDateReason.trim() || null,
        created_by: user?.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes("duplicate") 
          ? "This date is already closed for this hall."
          : "Failed to close date. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Date Closed",
        description: `${format(dateToClose, "PPP")} has been closed for bookings.`,
      });
      // Refresh closed dates
      setClosedDates((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          hall_id: hallId,
          closed_date: format(dateToClose, "yyyy-MM-dd"),
          reason: closeDateReason.trim() || null,
        },
      ]);
    }

    setShowCloseDialog(false);
    setCloseDateReason("");
    setDateToClose(null);
  };

  // Handle reopening a date
  const handleReopenDate = async (closedDateId: string) => {
    const { error } = await supabase
      .from("hall_closed_dates")
      .delete()
      .eq("id", closedDateId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reopen date. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Date Reopened",
        description: "The date is now open for bookings.",
      });
      setClosedDates((prev) => prev.filter((c) => c.id !== closedDateId));
    }
  };

  // Get hall name by id
  const getHallName = (hallId: string) => {
    return halls.find((h) => h.id === hallId)?.name || "Unknown Hall";
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Confirmed</Badge>;
      case "acknowledged":
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">Acknowledged</Badge>;
      case "new":
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">New</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Calendar">
      <div className="space-y-4">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
          </div>

          {isAdminOrAbove && (
            <Select value={selectedHallFilter} onValueChange={setSelectedHallFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by hall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Halls</SelectItem>
                {halls.map((hall) => (
                  <SelectItem key={hall.id} value={hall.id}>
                    {hall.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500" />
            <span>Acknowledged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500" />
            <span>New Request</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/30 border border-destructive" />
            <span>Closed</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isToday = isSameDay(day, new Date());
                const dayBookings = getBookingsForDate(day);
                const dayClosed = getClosedDatesForDate(day);
                const hasConfirmed = dayBookings.some((b) => b.status === "confirmed");
                const hasAcknowledged = dayBookings.some((b) => b.status === "acknowledged");
                const hasNew = dayBookings.some((b) => b.status === "new");
                const isClosed = dayClosed.length > 0;
                const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[80px] p-1 border rounded-md cursor-pointer transition-colors",
                      !isCurrentMonth && "opacity-40",
                      isToday && "ring-2 ring-primary",
                      isClosed && "bg-destructive/10 border-destructive/30",
                      hasConfirmed && !isClosed && "bg-green-500/10 border-green-500/30",
                      hasAcknowledged && !hasConfirmed && !isClosed && "bg-blue-500/10 border-blue-500/30",
                      hasNew && !hasConfirmed && !hasAcknowledged && !isClosed && "bg-yellow-500/10 border-yellow-500/30",
                      "hover:bg-accent"
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          !isCurrentMonth && "text-muted-foreground"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      {isClosed && (
                        <Lock className="h-3 w-3 text-destructive" />
                      )}
                    </div>

                    {/* Booking indicators */}
                    <div className="mt-1 space-y-0.5">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={cn(
                            "text-xs px-1 py-0.5 rounded truncate",
                            booking.status === "confirmed" && "bg-green-500/30 text-green-800",
                            booking.status === "acknowledged" && "bg-blue-500/30 text-blue-800",
                            booking.status === "new" && "bg-yellow-500/30 text-yellow-800"
                          )}
                        >
                          {isAdminOrAbove ? getHallName(booking.hall_id).substring(0, 10) : booking.event_type.substring(0, 10)}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* Manager close date button */}
                    {!isPast && !isClosed && isCurrentMonth && (!isAdminOrAbove || selectedHallFilter !== "all") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-full mt-1 text-xs p-0 opacity-0 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateToClose(day);
                          setShowCloseDialog(true);
                        }}
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Close
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Close Date Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Date for Bookings</DialogTitle>
            <DialogDescription>
              {dateToClose && `Close ${format(dateToClose, "PPP")} to prevent new bookings.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="e.g., Maintenance, Private event, Holiday..."
                value={closeDateReason}
                onChange={(e) => setCloseDateReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCloseDate}>
              <Lock className="h-4 w-4 mr-2" />
              Close Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>

          {/* Closed date info */}
          {selectedDate && getClosedDatesForDate(selectedDate).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-destructive flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Closed Dates
              </h4>
              {getClosedDatesForDate(selectedDate).map((closed) => (
                <div
                  key={closed.id}
                  className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg border border-destructive/30"
                >
                  <div>
                    <p className="font-medium">{getHallName(closed.hall_id)}</p>
                    {closed.reason && (
                      <p className="text-sm text-muted-foreground">{closed.reason}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReopenDate(closed.id)}
                  >
                    Reopen
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Bookings list */}
          {selectedBookings.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-medium">Bookings</h4>
              {selectedBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold">{booking.customer_name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {isAdminOrAbove && getHallName(booking.hall_id)}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Event:</span>
                        <span className="ml-2">{booking.event_type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="ml-2">{booking.customer_phone}</span>
                      </div>
                      {booking.expected_guests && (
                        <div>
                          <span className="text-muted-foreground">Guests:</span>
                          <span className="ml-2">{booking.expected_guests}</span>
                        </div>
                      )}
                      {booking.event_start_time && (
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2">
                            {booking.event_start_time}
                            {booking.event_end_time && ` - ${booking.event_end_time}`}
                          </span>
                        </div>
                      )}
                    </div>
                    {booking.special_requests && (
                      <div className="mt-3 p-2 bg-muted rounded text-sm">
                        <p className="text-muted-foreground text-xs mb-1">Special Requests:</p>
                        <p className="whitespace-pre-wrap">{booking.special_requests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            selectedDate && getClosedDatesForDate(selectedDate).length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No bookings for this date.
              </p>
            )
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCalendar;