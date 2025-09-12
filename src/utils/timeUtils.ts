/**
 * Utility functions for time formatting and handling
 */

/**
 * Format a date to a localized time string with consistent timezone handling
 * @param date - The date to format
 * @param options - Additional formatting options
 * @returns Formatted time string
 */
export const formatSaveTime = (date: Date | null): string => {
  if (!date) return 'Saved';
  
  try {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  } catch (error) {
    console.warn('Error formatting time:', error);
    // Fallback to simple format
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};

/**
 * Get current time as a Date object
 * @returns Current date/time
 */
export const getCurrentTime = (): Date => {
  return new Date();
};

/**
 * Format a date for display in the UI
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDisplayDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.warn('Error formatting display date:', error);
    return dateObj.toString();
  }
};

/**
 * Generate a draft name with current timestamp
 * @returns Draft name string
 */
export const generateDraftName = (): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return `Draft - ${dateStr}`;
};

/**
 * Check if a timestamp is from today
 * @param date - The date to check
 * @returns True if the date is from today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Get relative time string (e.g., "2 minutes ago")
 * @param date - The date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
};