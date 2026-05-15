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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_user: boolean
          language: string | null
          message: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user: boolean
          language?: string | null
          message: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user?: boolean
          language?: string | null
          message?: string
          session_id?: string
        }
        Relationships: []
      }
      custom_sections: {
        Row: {
          created_at: string
          eyebrow_ar: string | null
          eyebrow_en: string | null
          eyebrow_zh: string | null
          id: string
          slug: string
          sort_order: number
          template: string
          title_ar: string | null
          title_en: string
          title_zh: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          eyebrow_ar?: string | null
          eyebrow_en?: string | null
          eyebrow_zh?: string | null
          id?: string
          slug: string
          sort_order?: number
          template?: string
          title_ar?: string | null
          title_en: string
          title_zh?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          eyebrow_ar?: string | null
          eyebrow_en?: string | null
          eyebrow_zh?: string | null
          id?: string
          slug?: string
          sort_order?: number
          template?: string
          title_ar?: string | null
          title_en?: string
          title_zh?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      experiences: {
        Row: {
          created_at: string
          id: string
          kind: string
          org: string
          period: string
          sort_order: number
          title_ar: string | null
          title_en: string
          title_zh: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          org: string
          period: string
          sort_order?: number
          title_ar?: string | null
          title_en: string
          title_zh?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          org?: string
          period?: string
          sort_order?: number
          title_ar?: string | null
          title_en?: string
          title_zh?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          interest: string | null
          name: string | null
          phone: string | null
          source: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          interest?: string | null
          name?: string | null
          phone?: string | null
          source?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          interest?: string | null
          name?: string | null
          phone?: string | null
          source?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          demo_url: string | null
          description_ar: string | null
          description_en: string
          description_zh: string | null
          featured: boolean
          github_url: string | null
          id: string
          image_url: string | null
          sort_order: number
          tags: string[]
          title_ar: string | null
          title_en: string
          title_zh: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          demo_url?: string | null
          description_ar?: string | null
          description_en: string
          description_zh?: string | null
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          tags?: string[]
          title_ar?: string | null
          title_en: string
          title_zh?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          demo_url?: string | null
          description_ar?: string | null
          description_en?: string
          description_zh?: string | null
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          tags?: string[]
          title_ar?: string | null
          title_en?: string
          title_zh?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      section_items: {
        Row: {
          created_at: string
          date_label: string | null
          description_ar: string | null
          description_en: string | null
          description_zh: string | null
          id: string
          image_url: string | null
          link_label: string | null
          link_url: string | null
          meta: Json
          section_id: string
          sort_order: number
          tags: string[]
          title_ar: string | null
          title_en: string
          title_zh: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_label?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          image_url?: string | null
          link_label?: string | null
          link_url?: string | null
          meta?: Json
          section_id: string
          sort_order?: number
          tags?: string[]
          title_ar?: string | null
          title_en: string
          title_zh?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_label?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          image_url?: string | null
          link_label?: string | null
          link_url?: string | null
          meta?: Json
          section_id?: string
          sort_order?: number
          tags?: string[]
          title_ar?: string | null
          title_en?: string
          title_zh?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "section_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "custom_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          id: string
          level: number
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          level?: number
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          level?: number
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
