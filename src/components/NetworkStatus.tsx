import React from 'react'
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface NetworkStatusProps {
  className?: string
}

export function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const { isOnline, networkError, retryConnection } = useAuth()

  if (isOnline && !networkError) {
    return null // Don't show anything when everything is working
  }

  const handleRetry = async () => {
    try {
      await retryConnection()
    } catch (error) {
      console.error('Retry failed:', error)
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {!isOnline ? (
              <WifiOff className="h-5 w-5 text-red-500" />
            ) : networkError ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <Wifi className="h-5 w-5 text-green-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {!isOnline ? 'No Internet Connection' : 'Connection Issues'}
            </div>
            
            <div className="text-sm text-gray-500 mt-1">
              {!isOnline 
                ? 'Please check your internet connection and try again.'
                : networkError || 'Having trouble connecting to our services.'
              }
            </div>
            
            {(isOnline || networkError) && (
              <button
                onClick={handleRetry}
                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry Connection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for use in headers or toolbars
export function NetworkStatusIndicator({ className = '' }: NetworkStatusProps) {
  const { isOnline, networkError, retryConnection } = useAuth()

  const handleRetry = async () => {
    try {
      await retryConnection()
    } catch (error) {
      console.error('Retry failed:', error)
    }
  }

  if (isOnline && !networkError) {
    return (
      <div className={`flex items-center text-green-600 ${className}`} title="Connected">
        <Wifi className="h-4 w-4" />
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      {!isOnline ? (
        <div className="flex items-center text-red-600" title="No internet connection">
          <WifiOff className="h-4 w-4" />
        </div>
      ) : (
        <button
          onClick={handleRetry}
          className="flex items-center text-yellow-600 hover:text-yellow-500"
          title={networkError || 'Connection issues - click to retry'}
        >
          <AlertTriangle className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}