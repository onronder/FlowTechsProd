'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { UserProfile, UserWithProfile } from '@/lib/types/user'
import { syncUserProfile } from '@/lib/supabase/helpers'

interface UserContextProps {
  user: UserWithProfile | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Fetch user profile data from the profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Create profile if it doesn't exist
  const createProfileIfNeeded = async (userData: User) => {
    try {
      // Check if profile exists
      const existingProfile = await fetchProfile(userData.id)

      if (!existingProfile) {
        console.log('No profile found, creating one directly')

        // Create a new profile
        const profileData = {
          id: userData.id,
          email: userData.email || '',
          full_name: userData.user_metadata?.full_name ||
            userData.user_metadata?.name ||
            (userData.user_metadata?.given_name && userData.user_metadata?.family_name ?
              `${userData.user_metadata.given_name} ${userData.user_metadata.family_name}` : ''),
          avatar_url: userData.user_metadata?.avatar_url ||
            userData.user_metadata?.picture ||
            '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          console.log('Profile created successfully')
          return profileData as UserProfile
        }
      } else if (!existingProfile.full_name || !existingProfile.avatar_url) {
        // Profile exists but might be missing data
        console.log('Profile exists but may be missing data, syncing')
        await syncUserProfile(supabase, userData)
        return await fetchProfile(userData.id)
      }

      return existingProfile
    } catch (error) {
      console.error('Error in createProfileIfNeeded:', error)
      return null
    }
  }

  // Initialize user session
  const refreshUser = async () => {
    try {
      setIsLoading(true)

      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setSession(session)

        // Get user with updated values
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Get the user profile or create if needed
          const profile = await createProfileIfNeeded(user)
          setProfile(profile)

          // Combine user and profile
          const userWithProfile = {
            ...user,
            profile
          } as UserWithProfile

          setUser(userWithProfile)
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out the user
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event)
        setSession(session)

        if (session?.user) {
          // Get or create the profile when auth state changes
          const profile = await createProfileIfNeeded(session.user)
          setProfile(profile)

          const userWithProfile = {
            ...session.user,
            profile
          } as UserWithProfile

          setUser(userWithProfile)
        } else {
          setUser(null)
          setProfile(null)
        }

        setIsLoading(false)
      }
    )

    // Initial session fetch
    refreshUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    session,
    isLoading,
    signOut,
    refreshUser
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}