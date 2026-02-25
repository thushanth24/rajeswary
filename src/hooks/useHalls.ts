import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Import static images as fallback
import hallEmeraldGarden from "@/assets/urumpirai.jpeg";
// Raajeshwariy Kondavil images
import raajeshwariyKondavilCover from "@/assets/thellipalaicover.jpeg";
// Raajeshwariy Tellipalai images
import raajeshwariyTellipalaiCover from "@/assets/kondavilcover.jpg";
// Chelva Palace images
import chelvaPalaceCover from "@/assets/palacecover.jpeg";
// Chelva Mahal images
import chelvaMahalCover from "@/assets/chelvamahalcover.jpeg";

// Static image mapping by slug
const staticImages: Record<string, string> = {
  'chelva-mahal': chelvaMahalCover,
  'chelva-palace': chelvaPalaceCover,
  'raajeshwariy-kondavil': raajeshwariyTellipalaiCover,
  'karpaka-raajeshwariy-urumpirai': hallEmeraldGarden,
  'raajeshwariy-tellipalai': raajeshwariyKondavilCover,
};

// Contact numbers per hall slug
export const hallContactNumbers: Record<string, { primary: string; landline?: string }> = {
  'chelva-mahal': { primary: '+94 77 600 2995', landline: '+94 21 222 8123' },
  'chelva-palace': { primary: '0212 219 779' },
  'raajeshwariy-kondavil': { primary: '0770228820' },
  'karpaka-raajeshwariy-urumpirai': { primary: '+94 21 555 6789' },
  'raajeshwariy-tellipalai': { primary: '0212 223 999' },
};

// Addresses per hall slug
export const hallAddresses: Record<string, { street: string; area: string; city: string }> = {
  'chelva-mahal': { street: '10,12 Poonary Lane', area: 'Kokuvil', city: 'Jaffna' },
  'chelva-palace': { street: 'No 1229, KKS Road', area: 'Poonary Marathadi', city: 'Jaffna' },
  'raajeshwariy-kondavil': { street: '132, Palali Road', area: 'Kondavil', city: 'Jaffna' },
  'karpaka-raajeshwariy-urumpirai': { street: 'No. 69, Palali Road', area: 'Urumpirai', city: 'Jaffna' },
  'raajeshwariy-tellipalai': { street: 'No 573, K.K.S Road', area: 'Tellipalai', city: 'Jaffna' },
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

// Custom display order for halls (by slug)
const hallDisplayOrder: string[] = [
  'raajeshwariy-kondavil',
  'raajeshwariy-tellipalai',
  'chelva-mahal',
  'chelva-palace',
  'karpaka-raajeshwariy-urumpirai',
];

function sortHallsByDisplayOrder(halls: Hall[]): Hall[] {
  return [...halls].sort((a, b) => {
    const indexA = hallDisplayOrder.indexOf(a.slug);
    const indexB = hallDisplayOrder.indexOf(b.slug);
    // If not in order list, put at end
    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;
    return orderA - orderB;
  });
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
          .eq('is_active', true);

        if (error) throw error;

        const mappedHalls = (data as DBHall[]).map(mapDBHallToHall);
        const sortedHalls = sortHallsByDisplayOrder(mappedHalls);
        setHalls(sortedHalls);
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
