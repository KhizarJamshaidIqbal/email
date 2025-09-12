import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { isRetryableError } from '../utils/network'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isOnline: boolean
  networkError: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  retryConnection: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [networkError, setNetworkError] = useState<string | null>(null)

  useEffect(() => {
    // Network status listener
    const handleOnline = () => {
      setIsOnline(true)
      setNetworkError(null)
      // Retry getting session when back online
      retryGetSession()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setNetworkError('No internet connection')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          if (isRetryableError(error)) {
            setNetworkError('Connection issues detected. Retrying...')
            // Will retry automatically due to resilient client
          } else {
            console.error('Auth initialization error:', error)
            setNetworkError('Authentication service unavailable')
          }
        } else {
          setNetworkError(null)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        if (isRetryableError(error)) {
          setNetworkError('Connection issues detected')
        } else {
          setNetworkError('Authentication service unavailable')
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session) => {
      try {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setNetworkError(null)

        // Create user profile if signing up
        if (event === 'SIGNED_UP' && session?.user) {
          await createUserProfile(session.user)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        if (isRetryableError(error)) {
          setNetworkError('Connection issues detected')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const retryGetSession = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        if (isRetryableError(error)) {
          setNetworkError('Connection issues detected')
        } else {
          setNetworkError('Authentication service unavailable')
        }
      } else {
        setNetworkError(null)
        setSession(session)
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('Failed to retry session:', error)
      setNetworkError('Failed to reconnect')
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (user: User) => {
    try {
      const result = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          subscription_plan: 'free',
          ai_usage_count: 0
        })
        .select()
      
      if (result.error) {
        console.error('Error creating user profile:', result.error)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setNetworkError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error && isRetryableError(error)) {
        setNetworkError('Connection issues during sign in')
      }
      
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      if (isRetryableError(error)) {
        setNetworkError('Network error during sign in')
      }
      return { error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setNetworkError(null)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      
      if (error && isRetryableError(error)) {
        setNetworkError('Connection issues during sign up')
      }
      
      return { error }
    } catch (error) {
      console.error('Sign up error:', error)
      if (isRetryableError(error)) {
        setNetworkError('Network error during sign up')
      }
      return { error }
    }
  }

  const signOut = async () => {
    try {
      setNetworkError(null)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      if (isRetryableError(error)) {
        setNetworkError('Network error during sign out')
      }
      // Don't throw error for sign out - clear local state anyway
      setSession(null)
      setUser(null)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setNetworkError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error && isRetryableError(error)) {
        setNetworkError('Connection issues during password reset')
      }
      
      return { error }
    } catch (error) {
      console.error('Password reset error:', error)
      if (isRetryableError(error)) {
        setNetworkError('Network error during password reset')
      }
      return { error }
    }
  }

  const retryConnection = async () => {
    await retryGetSession()
  }

  const value = {
    user,
    session,
    loading,
    isOnline,
    networkError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    retryConnection,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}