import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Import static images for Raajeshwariy Kondavil
import raajeshwariyKondavil01 from "@/assets/Raajeshwariy Weeding hall Kondavil 01.webp";
import raajeshwariyKondavil02 from "@/assets/Raajeshwariy Weeding hall Kondavil 02.webp";
import raajeshwariyKondavil03 from "@/assets/Raajeshwariy Weeding hall Kondavil 03.webp";
import raajeshwariyKondavil04 from "@/assets/Raajeshwariy Weeding hall Kondavil 04.webp";
import raajeshwariyKondavil05 from "@/assets/Raajeshwariy Weeding hall Kondavil 05.webp";
import raajeshwariyKondavil06 from "@/assets/Raajeshwariy Weeding hall Kondavil 06.webp";
import raajeshwariyKondavil07 from "@/assets/Raajeshwariy Weeding hall Kondavil 07.webp";
import raajeshwariyKondavil08 from "@/assets/Raajeshwariy Weeding hall Kondavil 08.webp";
import raajeshwariyKondavil09 from "@/assets/Raajeshwariy Weeding hall Kondavil 09.webp";

// Import static images for Raajeshwariy Tellipalai
import raajeshwariyTellipalai01 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 01.webp";
import raajeshwariyTellipalai02 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 02.webp";
import raajeshwariyTellipalai03 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 03.webp";
import raajeshwariyTellipalai04 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 04.webp";
import raajeshwariyTellipalai05 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 05.webp";
import raajeshwariyTellipalai06 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 06.webp";
import raajeshwariyTellipalai07 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 07.webp";
import raajeshwariyTellipalai08 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 08.webp";
import raajeshwariyTellipalai09 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 09.webp";

// Import static images for Karpaka Raajeshwariy
import karpakaRaajeshwariy01 from "@/assets/Karpaka Raajeshwariy Wedding Hall 01.webp";
import karpakaRaajeshwariy02 from "@/assets/Karpaka Raajeshwariy Wedding Hall 02.webp";
import karpakaRaajeshwariy03 from "@/assets/Karpaka Raajeshwariy Wedding Hall 03.webp";
import karpakaRaajeshwariy04 from "@/assets/Karpaka Raajeshwariy Wedding Hall 04.webp";
import karpakaRaajeshwariy05 from "@/assets/Karpaka Raajeshwariy Wedding Hall 05.webp";
import karpakaRaajeshwariy06 from "@/assets/Karpaka Raajeshwariy Wedding Hall 06.webp";
import karpakaRaajeshwariy07 from "@/assets/Karpaka Raajeshwariy Wedding Hall 07.webp";
import karpakaRaajeshwariy08 from "@/assets/Karpaka Raajeshwariy Wedding Hall 08.webp";
import karpakaRaajeshwariy09 from "@/assets/Karpaka Raajeshwariy Wedding Hall 09.webp";
import karpakaRaajeshwariy10 from "@/assets/Karpaka Raajeshwariy Wedding Hall 10.webp";

// Import static images for Chelva Palace
import chelvaPalace01 from "@/assets/Chelva Palace 01.webp";
import chelvaPalace02 from "@/assets/Chelva Palace 02.webp";
import chelvaPalace03 from "@/assets/Chelva Palace 03.webp";
import chelvaPalace04 from "@/assets/Chelva Palace 04.webp";
import chelvaPalace05 from "@/assets/Chelva Palace 05.webp";
import chelvaPalace06 from "@/assets/Chelva Palace 06.webp";
import chelvaPalace07 from "@/assets/Chelva Palace 07.webp";
import chelvaPalace08 from "@/assets/Chelva Palace 08.webp";
import chelvaPalace09 from "@/assets/Chelva Palace 09.webp";

// Import static images for Chelva Mahal
import chelvaMahal01 from "@/assets/chelva mahal 01.webp";
import chelvaMahal02 from "@/assets/chelva mahal 02.webp";
import chelvaMahal03 from "@/assets/chelva mahal 03.webp";
import chelvaMahal04 from "@/assets/chelva mahal 04.webp";
import chelvaMahal05 from "@/assets/chelva mahal 05.webp";
import chelvaMahal06 from "@/assets/chelva mahal 06.webp";
import chelvaMahal07 from "@/assets/chelva mahal 07.webp";
import chelvaMahal08 from "@/assets/chelva mahal 08.webp";
import chelvaMahal09 from "@/assets/chelva mahal 09.webp";

