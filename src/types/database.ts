
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          total_xp: number
          current_streak: number
          longest_streak: number
          total_entries: number
          completed_challenges: string[]
          unlocked_features: string[]
          earned_badges: string[]
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          total_xp?: number
          current_streak?: number
          longest_streak?: number
          total_entries?: number
          completed_challenges?: string[]
          unlocked_features?: string[]
          earned_badges?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          total_xp?: number
          current_streak?: number
          longest_streak?: number
          total_entries?: number
          completed_challenges?: string[]
          unlocked_features?: string[]
          earned_badges?: string[]
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          created_at: string
          text: string
          font: string
          font_size: string
          font_weight: string
          font_color: string
          gradient: string
          mood: string | null
          mood_note: string | null
          is_public: boolean
          challenge_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          text: string
          font: string
          font_size: string
          font_weight: string
          font_color: string
          gradient: string
          mood?: string | null
          mood_note?: string | null
          is_public?: boolean
          challenge_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          text?: string
          font?: string
          font_size?: string
          font_weight?: string
          font_color?: string
          gradient?: string
          mood?: string | null
          mood_note?: string | null
          is_public?: boolean
          challenge_id?: string | null
        }
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
