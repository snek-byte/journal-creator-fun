
import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon, HistoryEntry } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';

export function useJournalEditor() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
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
    addSticker,
    addIcon,
    updateIcon,
    removeIcon,
    togglePreview,
    saveEntry,
    loadEntries,
    loadProgress,
    loadChallenge,
    applyChallenge,
  } = useJournalStore();

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  
  // Enhanced history management with more capacity
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const maxHistorySize = 20; // Store 20 history entries (more than 10 for undo/redo)

  useEffect(() => {
    try {
      loadChallenge();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setEmailAddress(user.email);
        }
      });
      
      // Initialize history with current state
      const initialState = createHistorySnapshot(currentEntry);
      setHistory([initialState]);
      setCurrentHistoryIndex(0);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []);

  // Function to create a history snapshot
  const createHistorySnapshot = (entry: typeof currentEntry): HistoryEntry => {
    return JSON.parse(JSON.stringify(entry));
  };

  // Add current state to history when it changes
  useEffect(() => {
    if (isUndoRedoAction) {
      setIsUndoRedoAction(false);
      return;
    }
    
    // Create a snapshot of the current entry state
    const snapshot = createHistorySnapshot(currentEntry);
    
    // If we're not at the end of the history, truncate the future states
    if (currentHistoryIndex < history.length - 1) {
      setHistory(prev => prev.slice(0, currentHistoryIndex + 1));
    }
    
    // Add the new state to history
    setHistory(prev => {
      const newHistory = [...prev, snapshot];
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        return newHistory.slice(newHistory.length - maxHistorySize);
      }
      return newHistory;
    });
    
    setCurrentHistoryIndex(prev => {
      if (prev + 1 >= maxHistorySize) {
        return maxHistorySize - 1;
      }
      return prev + 1;
    });
  }, [
    currentEntry.text,
    currentEntry.font,
    currentEntry.fontSize,
    currentEntry.fontWeight,
    currentEntry.fontColor,
    currentEntry.gradient,
    currentEntry.mood,
    currentEntry.textStyle,
    currentEntry.stickers,
    currentEntry.icons,
    currentEntry.textPosition,
    currentEntry.backgroundImage,
    currentEntry.drawing,
    currentEntry.filter,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleStickerAdd = (sticker: Sticker) => {
    try {
      console.log("Adding sticker to journal:", sticker);
      
      // If this is an existing sticker (has a matching ID), treat it as an update
      if (sticker.id && currentEntry.stickers.some(s => s.id === sticker.id)) {
        const updatedStickers = currentEntry.stickers.map(s => 
          s.id === sticker.id ? sticker : s
        );
        setStickers(updatedStickers);
      } else {
        // Otherwise add as a new sticker
        addSticker(sticker);
      }
    } catch (error) {
      console.error("Error adding/updating sticker:", error);
    }
  };

  const handleIconAdd = (icon: Icon) => {
    try {
      addIcon(icon);
    } catch (error) {
      console.error("Error adding icon:", error);
    }
  };

  const handleStickerMove = (stickerId: string, position: { x: number, y: number }) => {
    try {
      // If position is off-screen, it's a deletion
      if (position.x < -900 || position.y < -900) {
        console.log("Removing sticker with ID:", stickerId);
        setStickers(
          (currentEntry.stickers || []).filter(s => s.id !== stickerId)
        );
      } else {
        setStickers(
          (currentEntry.stickers || []).map(s => 
            s.id === stickerId ? { ...s, position } : s
          )
        );
      }
    } catch (error) {
      console.error("Error moving sticker:", error);
    }
  };

  const handleIconMove = (iconId: string, position: { x: number, y: number }) => {
    try {
      // If position is off-screen, it's a deletion
      if (position.x < -900 || position.y < -900) {
        console.log("Removing icon with ID:", iconId);
        removeIcon(iconId);
        setSelectedIconId(null);
      } else {
        setIcons(
          (currentEntry.icons || []).map(i => 
            i.id === iconId ? { ...i, position } : i
          )
        );
      }
    } catch (error) {
      console.error("Error moving/removing icon:", error);
    }
  };

  const handleIconUpdate = (iconId: string, updates: Partial<Icon>) => {
    try {
      console.log(`Updating icon ${iconId} with:`, updates);
      updateIcon(iconId, updates);
    } catch (error) {
      console.error("Error updating icon:", error);
    }
  };

  const handleIconSelect = (iconId: string | null) => {
    setSelectedIconId(iconId);
    console.log("Selected icon ID:", iconId);
  };

  const handleTextDragStart = () => {
    console.log("Text drag started");
    setIsDraggingText(true);
  };

  const handleTextDragEnd = () => {
    console.log("Text drag ended");
    setIsDraggingText(false);
  };

  const handleTextMove = (position: { x: number, y: number }) => {
    try {
      console.log("Moving text to:", position);
      setTextPosition(position);
    } catch (error) {
      console.error("Error moving text:", error);
    }
  };

  const handleBackgroundSelect = (imageUrl: string) => {
    try {
      console.log("Setting background image to:", imageUrl);
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error("Error selecting background:", error);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    try {
      setDrawing(dataUrl);
    } catch (error) {
      console.error("Error updating drawing:", error);
    }
  };

  const handleFilterChange = (filterId: string) => {
    try {
      setFilter(filterId);
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    try {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = currentEntry.text;
      
      // Use the actual emoji character, not a unicode reference
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      setText(newText);
      
      // Restore cursor position after emoji insertion
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + emojiData.emoji.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    } catch (error) {
      console.error("Error selecting emoji:", error);
    }
  };

  // Handler for font size that adjusts icon size when needed
  const handleFontSizeChange = (size: string) => {
    if (selectedIconId) {
      console.log("Setting size for icon:", selectedIconId, "to:", size);
      // Get the numeric value from the font size
      const sizeValue = parseInt(size);
      if (!isNaN(sizeValue)) {
        // Update the icon with the new size
        handleIconUpdate(selectedIconId, { size: sizeValue });
      }
    } else {
      // Normal text size change
      setFontSize(size);
    }
  };

  const handleFontWeightChange = (weight: string) => {
    if (!selectedIconId) {
      setFontWeight(weight);
    }
  };

  const handleFontChange = (font: string) => {
    if (!selectedIconId) {
      setFont(font);
    }
  };

  const handleFontColorChange = (color: string) => {
    if (selectedIconId) {
      // If an icon is selected, update its color directly
      console.log("Setting color for icon:", selectedIconId, "to:", color);
      handleIconUpdate(selectedIconId, { color });
    } else {
      setFontColor(color);
    }
  };

  const handleGradientChange = (gradient: string) => {
    if (!selectedIconId) {
      console.log("Setting gradient to:", gradient);
      setGradient(gradient);
    }
  }

  const handleTextStyleChange = (style: string) => {
    if (!selectedIconId) {
      setTextStyle(style);
    }
  }

  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload an image file'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read image'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      return;
    }

    if (!currentEntry.text.trim()) {
      return;
    }

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const response = await supabase.functions.invoke('send-journal', {
        body: {
          to: emailAddress,
          text: currentEntry.text,
          mood: currentEntry.mood,
          date: new Date().toISOString(),
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setShowEmailDialog(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Create a resetEntry function since it doesn't exist in the store
  const handleResetToDefault = () => {
    // Reset all values to defaults
    setText('');
    setFont('sans-serif');
    setFontSize('16px');
    setFontWeight('normal');
    setFontColor('#000000');
    setGradient('');
    setMood(undefined);
    setIsPublic(false);
    setTextStyle('');
    setStickers([]);
    setIcons([]);
    setTextPosition({ x: 50, y: 50 });
    setBackgroundImage('');
    setDrawing('');
    setFilter('none');
    
    // Reset history
    const defaultState = createHistorySnapshot(currentEntry);
    setHistory([defaultState]);
    setCurrentHistoryIndex(0);
  };

  // Apply a history state to the current entry
  const applyHistoryState = (state: HistoryEntry) => {
    setText(state.text);
    setFont(state.font);
    setFontSize(state.fontSize);
    setFontWeight(state.fontWeight);
    setFontColor(state.fontColor);
    setGradient(state.gradient);
    setMood(state.mood);
    setIsPublic(state.isPublic);
    setTextStyle(state.textStyle);
    setStickers(state.stickers || []);
    setIcons(state.icons || []);
    setTextPosition(state.textPosition);
    setBackgroundImage(state.backgroundImage || '');
    setDrawing(state.drawing || '');
    setFilter(state.filter || 'none');
  };

  // Enhanced undo function
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      console.log(`Undoing action - going from ${currentHistoryIndex} to ${currentHistoryIndex - 1}`);
      setIsUndoRedoAction(true);
      const previousState = history[currentHistoryIndex - 1];
      applyHistoryState(previousState);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    } else {
      console.log("Nothing to undo");
    }
  };

  // Enhanced redo function
  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      console.log(`Redoing action - going from ${currentHistoryIndex} to ${currentHistoryIndex + 1}`);
      setIsUndoRedoAction(true);
      const nextState = history[currentHistoryIndex + 1];
      applyHistoryState(nextState);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    } else {
      console.log("Nothing to redo");
    }
  };

  // Debug history in development
  useEffect(() => {
    console.log(`Current history index: ${currentHistoryIndex} of ${history.length - 1}`);
  }, [currentHistoryIndex, history.length]);

  return {
    currentEntry,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    isDraggingText,
    selectedIconId,
    handlePrint,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleIconSelect,
    handleTextMove,
    handleTextDragStart,
    handleTextDragEnd,
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleEmojiSelect,
    handleSendEmail,
    handleImageUpload,
    handleFontSizeChange,
    handleFontWeightChange,
    handleFontChange,
    handleFontColorChange,
    handleGradientChange,
    handleTextStyleChange,
    setShowEmailDialog,
    setEmailAddress,
    setMood,
    setIsPublic,
    setText,
    togglePreview,
    saveEntry,
    applyChallenge,
    loadChallenge,
    // Enhanced undo/redo functions
    handleUndo,
    handleRedo,
    handleResetToDefault,
    // History status for UI
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1,
  };
}
