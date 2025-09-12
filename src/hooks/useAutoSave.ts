import { useCallback, useEffect, useRef, useState } from 'react';
import { ContentBlock, BrandKit } from '../types/newsletter';

interface UseAutoSaveProps {
  blocks: ContentBlock[];
  brandKit: BrandKit;
  viewMode: string;
  currentDraftId: string | null;
  updateProject: (id: string, data: any) => Promise<any>;
  createProject: (data: any) => Promise<any>;
  generateDraftName: () => string;
}

interface UseAutoSaveReturn {
  autoSaveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  hasUnsavedChanges: boolean;
  lastSaveTime: Date | null;
  autoSaveEnabled: boolean;
  performAutoSave: () => Promise<void>;
  setAutoSaveStatus: (status: 'saved' | 'saving' | 'unsaved' | 'error') => void;
  setHasUnsavedChanges: (value: boolean) => void;
  setLastSaveTime: (time: Date | null) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setCurrentDraftId: (id: string | null) => void;
  detectChanges: () => void;
}

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds

export const useAutoSave = ({
  blocks,
  brandKit,
  viewMode,
  currentDraftId,
  updateProject,
  createProject,
  generateDraftName
}: UseAutoSaveProps): UseAutoSaveReturn => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoSaveRetryCount, setAutoSaveRetryCount] = useState(0);
  const [internalCurrentDraftId, setInternalCurrentDraftId] = useState<string | null>(currentDraftId);
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentHashRef = useRef<string | null>(null);
  const draftNameRef = useRef<string | null>(null);

  // Update internal draft ID when prop changes
  useEffect(() => {
    setInternalCurrentDraftId(currentDraftId);
  }, [currentDraftId]);

  const setCurrentDraftId = useCallback((id: string | null) => {
    setInternalCurrentDraftId(id);
  }, []);

  // Generate content hash for change detection
  const generateContentHash = useCallback(() => {
    const content = {
      blocks,
      brandKit,
      viewMode
    };
    return btoa(JSON.stringify(content)).slice(0, 32);
  }, [blocks, brandKit, viewMode]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!autoSaveEnabled || !hasUnsavedChanges || blocks.length === 0) {
      console.log('Auto-save skipped:', { autoSaveEnabled, hasUnsavedChanges, blocksCount: blocks.length });
      return;
    }

    setAutoSaveStatus('saving');
    console.log('Performing auto-save...');

    try {
      const projectData = {
        name: draftNameRef.current || generateDraftName(),
        content_data: {
          blocks,
          brandKit,
          viewMode
        },
        type: 'newsletter' as const,
        status: 'draft' as const
      };

      let savedProject;
      
      if (internalCurrentDraftId) {
        console.log('Updating existing draft:', internalCurrentDraftId);
        savedProject = await updateProject(internalCurrentDraftId, projectData);
      } else {
        console.log('Creating new draft');
        savedProject = await createProject(projectData);
        setInternalCurrentDraftId(savedProject.id);
        draftNameRef.current = savedProject.name;
      }

      console.log('Auto-save successful:', { projectId: savedProject.id, name: savedProject.name });
      setAutoSaveStatus('saved');
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date());
      setAutoSaveRetryCount(0);
      lastContentHashRef.current = generateContentHash();
      console.log('Updated hash after save:', lastContentHashRef.current?.slice(0, 8));
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      
      // Retry logic
      if (autoSaveRetryCount < MAX_RETRY_ATTEMPTS) {
        setAutoSaveRetryCount(prev => prev + 1);
        setTimeout(() => {
          performAutoSave();
        }, RETRY_DELAY);
      }
    }
  }, [autoSaveEnabled, hasUnsavedChanges, blocks, brandKit, viewMode, internalCurrentDraftId, generateContentHash, generateDraftName, updateProject, createProject, autoSaveRetryCount]);

  // Schedule auto-save
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave();
    }, AUTO_SAVE_INTERVAL);
  }, [performAutoSave]);

  // Detect changes
  const detectChanges = useCallback(() => {
    const currentHash = generateContentHash();
    
    // For new projects, if we have blocks but no baseline hash, consider it as changes
    const isNewProjectWithBlocks = blocks.length > 0 && !lastContentHashRef.current;
    const hasContentChanges = currentHash !== lastContentHashRef.current;
    const hasChanges = (hasContentChanges && blocks.length > 0) || isNewProjectWithBlocks;
    
    console.log('🔍 Change detection:', {
      currentHash: currentHash.slice(0, 8),
      lastHash: lastContentHashRef.current?.slice(0, 8),
      isNewProjectWithBlocks,
      hasContentChanges,
      hasChanges,
      blocksCount: blocks.length,
      currentUnsavedState: hasUnsavedChanges,
      autoSaveStatus,
      timestamp: new Date().toISOString()
    });
    
    if (hasChanges && !hasUnsavedChanges) {
      console.log('📝 Changes detected! Setting hasUnsavedChanges to true');
      setHasUnsavedChanges(true);
      setAutoSaveStatus('unsaved');
      scheduleAutoSave();
    } else if (!hasChanges && hasUnsavedChanges) {
      console.log('⚠️ No changes detected, but hasUnsavedChanges is true - this might indicate a state sync issue');
      // Force sync the state if no changes but unsaved flag is true
      console.log('🔄 Force syncing state - setting hasUnsavedChanges to false');
      setHasUnsavedChanges(false);
      setAutoSaveStatus('saved');
    } else if (hasChanges && hasUnsavedChanges) {
      console.log('📝 Changes detected and already marked as unsaved');
    } else {
      console.log('✅ No changes detected and state is in sync');
    }
  }, [generateContentHash, blocks.length, scheduleAutoSave, hasUnsavedChanges, autoSaveStatus]);

  // Initialize content hash and draft name
  useEffect(() => {
    // Only set initial hash if we have no blocks (truly empty project)
    // This allows detection of blocks being added to empty projects
    if (blocks.length === 0) {
      lastContentHashRef.current = generateContentHash();
    }
    
    if (!draftNameRef.current) {
      draftNameRef.current = generateDraftName();
    }
    
    console.log('🚀 Auto-save system initialized');
  }, [generateContentHash, generateDraftName]);

  // Auto-detect changes when blocks, brandKit, or viewMode change
  useEffect(() => {
    console.log('📊 Content changed, triggering change detection...');
    detectChanges();
  }, [blocks, brandKit, viewMode, detectChanges]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Auto-save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('Before unload - hasUnsavedChanges:', hasUnsavedChanges, 'autoSaveEnabled:', autoSaveEnabled);
      
      if (hasUnsavedChanges && autoSaveEnabled) {
        performAutoSave();
      }
      
      // Show warning if there are unsaved changes
      if (hasUnsavedChanges) {
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, autoSaveEnabled, performAutoSave]);

  return {
    autoSaveStatus,
    hasUnsavedChanges,
    lastSaveTime,
    autoSaveEnabled,
    performAutoSave,
    setAutoSaveStatus,
    setHasUnsavedChanges,
    setLastSaveTime,
    setAutoSaveEnabled,
    setCurrentDraftId,
    detectChanges
  };
};