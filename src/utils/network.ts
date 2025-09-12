// Network utility functions for handling connectivity and retries

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

export interface NetworkStatus {
  isOnline: boolean
  isSupabaseReachable: boolean
  lastChecked: Date
}

// Check if the browser is online
export const isOnline = (): boolean => {
  return navigator.onLine
}

// Check if Supabase is reachable
export const checkSupabaseConnectivity = async (supabaseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    })
    
    clearTimeout(timeoutId)
    return response.ok || response.status === 401 // 401 is expected without auth
  } catch (error) {
    console.warn('Supabase connectivity check failed:', error)
    return false
  }
}

// Get current network status
export const getNetworkStatus = async (supabaseUrl: string): Promise<NetworkStatus> => {
  const isOnlineStatus = isOnline()
  const isSupabaseReachable = isOnlineStatus ? await checkSupabaseConnectivity(supabaseUrl) : false
  
  return {
    isOnline: isOnlineStatus,
    isSupabaseReachable,
    lastChecked: new Date()
  }
}

// Exponential backoff retry function
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options

  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }
      
      // Check if it's a network error that should be retried
      if (!isRetryableError(error)) {
        throw error
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay)
      
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Check if an error should be retried
export const isRetryableError = (error: any): boolean => {
  if (!error) return false
  
  // Network errors
  if (error.name === 'TypeError' && error.message?.includes('fetch')) {
    return true
  }
  
  // Supabase specific errors
  if (error.message?.includes('ERR_NETWORK_IO_SUSPENDED') ||
      error.message?.includes('ERR_ABORTED') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('timeout')) {
    return true
  }
  
  // HTTP status codes that should be retried
  if (error.status) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504]
    return retryableStatuses.includes(error.status)
  }
  
  return false
}

// Create a network-aware wrapper for Supabase operations
export const withNetworkResilience = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions & { skipConnectivityCheck?: boolean } = {}
): Promise<T> => {
  const { skipConnectivityCheck = false, ...retryOptions } = options
  
  // Check network connectivity first (unless skipped)
  if (!skipConnectivityCheck && !isOnline()) {
    throw new Error('No internet connection available')
  }
  
  return retryWithBackoff(operation, retryOptions)
}

// Simple retry function alias for backward compatibility
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  return retryWithBackoff(operation, { maxRetries, baseDelay })
}

// Listen for network status changes
export const createNetworkStatusListener = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}