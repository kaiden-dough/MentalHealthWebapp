/**
 * Snapshot of Supabase table types (regenerate via MCP `generate_typescript_types` or Supabase CLI).
 * Wire into `createBrowserClient<Database>()` when you want strict query typing.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      mood_entries: {
        Row: {
          created_at: string;
          id: string;
          mood: string;
          note: string | null;
          stress: number;
          stressors: string[];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          mood: string;
          note?: string | null;
          stress: number;
          stressors?: string[];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          mood?: string;
          note?: string | null;
          stress?: number;
          stressors?: string[];
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          display_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          display_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          display_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
