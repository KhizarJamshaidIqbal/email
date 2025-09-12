import { useState } from 'react';
import { ContentBlock, BrandKit } from '../types/newsletter';

interface UseSaveOperationsProps {
  createProject: (data: any) => Promise<any>;
  brandKit: BrandKit;
  hasUnsavedChanges: boolean;
  onSaveComplete: (projectId: string) => void;
  blocks: ContentBlock[]; // Add blocks as a prop to ensure we always have current state
}

export const useSaveOperations = ({
  createProject,
  brandKit,
  hasUnsavedChanges,
  onSaveComplete,
  blocks
}: UseSaveOperationsProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newsletterName, setNewsletterName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const saveProject = () => {
    // Only show save dialog if there are actual unsaved changes
    if (!hasUnsavedChanges) {
      console.log('No unsaved changes detected, skipping save dialog');
      return;
    }
    
    // Show save dialog for unsaved changes
    setShowSaveDialog(true);
    setNewsletterName('');
    setSaveError(null);
  };

  const handleSaveWithName = async (blocksParam?: ContentBlock[]) => {
    // Use blocks from props (current state) or fallback to parameter
    const currentBlocks = blocksParam || blocks;
    if (!newsletterName.trim()) {
      setSaveError('Newsletter name is required');
      return;
    }
    
    try {
      console.log('🚀 Starting manual save...', { 
        name: newsletterName.trim(), 
        blocksCount: currentBlocks.length,
        blocks: currentBlocks,
        blockIds: currentBlocks.map(b => b.id),
        timestamp: new Date().toISOString()
      });
      setIsSaving(true);
      setSaveError(null);
      
      // Prepare project data for saving to Supabase
      const projectData = {
        name: newsletterName.trim(),
        content_data: {
          blocks: currentBlocks,
          brandKit: brandKit,
          version: '1.0'
        },
        status: 'draft' as const
      };
      
      console.log('📝 Manual save project data:', { 
        name: projectData.name, 
        blocksCount: projectData.content_data.blocks.length,
        contentDataSize: JSON.stringify(projectData.content_data).length,
        projectData: projectData
      });
      
      // Save to Supabase database using useProjects hook
      console.log('💾 Calling createProject...');
      const savedProject = await createProject(projectData);
      
      console.log('✅ Manual save successful:', { 
        projectId: savedProject?.id, 
        name: savedProject?.name,
        savedProject: savedProject
      });
      
      // Verify the project was actually saved by checking if we got a valid response
      if (!savedProject || !savedProject.id) {
        throw new Error('Save operation returned invalid response - no project ID received');
      }
      
      // Notify parent component of successful save
      console.log('📢 Notifying parent component of save completion...');
      onSaveComplete(savedProject.id);
      
      // Close dialog and show success message
      setShowSaveDialog(false);
      setNewsletterName('');
      setSaveSuccess(`Newsletter "${projectData.name}" saved successfully!`);
      setTimeout(() => setSaveSuccess(null), 3000);
      
      console.log('🎉 Save workflow completed successfully');
      
    } catch (error) {
      console.error('❌ Save error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          setSaveError('Please log in to save your newsletter.');
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          setSaveError('Network error. Please check your connection and try again.');
        } else {
          setSaveError(`Failed to save newsletter: ${error.message}`);
        }
      } else {
        setSaveError('Failed to save newsletter. Please try again.');
      }
    } finally {
      setIsSaving(false);
      console.log('🏁 Save operation finished (finally block)');
    }
  };

  const cancelSave = () => {
    setShowSaveDialog(false);
    setNewsletterName('');
    setSaveError(null);
  };

  const clearSaveSuccess = () => {
    setSaveSuccess(null);
  };

  const clearSaveError = () => {
    setSaveError(null);
  };

  return {
    // State
    showSaveDialog,
    newsletterName,
    isSaving,
    saveError,
    saveSuccess,
    
    // Actions
    saveProject,
    handleSaveWithName,
    cancelSave,
    setNewsletterName,
    clearSaveSuccess,
    clearSaveError
  };
};

export default useSaveOperations;