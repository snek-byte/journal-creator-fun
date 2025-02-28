import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';
import { toast } from "sonner";
import { useUndoRedoState } from './useUndoRedoState';

export function useJournalEditor() {
  const {
    currentEntry: storeEntry,
    showPreview,
    dailyChallenge,
    setText: setStoreText,
    setFont: setStoreFont,
    setFontSize: setStoreFontSize,
    setFontWeight: setStoreFontWeight,
    setFontColor: setStoreFontColor,
    setGradient: setStoreGradient,
    setMood: setStoreMood,
    setIsPublic: setStoreIsPublic,
    setTextStyle: setStoreTextStyle,
    setStickers: setStoreStickers,
    setIcons: setStoreIcons,
    setTextPosition: setStoreTextPosition,
    setBackgroundImage: setStoreBackgroundImage,
    setDrawing: setStoreDrawing,
    setFilter: setStoreFilter,
    addSticker: storeAddSticker,
    addIcon: storeAddIcon,
    updateIcon: storeUpdateIcon,
    removeIcon: storeRemoveIcon,
    togglePreview,
    saveEntry: storeSaveEntry,
    loadChallenge,
    applyChallenge,
  } = useJournalStore();

  const {
    state: currentEntry,
    setState: setCurrentEntry,
    undo: handleUndo,
    redo: handleRedo,
    resetHistory,
    canUndo,
    canRedo
  } = useUndoRedoState(storeEntry);

  useEffect(() => {
    syncStateToStore(currentEntry);
  }, [currentEntry]);
  
  const syncStateToStore = (entry: typeof storeEntry) => {
    setStoreText(entry.text);
    setStoreFont(entry.font);
    setStoreFontSize(entry.fontSize);
    setStoreFontWeight(entry.fontWeight);
    setStoreFontColor(entry.fontColor);
    setStoreGradient(entry.gradient);
    setStoreMood(entry.mood);
    setStoreIsPublic(entry.isPublic);
    setStoreTextStyle(entry.textStyle);
    setStoreStickers(entry.stickers);
    setStoreIcons(entry.icons);
    setStoreTextPosition(entry.textPosition);
    setStoreBackgroundImage(entry.backgroundImage);
    setStoreDrawing(entry.drawing);
    setStoreFilter(entry.filter);
  };

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  useEffect(() => {
    loadChallenge();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmailAddress(user.email);
      }
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const setText = (text: string) => {
    setCurrentEntry({ ...currentEntry, text });
  };

  const setFont = (font: string) => {
    setCurrentEntry({ ...currentEntry, font });
  };

  const setFontSize = (fontSize: string) => {
    setCurrentEntry({ ...currentEntry, fontSize });
  };

  const setFontWeight = (fontWeight: string) => {
    setCurrentEntry({ ...currentEntry, fontWeight });
  };

  const setFontColor = (fontColor: string) => {
    setCurrentEntry({ ...currentEntry, fontColor });
  };

  const setGradient = (gradient: string) => {
    setCurrentEntry({ ...currentEntry, gradient });
  };

  const setMood = (mood: Mood) => {
    setCurrentEntry({ ...currentEntry, mood });
  };

  const setIsPublic = (isPublic: boolean) => {
    setCurrentEntry({ ...currentEntry, isPublic });
  };

  const setTextStyle = (textStyle: string) => {
    setCurrentEntry({ ...currentEntry, textStyle });
  };

  const setStickers = (stickers: Sticker[]) => {
    setCurrentEntry({ ...currentEntry, stickers });
  };

  const setIcons = (icons: Icon[]) => {
    setCurrentEntry({ ...currentEntry, icons });
  };

  const setTextPosition = (textPosition: { x: number, y: number }) => {
    setCurrentEntry({ ...currentEntry, textPosition });
  };

  const setBackgroundImage = (backgroundImage: string) => {
    setCurrentEntry({ ...currentEntry, backgroundImage });
  };

  const setDrawing = (drawing: string) => {
    setCurrentEntry({ ...currentEntry, drawing });
  };

  const setFilter = (filter: string) => {
    setCurrentEntry({ ...currentEntry, filter });
  };

  const addSticker = (sticker: Sticker) => {
    if (sticker.id && currentEntry.stickers.some(s => s.id === sticker.id)) {
      setStickers(
        currentEntry.stickers.map(s => s.id === sticker.id ? sticker : s)
      );
    } else {
      setStickers([...currentEntry.stickers, sticker]);
    }
  };

  const addIcon = (icon: Icon) => {
    setIcons([...currentEntry.icons, icon]);
  };

  const updateIcon = (iconId: string, updates: Partial<Icon>) => {
    setIcons(
      currentEntry.icons.map(icon => 
        icon.id === iconId ? { ...icon, ...updates } : icon
      )
    );
  };

  const removeIcon = (iconId: string) => {
    setIcons(currentEntry.icons.filter(i => i.id !== iconId));
  };

  const handleStickerAdd = (sticker: Sticker) => {
    try {
      console.log("Adding sticker to journal:", sticker);
      addSticker(sticker);
    } catch (error) {
      console.error("Error adding/updating sticker:", error);
    }
  };

  const handleIconAdd = (icon: Icon) => {
    try {
      console.log("Adding icon with ID:", icon.id, "and URL:", icon.url);
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
      if (position.x < -900 || position.y < -900) {
        console.log("Removing icon with ID:", iconId);
        removeIcon(iconId);
        setSelectedIconId(null);
      } else {
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

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = currentEntry.text;
      
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      
      setText(newText);
      
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

  const handleFontSizeChange = (size: string) => {
    if (selectedIconId) {
      console.log("Setting size for icon:", selectedIconId, "to:", size);
      const sizeValue = parseInt(size);
      if (!isNaN(sizeValue)) {
        handleIconUpdate(selectedIconId, { size: sizeValue });
      }
    } else {
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

  const handleResetToDefault = () => {
    const defaultState = {
      text: '',
      font: 'sans-serif',
      fontSize: '16px',
      fontWeight: 'normal',
      fontColor: '#000000',
      gradient: '',
      mood: undefined,
      isPublic: false,
      textStyle: '',
      stickers: [],
      icons: [],
      textPosition: { x: 50, y: 50 },
      backgroundImage: '',
      drawing: '',
      filter: 'none'
    };
    
    syncStateToStore(defaultState);
    
    resetHistory(defaultState);
    
    toast.success("Journal reset to default");
  };

  const saveEntry = async () => {
    try {
      syncStateToStore(currentEntry);
      
      await storeSaveEntry();
      
      const newDefaultState = {
        text: '',
        font: 'sans-serif',
        fontSize: '16px',
        fontWeight: 'normal',
        fontColor: '#000000',
        gradient: '',
        mood: undefined,
        isPublic: false,
        textStyle: '',
        stickers: [],
        icons: [],
        textPosition: { x: 50, y: 50 },
        backgroundImage: '',
        drawing: '',
        filter: 'none'
      };
      
      resetHistory(newDefaultState);
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry");
    }
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
    handleUndo,
    handleRedo,
    handleResetToDefault,
    canUndo,
    canRedo,
  };
}
