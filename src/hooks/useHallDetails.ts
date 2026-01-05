import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HallImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface HallReview {
  id: string;
  customer_name: string;
  event_type: string | null;
  event_date: string | null;
  rating: number;
  review_text: string;
}

interface HallEventPhoto {
  id: string;
  image_url: string;
  event_type: string | null;
  event_date: string | null;
  caption: string | null;
}

interface HallDetails {
  floorPlanUrl: string | null;
  images: HallImage[];
  reviews: HallReview[];
  eventPhotos: HallEventPhoto[];
}

export const useHallDetails = (hallId: string | undefined) => {
  const [details, setDetails] = useState<HallDetails>({
    floorPlanUrl: null,
    images: [],
    reviews: [],
    eventPhotos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!hallId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch all data in parallel
        const [hallResult, imagesResult, reviewsResult, photosResult] = await Promise.all([
          supabase
            .from("halls")
            .select("floor_plan_url")
            .eq("id", hallId)
            .maybeSingle(),
          supabase
            .from("hall_images")
            .select("id, image_url, caption")
            .eq("hall_id", hallId)
            .eq("is_active", true)
            .order("display_order", { ascending: true }),
          supabase
            .from("hall_reviews")
            .select("id, customer_name, event_type, event_date, rating, review_text")
            .eq("hall_id", hallId)
            .eq("is_approved", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("hall_event_photos")
            .select("id, image_url, event_type, event_date, caption")
            .eq("hall_id", hallId)
            .eq("is_active", true)
            .order("event_date", { ascending: false }),
        ]);

        setDetails({
          floorPlanUrl: hallResult.data?.floor_plan_url || null,
          images: imagesResult.data || [],
          reviews: reviewsResult.data || [],
          eventPhotos: photosResult.data || [],
        });
      } catch (error) {
        console.error("Error fetching hall details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [hallId]);

  return { details, loading };
};
