import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { withRetry } from '../utils/network';

export interface Project {
  id: string;
  user_id: string;
  template_id?: string;
  name: string;
  content_data?: any;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Skip network connectivity check to prevent ERR_ABORTED errors
      // The resilient Supabase client will handle retries internally
      
      // Check if we're offline using basic browser API
      if (!navigator.onLine) {
        // Try to load from local storage as fallback
        const cachedProjects = localStorage.getItem(`projects_${user.id}`);
        if (cachedProjects) {
          setProjects(JSON.parse(cachedProjects));
          setError('You are offline. Showing cached projects.');
          return;
        }
        throw new Error('No internet connection and no cached data available.');
      }

      // Use retry mechanism for the API call
      const fetchWithRetry = async () => {
        const result = await supabase.from('projects').select('*');
        const { data, error: fetchError } = result;
        
        if (fetchError) {
          throw fetchError;
        }

        // Filter and sort the data manually since the resilient client doesn't support chaining
        const filteredData = (data || []).filter((project: any) => project.user_id === user.id)
          .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 10);

        return filteredData;
      };

      const data = await withRetry(fetchWithRetry, 3, 1000);
      
      // Ensure data is a valid Project array
           if (Array.isArray(data) && data.length > 0) {
              try {
                // Simple validation - if it looks like project data, use it
                const isValidProjectData = data.every((item: any) => 
                  item && typeof item === 'object' && typeof item.id === 'string'
                );
                if (isValidProjectData) {
                  setProjects(data as unknown as Project[]);
                } else {
                  setProjects([]);
                }
              } catch {
                setProjects([]);
              }
            } else {
              setProjects([]);
            }
      
      // Cache the successful result
      localStorage.setItem(`projects_${user.id}`, JSON.stringify(data || []));
      
    } catch (err) {
      console.error('Error fetching projects:', err);
      
      // Try to load cached data as last resort
      const cachedProjects = localStorage.getItem(`projects_${user.id}`);
      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));
        setError('Using cached data due to connection issues.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    console.log('🔧 createProject called with:', {
      projectData,
      user: user ? { id: user.id, email: user.email } : null,
      timestamp: new Date().toISOString()
    });
    
    if (!user) {
      console.error('❌ User not authenticated in createProject');
      throw new Error('User not authenticated');
    }

    try {
      // Check basic connectivity using browser API
      if (!navigator.onLine) {
        console.error('❌ User is offline');
        throw new Error('Cannot create project while offline. Please check your connection and try again.');
      }

      const createWithRetry = async () => {
        const insertData = {
          ...projectData,
          user_id: user.id,
        };
        
        console.log('📤 Sending insert request to Supabase:', {
          insertData,
          contentDataSize: JSON.stringify(insertData.content_data || {}).length
        });
        
        const insertResult = await supabase.from('projects').insert(insertData).select();
        
        console.log('📥 Supabase insert response:', {
          insertResult,
          hasData: !!insertResult.data,
          dataLength: insertResult.data?.length,
          hasError: !!insertResult.error
        });
        
        const { data, error: createError } = insertResult;

        if (createError) {
          console.error('❌ Supabase insert error:', createError);
          throw createError;
        }

        // Return the first item if data is an array, or the data itself
        if (!data || data.length === 0) {
          console.error('❌ No data returned from create operation');
          throw new Error('No data returned from create operation');
        }
        
        const projectResult = Array.isArray(data) ? data[0] : data;
        console.log('✅ Project created successfully:', {
          projectId: projectResult.id,
          projectName: projectResult.name,
          projectResult
        });
        
        return projectResult as unknown as Project;
      };

      console.log('🔄 Starting createWithRetry...');
      const data = await withRetry(createWithRetry, 3, 1000);
      
      console.log('🔄 Refreshing projects list after create...');
      // Refresh projects list
      await fetchProjects();
      
      console.log('🎉 createProject completed successfully:', data);
      return data;
    } catch (err) {
      console.error('❌ Error creating project:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      });
      throw err;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Check basic connectivity using browser API
      if (!navigator.onLine) {
        throw new Error('Cannot update project while offline. Please check your connection and try again.');
      }

      const updateWithRetry = async () => {
        const updateResult = await supabase.from('projects').update({
          ...updates,
          updated_at: new Date().toISOString(),
        }).eq('id', projectId).select();
        
        const { data, error: updateError } = updateResult;

        if (updateError) {
          throw updateError;
        }

        // Return the first item if data is an array, or the data itself
        if (!data || data.length === 0) {
          throw new Error('No data returned from update operation');
        }
        const projectResult = Array.isArray(data) ? data[0] : data;
        return projectResult as unknown as Project;
      };

      const data = await withRetry(updateWithRetry, 3, 1000);
      
      // Refresh projects list
      await fetchProjects();
      return data;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Check basic connectivity using browser API
      if (!navigator.onLine) {
        throw new Error('Cannot delete project while offline. Please check your connection and try again.');
      }

      const deleteWithRetry = async () => {
        const deleteResult = await supabase.from('projects').delete().eq('id', projectId);
        const { error: deleteError } = deleteResult;

        if (deleteError) {
          throw deleteError;
        }
      };

      await withRetry(deleteWithRetry, 3, 1000);
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  // Fetch projects when user changes
  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Set up real-time subscription for project changes
  useEffect(() => {
    if (!user) return;

    // Note: Real-time subscriptions temporarily disabled due to resilient client limitations
    // Will be re-enabled once the resilient client supports channels
    
    // For now, we'll rely on manual refresh after operations
    // TODO: Implement real-time subscriptions with the resilient client
    
  }, [user]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}