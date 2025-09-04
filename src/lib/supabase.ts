import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Some features will not work.')
}

// Create a mock client if env vars are missing (for development)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string
          name: string
          description: string
          owner_id: string
          created_at: string
          updated_at: string
          column_mapping: any
          available_dates: string[]
          parameters: string[]
          units: any
          max_points_per_day?: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          owner_id: string
          created_at?: string
          updated_at?: string
          column_mapping: any
          available_dates: string[]
          parameters: string[]
          units: any
          max_points_per_day?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
          column_mapping?: any
          available_dates?: string[]
          parameters?: string[]
          units?: any
          max_points_per_day?: number
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'uploader' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'uploader' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'uploader' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
