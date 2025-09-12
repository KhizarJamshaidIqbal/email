import { useCallback } from 'react';
import { ContentBlock } from '../types/newsletter';

interface UseBlockOperationsProps {
  blocks: ContentBlock[];
  setBlocks: (blocks: ContentBlock[]) => void;
  setSelectedBlock: (blockId: string | null) => void;
  saveToHistory: (blocks: ContentBlock[]) => void;
  detectChanges: () => void;
}

interface UseBlockOperationsReturn {
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  updateBlockProperty: (blockId: string, property: string, value: any) => void;
  addBlock: (block: ContentBlock) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
}

export const useBlockOperations = ({
  blocks,
  setBlocks,
  setSelectedBlock,
  saveToHistory,
  detectChanges
}: UseBlockOperationsProps): UseBlockOperationsReturn => {

  // Delete a block
  const deleteBlock = useCallback((blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
    setSelectedBlock(null);
    
    // Trigger change detection for auto-save
    setTimeout(() => detectChanges(), 100);
  }, [blocks, setBlocks, saveToHistory, setSelectedBlock, detectChanges]);

  // Duplicate a block
  const duplicateBlock = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      const newBlock = {
        ...block,
        id: Date.now().toString(),
        position: { x: block.position.x + 20, y: block.position.y + 20 }
      };
      const newBlocks = [...blocks, newBlock];
      setBlocks(newBlocks);
      saveToHistory(newBlocks);
      
      // Trigger change detection for auto-save
      setTimeout(() => detectChanges(), 100);
    }
  }, [blocks, setBlocks, saveToHistory, detectChanges]);

  // Update block property
  const updateBlockProperty = useCallback((blockId: string, property: string, value: any) => {
    const newBlocks = blocks.map(block => {
      if (block.id === blockId) {
        const updatedBlock = { ...block };
        const propertyPath = property.split('.');
        
        // Navigate to the nested property
        let current = updatedBlock;
        for (let i = 0; i < propertyPath.length - 1; i++) {
          const key = propertyPath[i];
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
        
        // Set the final property
        current[propertyPath[propertyPath.length - 1]] = value;
        
        return updatedBlock;
      }
      return block;
    });
    
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
    
    // Trigger change detection for auto-save
    setTimeout(() => detectChanges(), 100);
  }, [blocks, setBlocks, saveToHistory, detectChanges]);

  // Add a new block
  const addBlock = useCallback((block: ContentBlock) => {
    const newBlocks = [...blocks, block];
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
    
    // Trigger change detection for auto-save
    setTimeout(() => detectChanges(), 100);
  }, [blocks, setBlocks, saveToHistory, detectChanges]);

  // Reorder blocks (for drag and drop)
  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, removed);
    
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
    
    // Trigger change detection for auto-save
    setTimeout(() => detectChanges(), 100);
  }, [blocks, setBlocks, saveToHistory, detectChanges]);

  return {
    deleteBlock,
    duplicateBlock,
    updateBlockProperty,
    addBlock,
    reorderBlocks
  };
};