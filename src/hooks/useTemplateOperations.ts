import { useState } from 'react';
import { Template, ContentBlock, BrandKit } from '../types/newsletter';
import { TemplateManager } from '../utils/templateUtils';

interface UseTemplateOperationsProps {
  brandKit: BrandKit;
  onBlocksChange: (blocks: ContentBlock[]) => void;
  onSaveToHistory: (blocks: ContentBlock[]) => void;
  onDetectChanges: () => void;
}

export const useTemplateOperations = ({
  brandKit,
  onBlocksChange,
  onSaveToHistory,
  onDetectChanges
}: UseTemplateOperationsProps) => {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [showTemplateConfirmation, setShowTemplateConfirmation] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [templateSuccess, setTemplateSuccess] = useState<string | null>(null);

  const handleTemplateSelection = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateConfirmation(true);
    setTemplateError(null);
  };

  const previewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplatePreview(true);
  };

  const applyTemplate = async (template: Template, currentBlocks: ContentBlock[]) => {
    try {
      setIsApplyingTemplate(true);
      setTemplateError(null);
      
      // Save current state to history before applying template
      onSaveToHistory(currentBlocks);
      
      // Apply the template using TemplateManager
      const brandedBlocks = await TemplateManager.applyTemplate(template, brandKit);
      
      // Apply the template
      onBlocksChange(brandedBlocks);
      onSaveToHistory(brandedBlocks);
      
      // Trigger change detection for auto-save
      setTimeout(() => onDetectChanges(), 100);
      
      // Show success message
      setTemplateSuccess(`Template "${template.name}" applied successfully!`);
      setTimeout(() => setTemplateSuccess(null), 3000);
      
      // Close dialogs
      setShowTemplateConfirmation(false);
      setShowTemplatePreview(false);
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error('Error applying template:', error);
      setTemplateError(error instanceof Error ? error.message : 'Failed to apply template. Please try again.');
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  const cancelTemplateApplication = () => {
    setShowTemplateConfirmation(false);
    setShowTemplatePreview(false);
    setSelectedTemplate(null);
    setTemplateError(null);
  };

  const clearTemplateSuccess = () => {
    setTemplateSuccess(null);
  };

  const clearTemplateError = () => {
    setTemplateError(null);
  };

  return {
    // State
    isApplyingTemplate,
    showTemplateConfirmation,
    selectedTemplate,
    showTemplatePreview,
    templateError,
    templateSuccess,
    
    // Actions
    handleTemplateSelection,
    previewTemplate,
    applyTemplate,
    cancelTemplateApplication,
    clearTemplateSuccess,
    clearTemplateError
  };
};

export default useTemplateOperations;