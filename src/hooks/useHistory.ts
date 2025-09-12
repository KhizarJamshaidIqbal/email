import { useState, useCallback } from 'react';
import { ContentBlock } from '../types/newsletter';

interface UseHistoryReturn {
  history: ContentBlock[][];
  historyIndex: number;
  saveToHistory: (blocks: ContentBlock[]) => void;
  undo: () => ContentBlock[] | null;
  redo: () => ContentBlock[] | null;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

export const useHistory = (initialBlocks: ContentBlock[] = []): UseHistoryReturn => {
  const [history, setHistory] = useState<ContentBlock[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Save current state to history
  const saveToHistory = useCallback((blocks: ContentBlock[]) => {
    setHistory(prevHistory => {
      // Remove any future history if we're not at the end
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      
      // Add new state
      newHistory.push([...blocks]);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        setHistoryIndex(prev => Math.max(0, prev - 1));
        return newHistory;
      }
      
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  // Undo operation
  const undo = useCallback((): ContentBlock[] | null => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return [...history[newIndex]];
    }
    return null;
  }, [history, historyIndex]);

  // Redo operation
  const redo = useCallback((): ContentBlock[] | null => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return [...history[newIndex]];
    }
    return null;
  }, [history, historyIndex]);

  // Check if undo is possible
  const canUndo = historyIndex > 0;

  // Check if redo is possible
  const canRedo = historyIndex < history.length - 1;

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(0);
  }, []);

  return {
    history,
    historyIndex,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  };
};