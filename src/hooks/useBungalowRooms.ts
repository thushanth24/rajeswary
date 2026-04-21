import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { bungalows as staticBungalows, Bungalow } from '@/data/bungalows';
import bungalowDouble1 from "@/assets/bungalow-double-1.jpeg";
import bungalowDouble2 from "@/assets/bungalow-double-2.jpeg";
import bungalowDouble3 from "@/assets/bungalow-double-3.jpeg";
import bungalowDouble4 from "@/assets/bungalow-double-4.jpeg";

export interface BungalowRoom {
  id: string;
  name: string;
  location: string;
  room_type: string;
  ac_type: string;
  max_adults: number;
  max_children: number;
  tariff_room_only: number;
  tariff_bb: number;
  tariff_full_board: number;
  amenities: string[];
  description: string;
  rules: string[];
  check_in_time: string;
  check_out_time: string;
  images: string[];
  available: boolean;
  display_order: number;
}

const localBungalowImages = [
  bungalowDouble1,
  bungalowDouble2,
  bungalowDouble3,
  bungalowDouble4,
];

function getDisplayImages(images?: string[] | null): string[] {
  const validImages = images?.filter(Boolean) ?? [];
  const hasExternalPlaceholder = validImages.some((image) =>
    image.includes('images.unsplash.com') || image.includes('source.unsplash.com')
  );

  return validImages.length > 0 && !hasExternalPlaceholder
    ? validImages
    : localBungalowImages;
}

// Convert DB room to Bungalow interface for backward compatibility
export function dbRoomToBungalow(room: BungalowRoom): Bungalow {
  return {
    id: room.id,
    name: room.name,
    location: room.location,
    type: room.room_type as Bungalow['type'],
    acType: room.ac_type as Bungalow['acType'],
    maxOccupancy: { adults: room.max_adults, children: room.max_children },
    tariff: { roomOnly: room.tariff_room_only, bbWithRoom: room.tariff_bb, fullBoard: room.tariff_full_board },
    images: getDisplayImages(room.images),
    amenities: room.amenities,
    description: room.description,
    rules: room.rules,
    checkInTime: room.check_in_time,
    checkOutTime: room.check_out_time,
    available: room.available,
  };
}

export function useBungalowRooms() {
  const [rooms, setRooms] = useState<BungalowRoom[]>([]);
  const [bungalowsList, setBungalowsList] = useState<Bungalow[]>(staticBungalows);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('bungalow_rooms')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const dbRooms = (data || []) as BungalowRoom[];
      setRooms(dbRooms);
      
      if (dbRooms.length > 0) {
        setBungalowsList(dbRooms.map(dbRoomToBungalow));
      } else {
        setBungalowsList(staticBungalows);
      }
    } catch (err) {
      console.error('Failed to fetch bungalow rooms, using static data:', err);
      setBungalowsList(staticBungalows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, bungalowsList, loading, refetch: fetchRooms };
}
