import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Import static images as fallback
import hallGrandBallroom from "@/assets/hall-grand-ballroom.webp";
import hallRoyalBanquet from "@/assets/hall-royal-banquet.webp";
import hallCrystalPalace from "@/assets/hall-crystal-palace.webp";
import hallEmeraldGarden from "@/assets/hall-emerald-garden.jpg";
import hallSunsetTerrace from "@/assets/hall-sunset-terrace.jpg";

// Static image mapping by slug
const staticImages: Record<string, string> = {
  'grand-ballroom': hallGrandBallroom,
  'royal-banquet': hallRoyalBanquet,
  'crystal-palace': hallCrystalPalace,
  'emerald-garden': hallEmeraldGarden,
  'sunset-terrace': hallSunsetTerrace,
};

export interface Hall {
  id: string;
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
    id: dbHall.slug, // Use slug as ID for URL compatibility
    slug: dbHall.slug,
    name: dbHall.name,
    image: dbHall.image_url || staticImages[dbHall.slug] || hallGrandBallroom,
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
