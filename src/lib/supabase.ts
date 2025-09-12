import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://slluhggkqjmvftnkcnoz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbHVoZ2drcWptdmZ0bmtjbm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTcyMzksImV4cCI6MjA3MzE3MzIzOX0.4gE0ZuujCOE8r3ouXBBJWhcwfoPXaz9DX8WIFdeElWw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  subscription_plan: 'free' | 'premium' | 'team'
  ai_usage_count: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  template_id?: string
  name: string
  content_data?: any
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  name: string
  category: string
  structure: any
  preview_image?: string
  is_premium: boolean
  created_at: string
}

export interface BrandKit {
  id: string
  user_id: string
  name: string
  color_palette?: any
  fonts?: any
  created_at: string
  updated_at: string
}

export interface BrandAsset {
  id: string
  brand_kit_id: string
  asset_type: string
  file_url: string
  file_name: string
  file_size?: number
  created_at: string
}

export interface TemplateCategory {
  id: string
  name: string
  description?: string
  sort_order: number
  created_at: string
}