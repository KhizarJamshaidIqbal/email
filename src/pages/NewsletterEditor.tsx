import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Grid, CheckCircle, X } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import TemplatePreviewModal from '../components/TemplatePreviewModal';
import TemplateConfirmationDialog from '../components/TemplateConfirmationDialog';
import SaveDialog from '../components/SaveDialog';
import EditorToolbar from '../components/EditorToolbar';
import EditorSidebar from '../components/EditorSidebar';
import BlockRenderer from '../components/BlockRenderer';
import PropertiesPanel from '../components/PropertiesPanel';
import PreviewModal from '../components/PreviewModal';
import { useProjects } from '../hooks/useProjects';
import { useAutoSave } from '../hooks/useAutoSave';
import { useBlockOperations } from '../hooks/useBlockOperations';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useHistory } from '../hooks/useHistory';
import { useTemplateOperations } from '../hooks/useTemplateOperations';
import { useSaveOperations } from '../hooks/useSaveOperations';
import { ContentBlock, BrandKit, ViewMode, ActivePanel } from '../types/newsletter';
import { generateDraftName } from '../utils/timeUtils';
import { templates } from '../data/templates';

// Types are now imported from '../types/newsletter'

const NewsletterEditor: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { createProject, updateProject, projects } = useProjects();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Project Loading State
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  
  // Editor State
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('blocks');
  const [isEditingText, setIsEditingText] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  
  // Template and Save operations will be handled by custom hooks
  
  // Initialize hooks
  const history = useHistory(blocks);
  
  // Brand Kit
  const brandKit: BrandKit = {
    colors: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1'],
    fonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'],
    logos: []
  };

  // Initialize auto-save hook
  const autoSave = useAutoSave({
    blocks,
    brandKit,
    viewMode,
    currentDraftId,
    updateProject,
    createProject,
    generateDraftName
  });
  
  // Initialize drag and drop hook
  const dragAndDrop = useDragAndDrop({
    blocks,
    setBlocks,
    saveToHistory: history.saveToHistory,
    detectChanges: autoSave.detectChanges,
    setSelectedBlock: (blockId) => {} // Will be updated
  });
  
  // Initialize block operations hook
  const blockOps = useBlockOperations({
    blocks,
    setBlocks,
    setSelectedBlock: dragAndDrop.setSelectedBlock,
    saveToHistory: history.saveToHistory,
    detectChanges: autoSave.detectChanges
  });
  
  // Load project data when projectId is provided
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || projectId.startsWith('new-')) {
        setIsLoadingProject(false);
        setProjectLoadError(null);
        return;
      }
      
      try {
        setIsLoadingProject(true);
        setProjectLoadError(null);
        
        if (!projects || projects.length === 0) {
          setIsLoadingProject(false);
          return;
        }
        
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
          throw new Error(`Project not found. The project may have been deleted or you may not have access to it.`);
        }
        
        setCurrentProject(project);
        
        console.log('📂 LOADING PROJECT:', {
          projectId: project.id,
          projectName: project.name,
          hasContentData: !!project.content_data,
          hasBlocks: !!project.content_data?.blocks,
          blocksIsArray: Array.isArray(project.content_data?.blocks),
          blocksCount: project.content_data?.blocks?.length || 0,
          contentData: project.content_data
        });
        
        if (project.content_data?.blocks && Array.isArray(project.content_data.blocks)) {
          console.log('✅ LOADING BLOCKS:', {
            blocksCount: project.content_data.blocks.length,
            blockIds: project.content_data.blocks.map(b => b.id)
          });
          setBlocks(project.content_data.blocks);
          history.saveToHistory(project.content_data.blocks);
        } else {
          console.log('⚠️ NO BLOCKS TO LOAD - initializing empty blocks array');
          setBlocks([]);
        }
        
        setCurrentDraftId(project.id);
        autoSave.setCurrentDraftId(project.id);
        autoSave.setAutoSaveStatus('saved');
        autoSave.setHasUnsavedChanges(false);
        autoSave.setLastSaveTime(new Date());
        
      } catch (error) {
        console.error('Error loading project:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load project';
        setProjectLoadError(errorMessage);
        setCurrentProject(null);
        setCurrentDraftId(null);
        autoSave.setCurrentDraftId(null);
      } finally {
        setIsLoadingProject(false);
      }
    };
    
    loadProject();
  }, [projectId, projects]);
  
  // Utility functions
  const exportAsHTML = () => {
    console.log('Exporting as HTML...');
  };

  const previewNewsletter = () => {
    setShowPreview(true);
  };

  const handleTextEdit = (blockId: string, newText: string) => {
    blockOps.updateBlockProperty(blockId, 'content.text', newText);
    setIsEditingText(null);
  };

  const handleTextChange = (blockId: string, text: string) => {
    blockOps.updateBlockProperty(blockId, 'content.text', text);
  };
  
  // Initialize template operations hook
  const templateOps = useTemplateOperations({
    brandKit,
    onBlocksChange: setBlocks,
    onSaveToHistory: history.saveToHistory,
    onDetectChanges: autoSave.detectChanges
  });

  // Initialize save operations hook
  const saveOps = useSaveOperations({
    createProject,
    brandKit,
    blocks,
    hasUnsavedChanges: autoSave.hasUnsavedChanges,
    onSaveComplete: (projectId: string) => {
      setCurrentDraftId(projectId);
      autoSave.setCurrentDraftId(projectId);
      autoSave.setHasUnsavedChanges(false);
      autoSave.setAutoSaveStatus('saved');
      autoSave.setLastSaveTime(new Date());
    }
  });
  
  // Mouse event listeners for drag and drop
  useEffect(() => {
    if (dragAndDrop.isDragging) {
      const handleMouseMove = (e: MouseEvent) => dragAndDrop.handleMouseMove(e, canvasRef);
      const handleMouseUp = () => dragAndDrop.handleMouseUp();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragAndDrop.isDragging, dragAndDrop.handleMouseMove, dragAndDrop.handleMouseUp]);

  // Click-outside handler to deselect elements
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (canvasRef.current && canvasRef.current.contains(target)) return;
      if (target.closest('.properties-panel') || target.closest('.sidebar-panel')) return;
      if (target.closest('.modal') || target.closest('.dropdown')) return;
      
      dragAndDrop.setSelectedBlock(null);
      setIsEditingText(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Render block helper
  const renderBlock = (block: ContentBlock) => {
    const isSelected = dragAndDrop.selectedBlock === block.id;
    const isEditing = isEditingText === block.id;
    
    return (
      <BlockRenderer
        key={block.id}
        block={block}
        isSelected={isSelected}
        isEditing={isEditing}
        isDragging={dragAndDrop.isDragging}
        onSelect={dragAndDrop.setSelectedBlock}
        onMouseDown={dragAndDrop.handleMouseDown}
        onDoubleClick={setIsEditingText}
        onTextChange={handleTextChange}
        onTextBlur={() => setIsEditingText(null)}
        onTextKeyDown={(e) => {
          if (e.key === 'Enter') setIsEditingText(null);
        }}
        onDuplicate={blockOps.duplicateBlock}
        onDelete={blockOps.deleteBlock}
        canvasRef={canvasRef}
      />
    );
  };

  const selectedBlock = blocks.find(b => b.id === dragAndDrop.selectedBlock) || null;
  
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <EditorSidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        brandKit={brandKit}
        templates={templates}
        onDragStart={dragAndDrop.handleDragStart}
        onTemplatePreview={templateOps.previewTemplate}
        onTemplateSelect={templateOps.handleTemplateSelection}
        isApplyingTemplate={templateOps.isApplyingTemplate}
      />
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <EditorToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onPreview={previewNewsletter}
          onExport={exportAsHTML}
          onSave={saveOps.saveProject}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onUndo={() => {
            const undoBlocks = history.undo();
            if (undoBlocks) setBlocks(undoBlocks);
          }}
          onRedo={() => {
            const redoBlocks = history.redo();
            if (redoBlocks) setBlocks(redoBlocks);
          }}
          autoSaveStatus={autoSave.autoSaveStatus}
          lastSaveTime={autoSave.lastSaveTime}
          autoSaveEnabled={autoSave.autoSaveEnabled}
          onToggleAutoSave={() => autoSave.setAutoSaveEnabled(!autoSave.autoSaveEnabled)}
          onRetryAutoSave={autoSave.performAutoSave}
          isSaving={saveOps.isSaving}
        />
        
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="flex justify-center">
            <div 
              ref={canvasRef}
              className={`bg-white shadow-lg relative ${
                viewMode === 'desktop' ? 'w-full max-w-4xl' :
                viewMode === 'tablet' ? 'w-96' : 'w-80'
              }`}
              style={{ minHeight: '800px' }}
              onDragOver={dragAndDrop.handleDragOver}
              onDrop={(e) => dragAndDrop.handleDrop(e, canvasRef)}
            >
              {isLoadingProject ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                    <p className="text-lg font-medium mb-2">Loading Project...</p>
                    <p className="text-sm">Please wait while we load your newsletter</p>
                  </div>
                </div>
              ) : projectLoadError ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className="text-lg font-medium mb-2 text-red-600">Failed to Load Project</p>
                    <p className="text-sm mb-4">{projectLoadError}</p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : blocks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Grid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Start Building Your Newsletter</p>
                    <p className="text-sm">Drag content blocks from the sidebar to get started</p>
                  </div>
                </div>
              ) : (
                blocks.map(renderBlock)
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Properties Panel */}
      <PropertiesPanel
        selectedBlock={selectedBlock}
        brandKit={brandKit}
        onUpdateProperty={blockOps.updateBlockProperty}
      />
      {/* AI Assistant */}
      <AIAssistant />
      
      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        blocks={blocks}
        onClose={() => setShowPreview(false)}
      />
      

      
      {/* Template Confirmation Dialog */}
      <TemplateConfirmationDialog
        isOpen={templateOps.showTemplateConfirmation}
        template={templateOps.selectedTemplate}
        isApplying={templateOps.isApplyingTemplate}
        onConfirm={() => templateOps.applyTemplate(templateOps.selectedTemplate!, blocks)}
        onCancel={templateOps.cancelTemplateApplication}
      />
      
      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={templateOps.showTemplatePreview}
        template={templateOps.selectedTemplate}
        brandKit={brandKit}
        onClose={templateOps.cancelTemplateApplication}
        onUseTemplate={() => {
          templateOps.cancelTemplateApplication();
          templateOps.handleTemplateSelection(templateOps.selectedTemplate!);
        }}
      />
      
      {/* Save Dialog */}
      <SaveDialog
        isOpen={saveOps.showSaveDialog}
        newsletterName={saveOps.newsletterName}
        isSaving={saveOps.isSaving}
        saveError={saveOps.saveError}
        onNameChange={saveOps.setNewsletterName}
        onSave={() => {
          console.log('💾 SAVE BUTTON CLICKED:', {
            blocksCount: blocks.length,
            blocks: blocks,
            blockIds: blocks.map(b => b.id),
            timestamp: new Date().toISOString()
          });
          saveOps.handleSaveWithName(blocks);
        }}
        onCancel={saveOps.cancelSave}
      />
      
      {/* Success/Error Messages */}
      {templateOps.templateSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{templateOps.templateSuccess}</span>
          </div>
        </div>
      )}
      
      {templateOps.templateError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{templateOps.templateError}</span>
          </div>
        </div>
      )}
      
      {saveOps.saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{saveOps.saveSuccess}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterEditor;