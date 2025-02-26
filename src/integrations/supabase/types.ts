export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Calendly: {
        Row: {
          attrs: Json | null
          created_at: string | null
          slug: string | null
          updated_at: string | null
          uri: string | null
        }
        Insert: {
          attrs?: Json | null
          created_at?: string | null
          slug?: string | null
          updated_at?: string | null
          uri?: string | null
        }
        Update: {
          attrs?: Json | null
          created_at?: string | null
          slug?: string | null
          updated_at?: string | null
          uri?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          challenge_id: string | null
          created_at: string
          font: string
          font_color: string
          font_size: string
          font_weight: string
          gradient: string
          id: string
          is_public: boolean
          mood: string | null
          mood_note: string | null
          text: string
          text_style: string | null
          user_id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          font: string
          font_color: string
          font_size: string
          font_weight: string
          gradient: string
          id?: string
          is_public?: boolean
          mood?: string | null
          mood_note?: string | null
          text: string
          text_style?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          font?: string
          font_color?: string
          font_size?: string
          font_weight?: string
          gradient?: string
          id?: string
          is_public?: boolean
          mood?: string | null
          mood_note?: string | null
          text?: string
          text_style?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          completed_challenges: string[]
          created_at: string
          current_streak: number
          earned_badges: string[]
          id: string
          longest_streak: number
          total_entries: number
          total_xp: number
          unlocked_features: string[]
          updated_at: string
        }
        Insert: {
          completed_challenges?: string[]
          created_at?: string
          current_streak?: number
          earned_badges?: string[]
          id: string
          longest_streak?: number
          total_entries?: number
          total_xp?: number
          unlocked_features?: string[]
          updated_at?: string
        }
        Update: {
          completed_challenges?: string[]
          created_at?: string
          current_streak?: number
          earned_badges?: string[]
          id?: string
          longest_streak?: number
          total_entries?: number
          total_xp?: number
          unlocked_features?: string[]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
