import React, { useCallback, useRef, useState } from 'react';
import { ContentBlock } from '../types/newsletter';

interface UseDragAndDropProps {
  blocks: ContentBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
  saveToHistory: (blocks: ContentBlock[]) => void;
  detectChanges: () => void;
  setSelectedBlock: (blockId: string | null) => void;
}

interface UseDragAndDropReturn {
  draggedBlock: ContentBlock | null;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  selectedBlock: string | null;
  handleDragStart: (block: any) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => void;
  handleMouseDown: (e: React.MouseEvent, blockId: string, canvasRef: React.RefObject<HTMLDivElement>) => void;
  handleMouseMove: (e: MouseEvent, canvasRef: React.RefObject<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  setSelectedBlock: (blockId: string | null) => void;
}

export const useDragAndDrop = ({
  blocks,
  setBlocks,
  saveToHistory,
  detectChanges,
  setSelectedBlock: setSelectedBlockProp
}: UseDragAndDropProps): UseDragAndDropReturn => {
  const [draggedBlock, setDraggedBlock] = useState<ContentBlock | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Sync with parent component
  const setSelectedBlockInternal = useCallback((blockId: string | null) => {
    setSelectedBlock(blockId);
    setSelectedBlockProp(blockId);
  }, [setSelectedBlockProp]);

  // Handle drag start from sidebar
  const handleDragStart = useCallback((block: any) => {
    setDraggedBlock({
      id: Date.now().toString(),
      type: block.type,
      content: block.defaultContent,
      styles: {},
      position: { x: 0, y: 0 }
    });
  }, []);

  // Handle drag over canvas
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle drop on canvas
  const handleDrop = useCallback((e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedBlock || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newBlock = {
      ...draggedBlock,
      position: { x, y }
    };
    
    console.log('🎯 DROP: Adding new block', {
      blockType: newBlock.type,
      blockId: newBlock.id,
      position: newBlock.position,
      currentBlocksCount: blocks.length,
      newBlocksCount: blocks.length + 1
    });
    
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setDraggedBlock(null);
    saveToHistory(newBlocks);
    
    console.log('✅ DROP: Block added successfully', {
      totalBlocks: newBlocks.length,
      allBlockIds: newBlocks.map(b => b.id)
    });
    
    // Trigger change detection for auto-save
    setTimeout(() => detectChanges(), 100);
  }, [draggedBlock, blocks, setBlocks, saveToHistory, detectChanges]);

  // Handle mouse down for repositioning existing blocks
  const handleMouseDown = useCallback((e: React.MouseEvent, blockId: string, canvasRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - block.position.x;
    const offsetY = e.clientY - rect.top - block.position.y;
    
    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
    setSelectedBlockInternal(blockId);
  }, [blocks, setSelectedBlockInternal]);

  // Handle mouse move for repositioning
  const handleMouseMove = useCallback((e: MouseEvent, canvasRef: React.RefObject<HTMLDivElement>) => {
    if (!isDragging || !selectedBlock || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - dragOffset.x);
    const y = Math.max(0, e.clientY - rect.top - dragOffset.y);
    
    setBlocks(prev => prev.map(block => 
      block.id === selectedBlock 
        ? { ...block, position: { x: Math.round(x), y: Math.round(y) } }
        : block
    ));
  }, [isDragging, selectedBlock, dragOffset, setBlocks]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      saveToHistory(blocks);
      
      // Trigger change detection for auto-save
      setTimeout(() => detectChanges(), 100);
    }
  }, [isDragging, blocks, saveToHistory, detectChanges]);

  return {
    draggedBlock,
    isDragging,
    dragOffset,
    selectedBlock,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setSelectedBlock: setSelectedBlockInternal
  };
};