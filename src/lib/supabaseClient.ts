import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { withNetworkResilience, getNetworkStatus, createNetworkStatusListener } from '../utils/network'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://slluhggkqjmvftnkcnoz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbHVoZ2drcWptdmZ0bmtjbm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTcyMzksImV4cCI6MjA3MzE3MzIzOX0.4gE0ZuujCOE8r3ouXBBJWhcwfoPXaz9DX8WIFdeElWw'

// Create the base Supabase client
const baseSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'newsletter-creator'
    }
  }
})

// Enhanced Supabase client with network resilience
class ResilientSupabaseClient {
  private client: SupabaseClient
  private networkStatus = { isOnline: true, isSupabaseReachable: true, lastChecked: new Date() }
  private networkListenerCleanup?: () => void

  constructor(client: SupabaseClient) {
    this.client = client
    this.setupNetworkListener()
    // Disabled automatic network check to prevent ERR_ABORTED errors
    // this.checkInitialNetworkStatusAsync()
  }

  private setupNetworkListener() {
    this.networkListenerCleanup = createNetworkStatusListener((isOnline) => {
      this.networkStatus.isOnline = isOnline
      if (isOnline) {
        // Disabled automatic Supabase connectivity check to prevent ERR_ABORTED errors
        // this.checkSupabaseConnectivity()
        this.networkStatus.isSupabaseReachable = true // Assume reachable when online
      } else {
        this.networkStatus.isSupabaseReachable = false
      }
    })
  }

  private checkInitialNetworkStatusAsync() {
    // Perform network check asynchronously without blocking constructor
    setTimeout(async () => {
      try {
        this.networkStatus = await getNetworkStatus(supabaseUrl)
      } catch (error) {
        console.warn('Failed to check initial network status:', error)
        // Set default offline status if check fails
        this.networkStatus = {
          isOnline: navigator.onLine,
          isSupabaseReachable: false,
          lastChecked: new Date()
        }
      }
    }, 100) // Small delay to ensure constructor completes first
  }

  private async checkSupabaseConnectivity() {
    try {
      const status = await getNetworkStatus(supabaseUrl)
      this.networkStatus = status
    } catch (error) {
      console.warn('Failed to check Supabase connectivity:', error)
      this.networkStatus.isSupabaseReachable = false
    }
  }

  // Get current network status
  getNetworkStatus() {
    return { ...this.networkStatus }
  }

  // Enhanced auth methods with retry logic
  get auth() {
    return {
      getSession: () => withNetworkResilience(
        () => this.client.auth.getSession(),
        { maxRetries: 2, baseDelay: 1000 }
      ),
      
      signInWithPassword: (credentials: { email: string; password: string }) => 
        withNetworkResilience(
          () => this.client.auth.signInWithPassword(credentials),
          { maxRetries: 3, baseDelay: 1000 }
        ),
      
      signUp: (credentials: { email: string; password: string; options?: any }) => 
        withNetworkResilience(
          () => this.client.auth.signUp(credentials),
          { maxRetries: 3, baseDelay: 1000 }
        ),
      
      signOut: () => withNetworkResilience(
        () => this.client.auth.signOut(),
        { maxRetries: 2, baseDelay: 500 }
      ),
      
      resetPasswordForEmail: (email: string, options?: any) => 
        withNetworkResilience(
          () => this.client.auth.resetPasswordForEmail(email, options),
          { maxRetries: 3, baseDelay: 1000 }
        ),
      
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return this.client.auth.onAuthStateChange(async (event, session) => {
          try {
            await callback(event, session)
          } catch (error) {
            console.error('Auth state change callback error:', error)
          }
        })
      },
      
      refreshSession: () => withNetworkResilience(
        () => this.client.auth.refreshSession(),
        { maxRetries: 3, baseDelay: 2000 }
      )
    }
  }

  // Enhanced database methods with retry logic
  from(table: string) {
    const baseQuery = this.client.from(table)
    
    // Create a proxy to handle all query builder methods
    const createQueryProxy = (query: any) => {
      return new Proxy(query, {
        get: (target, prop) => {
          const originalMethod = target[prop]
          
          if (typeof originalMethod === 'function') {
            return (...args: any[]) => {
              const result = originalMethod.apply(target, args)
              
              // If the result has a 'then' method, it's a promise (final query)
              if (result && typeof result.then === 'function') {
                return withNetworkResilience(
                  () => result,
                  { maxRetries: 3, baseDelay: 1000 }
                )
              }
              
              // Otherwise, continue building the query chain
              return createQueryProxy(result)
            }
          }
          
          return originalMethod
        }
      })
    }
    
    return createQueryProxy(baseQuery)
  }

  // Storage methods with retry logic
  get storage() {
    return {
      from: (bucket: string) => ({
        upload: (path: string, file: File | Blob, options?: any) => 
          withNetworkResilience(
            () => this.client.storage.from(bucket).upload(path, file, options),
            { maxRetries: 3, baseDelay: 2000 }
          ),
        
        download: (path: string) => 
          withNetworkResilience(
            () => this.client.storage.from(bucket).download(path),
            { maxRetries: 2, baseDelay: 1000 }
          ),
        
        remove: (paths: string[]) => 
          withNetworkResilience(
            () => this.client.storage.from(bucket).remove(paths),
            { maxRetries: 2, baseDelay: 1000 }
          ),
        
        getPublicUrl: (path: string) => 
          this.client.storage.from(bucket).getPublicUrl(path)
      })
    }
  }

  // Cleanup method
  cleanup() {
    if (this.networkListenerCleanup) {
      this.networkListenerCleanup()
    }
  }
}

// Create and export the resilient Supabase client
export const supabase = new ResilientSupabaseClient(baseSupabase)

// Export the base client for cases where resilience is not needed
export const baseSupabaseClient = baseSupabase

// Export types
export type { ResilientSupabaseClient }