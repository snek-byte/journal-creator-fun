
import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { toast } from "sonner";
import { EMPTY_ENTRY } from './constants';

export function useJournalHistory() {
  const {
    currentEntry,
    setText,
    setFont,
    setFontSize,
    setFontWeight, 
    setFontColor,
    setGradient,
    setMood,
    setIsPublic,
    setTextStyle,
    setStickers,
    setIcons,
    setTextPosition,
    setBackgroundImage,
    setDrawing,
    setFilter,
    resetEntry,
  } = useJournalStore();

  // History management
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentHistoryEntry, setCurrentHistoryEntry] = useState<any>(null);
  const isInitialLoad = useRef(true);

  // Monitor entry changes and track history
  useEffect(() => {
    // Skip initial load to avoid recording default state
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Only record history if this is a user action, not a history navigation
    if (currentHistoryEntry !== JSON.stringify(currentEntry)) {
      // Truncate future history if we're not at the end
      const newHistory = history.slice(0, historyIndex + 1);
      // Add current state to history
      newHistory.push(JSON.stringify(currentEntry));
      // Update history state
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      // Update current history marker
      setCurrentHistoryEntry(JSON.stringify(currentEntry));
    }
  }, [
    currentEntry.text, 
    currentEntry.font, 
    currentEntry.fontSize, 
    currentEntry.fontWeight, 
    currentEntry.fontColor, 
    currentEntry.gradient,
    currentEntry.mood,
    currentEntry.isPublic,
    currentEntry.textStyle,
    // Don't include stickers/icons in dependencies to avoid excessive history entries
    // Track position changes separately instead
  ]);
  
  // Track position changes at a lower frequency
  useEffect(() => {
    const positionChangeTimer = setTimeout(() => {
      if (isInitialLoad.current) return;
      
      if (currentHistoryEntry !== JSON.stringify(currentEntry)) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.stringify(currentEntry));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentHistoryEntry(JSON.stringify(currentEntry));
      }
    }, 500);
    
    return () => clearTimeout(positionChangeTimer);
  }, [
    JSON.stringify(currentEntry.stickers), 
    JSON.stringify(currentEntry.icons),
    JSON.stringify(currentEntry.textPosition)
  ]);

  // Helper to apply a history state without recording it
  const applyHistoryState = (state: any) => {
    setText(state.text || '');
    setFont(state.font || 'font-sans');
    setFontSize(state.fontSize || '16px');
    setFontWeight(state.fontWeight || 'normal');
    setFontColor(state.fontColor || '#000000');
    setGradient(state.gradient || 'linear-gradient(135deg, white, #f5f5f5)');
    state.mood && setMood(state.mood);
    setIsPublic(!!state.isPublic);
    setTextStyle(state.textStyle || 'normal');
    setStickers(state.stickers || []);
    setIcons(state.icons || []);
    setTextPosition(state.textPosition || { x: 50, y: 50 });
    setBackgroundImage(state.backgroundImage || '');
    setDrawing(state.drawing || '');
    setFilter(state.filter || 'none');
  };

  // Undo functionality - go back in history
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = JSON.parse(history[newIndex]);
      
      // Apply previous state without recording in history
      applyHistoryState(previousState);
      
      setHistoryIndex(newIndex);
      setCurrentHistoryEntry(history[newIndex]);
    }
  };

  // Redo functionality - go forward in history
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = JSON.parse(history[newIndex]);
      
      // Apply next state without recording in history
      applyHistoryState(nextState);
      
      setHistoryIndex(newIndex);
      setCurrentHistoryEntry(history[newIndex]);
    }
  };

  // Reset functionality - create blank page
  const handleReset = () => {
    // Reset all entry properties to defaults
    resetEntry();
    
    // Add to history
    const newHistory = [...history, JSON.stringify(EMPTY_ENTRY)];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentHistoryEntry(JSON.stringify(EMPTY_ENTRY));
    
    toast.success("Journal reset to a blank page");
  };

  // Computed values for undo/redo availability
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    handleReset
  };
}
