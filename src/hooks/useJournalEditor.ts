
import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon, HistoryEntry } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';
import { toast } from "sonner";

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
  const maxHistorySize = 30; // Increased from 20 to 30 for more history capacity
  
  // Skip history tracking during initial loading
  const skipHistoryTracking = useRef(true);

  // Function to create a history snapshot
  const createHistorySnapshot = (entry: typeof currentEntry): HistoryEntry => {
    return JSON.parse(JSON.stringify(entry));
  };

  // Initialize history on component mount
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
      
      // Allow history tracking after initial load
      setTimeout(() => {
        skipHistoryTracking.current = false;
        console.log("History tracking enabled");
      }, 500);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []);

  // Add current state to history when it changes
  useEffect(() => {
    // Skip history tracking during initial load or undo/redo operations
    if (skipHistoryTracking.current || isUndoRedoAction) {
      if (isUndoRedoAction) {
        setIsUndoRedoAction(false);
      }
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
      // Check if the new state is deeply equal to the previous state
      const lastSnapshot = prev[prev.length - 1];
      if (lastSnapshot && JSON.stringify(lastSnapshot) === JSON.stringify(snapshot)) {
        console.log("Skipping identical state in history");
        return prev; // Skip adding identical states
      }
      
      const newHistory = [...prev, snapshot];
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        return newHistory.slice(newHistory.length - maxHistorySize);
      }
      return newHistory;
    });
    
    setCurrentHistoryIndex(prev => {
      // Adjust index based on history length and max size
      const nextIndex = prev + 1;
      if (nextIndex >= maxHistorySize) {
        return maxHistorySize - 1;
      }
      return nextIndex;
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
      console.log("Adding icon with ID:", icon.id, "and URL:", icon.url);
      // First, make sure we're working with a complete icon object
      const completeIcon: Icon = {
        id: icon.id,
        url: icon.url,
        position: icon.position || { x: 50, y: 50 },
        size: icon.size || 48,
        color: icon.color || '#000000',
        style: icon.style || 'outline'
      };
      
      addIcon(completeIcon);
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
      console.log("Moving icon:", iconId, "to position:", position);
      // If position is off-screen, it's a deletion
      if (position.x < -900 || position.y < -900) {
        console.log("Removing icon with ID:", iconId);
        removeIcon(iconId);
        setSelectedIconId(null);
      } else {
        // Create updated icons array with the new position
        const updatedIcons = (currentEntry.icons || []).map(i => 
          i.id === iconId ? { ...i, position } : i
        );
        
        console.log("Updated icons:", updatedIcons);
        setIcons(updatedIcons);
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

      // Store current cursor position
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = currentEntry.text;
      
      // Insert the emoji character directly
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      
      // Update text with the emoji
      setText(newText);
      
      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = start + emojiData.emoji.length;
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
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
  };

  const handleTextStyleChange = (style: string) => {
    if (!selectedIconId) {
      setTextStyle(style);
    }
  };

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

  // Apply a history state to the current entry
  const applyHistoryState = (state: HistoryEntry) => {
    if (!state) {
      console.error("Cannot apply undefined state to journal");
      return;
    }
    
    console.log("Applying history state:", state);
    
    setText(state.text || '');
    setFont(state.font || 'sans-serif');
    setFontSize(state.fontSize || '16px');
    setFontWeight(state.fontWeight || 'normal');
    setFontColor(state.fontColor || '#000000');
    setGradient(state.gradient || '');
    setMood(state.mood);
    setIsPublic(state.isPublic || false);
    setTextStyle(state.textStyle || '');
    setStickers(state.stickers || []);
    setIcons(state.icons || []);
    setTextPosition(state.textPosition || { x: 50, y: 50 });
    setBackgroundImage(state.backgroundImage || '');
    setDrawing(state.drawing || '');
    setFilter(state.filter || 'none');
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
    
    toast.success("Journal reset to default");
  };

  // Completely rewritten undo function for simplicity and reliability
  const handleUndo = () => {
    if (currentHistoryIndex > 0 && history.length > 1) {
      try {
        console.log(`Undoing action - going from ${currentHistoryIndex} to ${currentHistoryIndex - 1}`);
        
        // Get previous state
        const previousState = history[currentHistoryIndex - 1];
        
        if (!previousState) {
          console.error("Previous state not found in history");
          toast.error("Could not undo - history state not found");
          return;
        }
        
        // Set flag to prevent recording this change as a new history entry
        setIsUndoRedoAction(true);
        
        // Apply the previous state
        applyHistoryState(previousState);
        
        // Update the history index
        setCurrentHistoryIndex(currentHistoryIndex - 1);
        
        toast.success("Action undone");
      } catch (error) {
        console.error("Error during undo operation:", error);
        toast.error("Failed to undo");
      }
    } else {
      console.log("Nothing to undo - at beginning of history");
      toast.info("Nothing to undo");
    }
  };

  // Completely rewritten redo function for simplicity and reliability
  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      try {
        console.log(`Redoing action - going from ${currentHistoryIndex} to ${currentHistoryIndex + 1}`);
        
        // Get next state
        const nextState = history[currentHistoryIndex + 1];
        
        if (!nextState) {
          console.error("Next state not found in history");
          toast.error("Could not redo - history state not found");
          return;
        }
        
        // Set flag to prevent recording this change as a new history entry
        setIsUndoRedoAction(true);
        
        // Apply the next state
        applyHistoryState(nextState);
        
        // Update the history index
        setCurrentHistoryIndex(currentHistoryIndex + 1);
        
        toast.success("Action redone");
      } catch (error) {
        console.error("Error during redo operation:", error);
        toast.error("Failed to redo");
      }
    } else {
      console.log("Nothing to redo - at end of history");
      toast.info("Nothing to redo");
    }
  };

  // Debug history in development
  useEffect(() => {
    console.log(`Current history index: ${currentHistoryIndex} of ${history.length - 1}`);
    console.log(`History entries: ${history.length}`);
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
