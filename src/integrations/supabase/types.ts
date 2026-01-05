export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      booking_inventory: {
        Row: {
          booking_id: string
          checked_out_at: string | null
          checked_out_by: string | null
          created_at: string
          id: string
          inventory_id: string
          notes: string | null
          quantity_allocated: number
          quantity_returned: number | null
          returned_at: string | null
          returned_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          checked_out_at?: string | null
          checked_out_by?: string | null
          created_at?: string
          id?: string
          inventory_id: string
          notes?: string | null
          quantity_allocated?: number
          quantity_returned?: number | null
          returned_at?: string | null
          returned_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          checked_out_at?: string | null
          checked_out_by?: string | null
          created_at?: string
          id?: string
          inventory_id?: string
          notes?: string | null
          quantity_allocated?: number
          quantity_returned?: number | null
          returned_at?: string | null
          returned_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_inventory_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_inventory_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          event_date: string
          event_end_time: string | null
          event_start_time: string | null
          event_type: string
          expected_guests: number | null
          hall_id: string
          id: string
          internal_notes: string | null
          is_manual_booking: boolean
          reference_number: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          event_date: string
          event_end_time?: string | null
          event_start_time?: string | null
          event_type: string
          expected_guests?: number | null
          hall_id: string
          id?: string
          internal_notes?: string | null
          is_manual_booking?: boolean
          reference_number?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          event_date?: string
          event_end_time?: string | null
          event_start_time?: string | null
          event_type?: string
          expected_guests?: number | null
          hall_id?: string
          id?: string
          internal_notes?: string | null
          is_manual_booking?: boolean
          reference_number?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      hall_closed_dates: {
        Row: {
          closed_date: string
          created_at: string
          created_by: string | null
          hall_id: string
          id: string
          reason: string | null
        }
        Insert: {
          closed_date: string
          created_at?: string
          created_by?: string | null
          hall_id: string
          id?: string
          reason?: string | null
        }
        Update: {
          closed_date?: string
          created_at?: string
          created_by?: string | null
          hall_id?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_closed_dates_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_event_photos: {
        Row: {
          caption: string | null
          created_at: string
          event_date: string | null
          event_type: string | null
          hall_id: string
          id: string
          image_url: string
          is_active: boolean | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          hall_id: string
          id?: string
          image_url: string
          is_active?: boolean | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          hall_id?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_event_photos_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number | null
          hall_id: string
          id: string
          image_url: string
          is_active: boolean | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          hall_id: string
          id?: string
          image_url: string
          is_active?: boolean | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          hall_id?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_images_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_managers: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          hall_id: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          hall_id: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          hall_id?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hall_managers_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: true
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_reviews: {
        Row: {
          created_at: string
          customer_name: string
          event_date: string | null
          event_type: string | null
          hall_id: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          rating: number
          review_text: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          event_date?: string | null
          event_type?: string | null
          hall_id: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating: number
          review_text: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          event_date?: string | null
          event_type?: string | null
          hall_id?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating?: number
          review_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "hall_reviews_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      halls: {
        Row: {
          capacity_max: number
          capacity_min: number
          created_at: string
          description: string | null
          event_types: string[] | null
          features: string[] | null
          floor_plan_url: string | null
          has_ac: boolean | null
          has_bride_room: boolean | null
          has_dining: boolean | null
          has_groom_room: boolean | null
          has_parking: boolean | null
          has_power_backup: boolean | null
          has_stage: boolean | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price_range: string | null
          short_description: string | null
          slug: string
          updated_at: string
          washrooms_count: number | null
        }
        Insert: {
          capacity_max?: number
          capacity_min?: number
          created_at?: string
          description?: string | null
          event_types?: string[] | null
          features?: string[] | null
          floor_plan_url?: string | null
          has_ac?: boolean | null
          has_bride_room?: boolean | null
          has_dining?: boolean | null
          has_groom_room?: boolean | null
          has_parking?: boolean | null
          has_power_backup?: boolean | null
          has_stage?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price_range?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string
          washrooms_count?: number | null
        }
        Update: {
          capacity_max?: number
          capacity_min?: number
          created_at?: string
          description?: string | null
          event_types?: string[] | null
          features?: string[] | null
          floor_plan_url?: string | null
          has_ac?: boolean | null
          has_bride_room?: boolean | null
          has_dining?: boolean | null
          has_groom_room?: boolean | null
          has_parking?: boolean | null
          has_power_backup?: boolean | null
          has_stage?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price_range?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string
          washrooms_count?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          hall_id: string
          id: string
          item_name: string
          last_checked_at: string | null
          last_checked_by: string | null
          quantity: number
          status: Database["public"]["Enums"]["inventory_status"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          hall_id: string
          id?: string
          item_name: string
          last_checked_at?: string | null
          last_checked_by?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          hall_id?: string
          id?: string
          item_name?: string
          last_checked_at?: string | null
          last_checked_by?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "halls"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_reference: { Args: never; Returns: string }
      get_manager_hall_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_above: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "hall_manager"
      booking_status:
        | "new"
        | "acknowledged"
        | "confirmed"
        | "cancelled"
        | "completed"
      inventory_status: "available" | "in_use" | "under_repair" | "disposed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "hall_manager"],
      booking_status: [
        "new",
        "acknowledged",
        "confirmed",
        "cancelled",
        "completed",
      ],
      inventory_status: ["available", "in_use", "under_repair", "disposed"],
    },
  },
} as const
