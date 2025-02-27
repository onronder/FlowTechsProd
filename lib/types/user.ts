import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  display_name?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

export interface UserWithProfile extends User {
  profile?: UserProfile
}