// Static gallery images by hall ID
const staticGalleryImages: Record<string, { image_url: string; caption: string }[]> = {
  '0114eb14-287f-4f18-95d1-15e7e429f3a4': [ // Raajeshwariy Weeding hall Kondavil
    { image_url: raajeshwariyTellipalai01, caption: 'Hall Interior View 1' },
    { image_url: raajeshwariyTellipalai02, caption: 'Hall Interior View 2' },
    { image_url: raajeshwariyTellipalai03, caption: 'Hall Interior View 3' },
    { image_url: raajeshwariyTellipalai04, caption: 'Hall Interior View 4' },
    { image_url: raajeshwariyTellipalai05, caption: 'Hall Interior View 5' },
    { image_url: raajeshwariyTellipalai06, caption: 'Hall Interior View 6' },
    { image_url: raajeshwariyTellipalai07, caption: 'Hall Interior View 7' },
    { image_url: raajeshwariyTellipalai08, caption: 'Hall Interior View 8' },
    { image_url: raajeshwariyTellipalai09, caption: 'Hall Interior View 9' },
  ],
  'f3001a24-a3f0-46e5-a6b4-7547d80d02e9': [ // Raajeshwariy Wedding Hall Tellipalai
    { image_url: raajeshwariyKondavil01, caption: 'Hall Interior View 1' },
    { image_url: raajeshwariyKondavil02, caption: 'Hall Interior View 2' },
    { image_url: raajeshwariyKondavil03, caption: 'Hall Interior View 3' },
    { image_url: raajeshwariyKondavil04, caption: 'Hall Interior View 4' },
    { image_url: raajeshwariyKondavil05, caption: 'Hall Interior View 5' },
    { image_url: raajeshwariyKondavil06, caption: 'Hall Interior View 6' },
    { image_url: raajeshwariyKondavil07, caption: 'Hall Interior View 7' },
    { image_url: raajeshwariyKondavil08, caption: 'Hall Interior View 8' },
    { image_url: raajeshwariyKondavil09, caption: 'Hall Interior View 9' },
  ],
  'b3938423-dfa7-468c-ada1-a8e3791131e0': [ // Karpaka Raajeshwariy Wedding Hall
    { image_url: karpakaRaajeshwariy01, caption: 'Hall Interior View 1' },
    { image_url: karpakaRaajeshwariy02, caption: 'Hall Interior View 2' },
    { image_url: karpakaRaajeshwariy03, caption: 'Hall Interior View 3' },
    { image_url: karpakaRaajeshwariy04, caption: 'Hall Interior View 4' },
    { image_url: karpakaRaajeshwariy05, caption: 'Hall Interior View 5' },
    { image_url: karpakaRaajeshwariy06, caption: 'Hall Interior View 6' },
    { image_url: karpakaRaajeshwariy07, caption: 'Hall Interior View 7' },
    { image_url: karpakaRaajeshwariy08, caption: 'Hall Interior View 8' },
    { image_url: karpakaRaajeshwariy09, caption: 'Hall Interior View 9' },
    { image_url: karpakaRaajeshwariy10, caption: 'Hall Interior View 10' },
  ],
  '86d57f02-089c-4817-bf33-d403c9093541': [ // Chelva Palace
    { image_url: chelvaPalace01, caption: 'Hall Interior View 1' },
    { image_url: chelvaPalace02, caption: 'Hall Interior View 2' },
    { image_url: chelvaPalace03, caption: 'Hall Interior View 3' },
    { image_url: chelvaPalace04, caption: 'Hall Interior View 4' },
    { image_url: chelvaPalace05, caption: 'Hall Interior View 5' },
    { image_url: chelvaPalace06, caption: 'Hall Interior View 6' },
    { image_url: chelvaPalace07, caption: 'Hall Interior View 7' },
    { image_url: chelvaPalace08, caption: 'Hall Interior View 8' },
    { image_url: chelvaPalace09, caption: 'Hall Interior View 9' },
  ],
  '23bac0a2-9065-4e0a-8de8-8ef73fe4949f': [ // Chelva Mahal
    { image_url: chelvaMahal01, caption: 'Hall Interior View 1' },
    { image_url: chelvaMahal02, caption: 'Hall Interior View 2' },
    { image_url: chelvaMahal03, caption: 'Hall Interior View 3' },
    { image_url: chelvaMahal04, caption: 'Hall Interior View 4' },
    { image_url: chelvaMahal05, caption: 'Hall Interior View 5' },
    { image_url: chelvaMahal06, caption: 'Hall Interior View 6' },
    { image_url: chelvaMahal07, caption: 'Hall Interior View 7' },
    { image_url: chelvaMahal08, caption: 'Hall Interior View 8' },
    { image_url: chelvaMahal09, caption: 'Hall Interior View 9' },
  ],
};

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

        // Use static images if no database images exist
        const dbImages = imagesResult.data || [];
        const staticImages = staticGalleryImages[hallId] || [];
        const fallbackImages: HallImage[] = dbImages.length > 0 
          ? dbImages 
          : staticImages.map((img, index) => ({
              id: `static-${index}`,
              image_url: img.image_url,
              caption: img.caption,
            }));

        setDetails({
          floorPlanUrl: hallResult.data?.floor_plan_url || null,
          images: fallbackImages,
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
