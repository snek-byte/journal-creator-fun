
import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Mood, Sticker, Icon } from '@/types/journal';
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
    loadChallenge,
    applyChallenge,
    resetEntry,
  } = useJournalStore();

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  
  // History management
  const [history, setHistory] = useState<Array<any>>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

  useEffect(() => {
    try {
      loadChallenge();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setEmailAddress(user.email);
        }
      });
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []);

  // Add current state to history when it changes
  useEffect(() => {
    if (isUndoRedoAction) {
      setIsUndoRedoAction(false);
      return;
    }
    
    // Create a snapshot of the current entry state
    const snapshot = JSON.parse(JSON.stringify(currentEntry));
    
    // If we're not at the end of the history, truncate the future states
    if (currentHistoryIndex < history.length - 1) {
      setHistory(prev => prev.slice(0, currentHistoryIndex + 1));
    }
    
    // Add the new state to history
    setHistory(prev => [...prev, snapshot]);
    setCurrentHistoryIndex(prev => prev + 1);
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
      addSticker(sticker);
    } catch (error) {
      console.error("Error adding sticker:", error);
    }
  };

  const handleIconAdd = (icon: Icon) => {
    try {
      addIcon(icon);
      toast.success('Icon added! Drag it to position on your journal.');
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
    setIsDraggingText(true);
  };

  const handleTextDragEnd = () => {
    setIsDraggingText(false);
  };

  const handleTextMove = (position: { x: number, y: number }) => {
    try {
      setTextPosition(position);
      console.log("Text moved to:", position);
    } catch (error) {
      console.error("Error moving text:", error);
    }
  };

  const handleBackgroundSelect = (imageUrl: string) => {
    try {
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
      
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      setText(newText);
      
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
        // Make icon size directly proportional to the font size
        const iconSize = sizeValue * 3; // Make icon 3x the font size
        
        // Update the icon with the new size
        handleIconUpdate(selectedIconId, { size: iconSize });
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
      toast.error("Please enter an email address");
      return;
    }

    if (!currentEntry.text.trim()) {
      toast.error("Please write something in your journal before sending");
      return;
    }

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to send emails");
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

      toast.success("Journal entry sent to your email!");
      setShowEmailDialog(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // New undo, redo, and reset functions
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setIsUndoRedoAction(true);
      const previousState = history[currentHistoryIndex - 1];
      
      // Set each property individually to ensure proper state update
      setText(previousState.text);
      setFont(previousState.font);
      setFontSize(previousState.fontSize);
      setFontWeight(previousState.fontWeight);
      setFontColor(previousState.fontColor);
      setGradient(previousState.gradient);
      setMood(previousState.mood);
      setIsPublic(previousState.isPublic);
      setTextStyle(previousState.textStyle);
      setStickers(previousState.stickers || []);
      setIcons(previousState.icons || []);
      setTextPosition(previousState.textPosition);
      setBackgroundImage(previousState.backgroundImage || '');
      setDrawing(previousState.drawing || '');
      setFilter(previousState.filter || 'none');
      
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      toast.info("Undid last change");
    } else {
      toast.info("Nothing to undo");
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setIsUndoRedoAction(true);
      const nextState = history[currentHistoryIndex + 1];
      
      // Set each property individually to ensure proper state update
      setText(nextState.text);
      setFont(nextState.font);
      setFontSize(nextState.fontSize);
      setFontWeight(nextState.fontWeight);
      setFontColor(nextState.fontColor);
      setGradient(nextState.gradient);
      setMood(nextState.mood);
      setIsPublic(nextState.isPublic);
      setTextStyle(nextState.textStyle);
      setStickers(nextState.stickers || []);
      setIcons(nextState.icons || []);
      setTextPosition(nextState.textPosition);
      setBackgroundImage(nextState.backgroundImage || '');
      setDrawing(nextState.drawing || '');
      setFilter(nextState.filter || 'none');
      
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      toast.info("Redid last change");
    } else {
      toast.info("Nothing to redo");
    }
  };

  const handleResetToDefault = () => {
    resetEntry();
    // Reset history
    const defaultState = JSON.parse(JSON.stringify(currentEntry));
    setHistory([defaultState]);
    setCurrentHistoryIndex(0);
    toast.success("Reset to default settings");
  };

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
    // New undo/redo functions
    handleUndo,
    handleRedo,
    handleResetToDefault,
    // History status for UI
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1,
  };
}
