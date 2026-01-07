import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HallSection {
  id: string;
  hall_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

interface SectionBooking {
  date: string;
  section_id: string | null;
}

export function useHallSections(hallId: string | null) {
  const [sections, setSections] = useState<HallSection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      if (!hallId) {
        setSections([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("hall_sections")
        .select("*")
        .eq("hall_id", hallId)
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setSections(data);
      }
      setLoading(false);
    };

    fetchSections();
  }, [hallId]);

  const hasMultipleSections = sections.length > 1;

  return { sections, loading, hasMultipleSections };
}

// Hook to check section availability for a specific date
export function useSectionAvailability(hallId: string | null, date: string | null) {
  const [bookedSections, setBookedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { sections, hasMultipleSections } = useHallSections(hallId);

  useEffect(() => {
    const fetchBookedSections = async () => {
      if (!hallId || !date || !hasMultipleSections) {
        setBookedSections([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("section_id")
        .eq("hall_id", hallId)
        .eq("event_date", date)
        .eq("status", "confirmed")
        .not("section_id", "is", null);

      if (!error && data) {
        setBookedSections(data.map((b) => b.section_id!));
      }
      setLoading(false);
    };

    fetchBookedSections();
  }, [hallId, date, hasMultipleSections]);

  const availableSections = useMemo(() => {
    return sections.filter((s) => !bookedSections.includes(s.id));
  }, [sections, bookedSections]);

  const allSectionsBooked = hasMultipleSections && availableSections.length === 0;

  return {
    sections,
    bookedSections,
    availableSections,
    allSectionsBooked,
    hasMultipleSections,
    loading,
  };
}

// Hook to check if a date is fully booked (all sections occupied) for availability indicator
export function useMultiSectionAvailability(hallId: string | null) {
  const [sectionCount, setSectionCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSectionCount = async () => {
      if (!hallId) {
        setSectionCount(0);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("hall_sections")
        .select("id")
        .eq("hall_id", hallId)
        .eq("is_active", true);

      if (!error && data) {
        setSectionCount(data.length);
      }
      setLoading(false);
    };

    fetchSectionCount();
  }, [hallId]);

  return { sectionCount, hasMultipleSections: sectionCount > 1, loading };
}
