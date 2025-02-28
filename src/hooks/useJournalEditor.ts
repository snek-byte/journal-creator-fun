
import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Mood, Sticker, Icon } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';

const EMPTY_ENTRY = {
  text: '',
  font: 'font-sans',
  fontSize: '16px',
  fontWeight: 'normal',
  fontColor: '#000000',
  gradient: 'linear-gradient(135deg, white, #f5f5f5)',
  isPublic: false,
  stickers: [],
  icons: [],
  textPosition: { x: 50, y: 50 },
  backgroundImage: '',
  drawing: '',
  filter: 'none',
  textStyle: 'normal',
};

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

  // Computed values for undo/redo availability
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
    canUndo,
    canRedo,
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
    handleUndo,
    handleRedo,
    handleReset,
    setShowEmailDialog,
    setEmailAddress,
    setMood,
    setIsPublic,
    setText,
    togglePreview,
    saveEntry,
    applyChallenge,
    loadChallenge
  };
}
