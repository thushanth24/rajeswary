import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Import static images as fallback
import hallEmeraldGarden from "@/assets/hall-emerald-garden.jpg";
// Raajeshwariy Kondavil images
import raajeshwariyKondavilCover from "@/assets/Raajeshwariy Weeding hall Kondavil cover.webp";
// Raajeshwariy Tellipalai images
import raajeshwariyTellipalaiCover from "@/assets/Raajeshwariy Wedding Hall Tellipalai cover.webp";
// Chelva Palace images
import chelvaPalaceCover from "@/assets/Chelva Palace cover.webp";
// Chelva Mahal images
import chelvaMahalCover from "@/assets/chelva mahal cover .jpeg";

// Static image mapping by slug
const staticImages: Record<string, string> = {
  'grand-ballroom': chelvaMahalCover, // Chelva Mahal
  'royal-banquet': chelvaPalaceCover, // Chelva Palace
  'crystal-palace': raajeshwariyTellipalaiCover,
  'emerald-garden': hallEmeraldGarden, // Keep existing Karpaka cover
  'sunset-terrace': raajeshwariyKondavilCover,
};

// Contact numbers per hall slug
export const hallContactNumbers: Record<string, { primary: string; landline?: string }> = {
  'grand-ballroom': { primary: '+94 77 600 2995', landline: '+94 21 222 8123' }, // Chelva Mahal
  'royal-banquet': { primary: '0212 219 779' }, // Chelva Palace
  'crystal-palace': { primary: '0770228820' }, // Thellipalai Rajeshwary
  'emerald-garden': { primary: '+94 21 555 6789' },
  'sunset-terrace': { primary: '0212 223 999' }, // Urumpirai Rajeswary
};

// Addresses per hall slug
export const hallAddresses: Record<string, { street: string; area: string; city: string }> = {
  'grand-ballroom': { street: '10,12 Poonary Lane', area: 'Kokuvil', city: 'Jaffna' }, // Chelva Mahal
  'royal-banquet': { street: 'No 1229, KKS Road', area: 'Poonary Marathadi', city: 'Jaffna' }, // Chelva Palace
  'crystal-palace': { street: '132, Palali Road', area: 'Kondavil', city: 'Jaffna' },
  'emerald-garden': { street: 'No. 69, Palali Road', area: 'Urumpirai', city: 'Jaffna' },
  'sunset-terrace': { street: 'No 573, K.K.S Road', area: 'Tellipalai', city: 'Jaffna' },
};

export interface Hall {
  id: string; // UUID from database
  slug: string;
  name: string;
  image: string;
  capacity: { min: number; max: number };
  description: string;
  shortDescription: string;
  features: string[];
  facilities: {
    ac: boolean;
    parking: boolean;
    dining: boolean;
    stage: boolean;
    powerBackup: boolean;
    brideRoom: boolean;
    groomRoom: boolean;
    washrooms: number;
  };
  eventTypes: string[];
  priceRange: string;
}

interface DBHall {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  capacity_min: number;
  capacity_max: number;
  description: string | null;
  short_description: string | null;
  features: string[] | null;
  event_types: string[] | null;
  price_range: string | null;
  has_ac: boolean | null;
  has_parking: boolean | null;
  has_dining: boolean | null;
  has_stage: boolean | null;
  has_power_backup: boolean | null;
  has_bride_room: boolean | null;
  has_groom_room: boolean | null;
  washrooms_count: number | null;
  is_active: boolean;
}

function mapDBHallToHall(dbHall: DBHall): Hall {
  return {
    id: dbHall.id, // Use actual UUID from database
    slug: dbHall.slug,
    name: dbHall.name,
    image: dbHall.image_url || staticImages[dbHall.slug] || chelvaMahalCover,
    capacity: {
      min: dbHall.capacity_min,
      max: dbHall.capacity_max,
    },
    description: dbHall.description || '',
    shortDescription: dbHall.short_description || '',
    features: dbHall.features || [],
    facilities: {
      ac: dbHall.has_ac ?? false,
      parking: dbHall.has_parking ?? false,
      dining: dbHall.has_dining ?? false,
      stage: dbHall.has_stage ?? false,
      powerBackup: dbHall.has_power_backup ?? false,
      brideRoom: dbHall.has_bride_room ?? false,
      groomRoom: dbHall.has_groom_room ?? false,
      washrooms: dbHall.washrooms_count ?? 0,
    },
    eventTypes: dbHall.event_types || [],
    priceRange: dbHall.price_range || '',
  };
}

export function useHalls() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const { data, error } = await supabase
          .from('halls')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;

        const mappedHalls = (data as DBHall[]).map(mapDBHallToHall);
        setHalls(mappedHalls);
      } catch (err) {
        console.error('Error fetching halls:', err);
        setError('Failed to load halls');
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  const getHallById = (id: string): Hall | undefined => {
    return halls.find((hall) => hall.id === id || hall.slug === id);
  };

  const getHallBySlug = (slug: string): Hall | undefined => {
    return halls.find((hall) => hall.slug === slug);
  };

  return { halls, loading, error, getHallById, getHallBySlug };
}

// Single hall hook for detail pages
export function useHall(slug: string | undefined) {
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchHall = async () => {
      try {
        const { data, error } = await supabase
          .from('halls')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setHall(mapDBHallToHall(data as DBHall));
        } else {
          setError('Hall not found');
        }
      } catch (err) {
        console.error('Error fetching hall:', err);
        setError('Failed to load hall');
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [slug]);

  return { hall, loading, error };
}
