
import { useState, useRef, useEffect, useReducer } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';
import { toast } from "sonner";

// Define actions for our reducer
type Action = 
  | { type: 'UPDATE_ENTRY', payload: Partial<typeof initialState> }
  | { type: 'SET_TEXT', payload: string }
  | { type: 'SET_FONT', payload: string }
  | { type: 'SET_FONT_SIZE', payload: string }
  | { type: 'SET_FONT_WEIGHT', payload: string }
  | { type: 'SET_FONT_COLOR', payload: string }
  | { type: 'SET_GRADIENT', payload: string }
  | { type: 'SET_MOOD', payload: Mood | undefined }
  | { type: 'SET_IS_PUBLIC', payload: boolean }
  | { type: 'SET_TEXT_STYLE', payload: string }
  | { type: 'SET_STICKERS', payload: Sticker[] }
  | { type: 'SET_ICONS', payload: Icon[] }
  | { type: 'SET_TEXT_POSITION', payload: { x: number, y: number } }
  | { type: 'SET_BACKGROUND_IMAGE', payload: string }
  | { type: 'SET_DRAWING', payload: string }
  | { type: 'SET_FILTER', payload: string }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Our initial state
const initialState = {
  text: '',
  font: 'sans-serif',
  fontSize: '16px',
  fontWeight: 'normal',
  fontColor: '#000000',
  gradient: '',
  mood: undefined as Mood | undefined,
  isPublic: false,
  textStyle: '',
  stickers: [] as Sticker[],
  icons: [] as Icon[],
  textPosition: { x: 50, y: 50 },
  backgroundImage: '',
  drawing: '',
  filter: 'none'
};

// History state type
type HistoryState = {
  past: typeof initialState[];
  present: typeof initialState;
  future: typeof initialState[];
};

// Our reducer function
function historyReducer(state: HistoryState, action: Action): HistoryState {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UPDATE_ENTRY':
      return {
        past: [...past, present],
        present: { ...present, ...action.payload },
        future: []
      };
    case 'SET_TEXT':
      return {
        past: [...past, present],
        present: { ...present, text: action.payload },
        future: []
      };
    case 'SET_FONT':
      return {
        past: [...past, present],
        present: { ...present, font: action.payload },
        future: []
      };
    case 'SET_FONT_SIZE':
      return {
        past: [...past, present],
        present: { ...present, fontSize: action.payload },
        future: []
      };
    case 'SET_FONT_WEIGHT':
      return {
        past: [...past, present],
        present: { ...present, fontWeight: action.payload },
        future: []
      };
    case 'SET_FONT_COLOR':
      return {
        past: [...past, present],
        present: { ...present, fontColor: action.payload },
        future: []
      };
    case 'SET_GRADIENT':
      return {
        past: [...past, present],
        present: { ...present, gradient: action.payload },
        future: []
      };
    case 'SET_MOOD':
      return {
        past: [...past, present],
        present: { ...present, mood: action.payload },
        future: []
      };
    case 'SET_IS_PUBLIC':
      return {
        past: [...past, present],
        present: { ...present, isPublic: action.payload },
        future: []
      };
    case 'SET_TEXT_STYLE':
      return {
        past: [...past, present],
        present: { ...present, textStyle: action.payload },
        future: []
      };
    case 'SET_STICKERS':
      return {
        past: [...past, present],
        present: { ...present, stickers: action.payload },
        future: []
      };
    case 'SET_ICONS':
      return {
        past: [...past, present],
        present: { ...present, icons: action.payload },
        future: []
      };
    case 'SET_TEXT_POSITION':
      return {
        past: [...past, present],
        present: { ...present, textPosition: action.payload },
        future: []
      };
    case 'SET_BACKGROUND_IMAGE':
      return {
        past: [...past, present],
        present: { ...present, backgroundImage: action.payload },
        future: []
      };
    case 'SET_DRAWING':
      return {
        past: [...past, present],
        present: { ...present, drawing: action.payload },
        future: []
      };
    case 'SET_FILTER':
      return {
        past: [...past, present],
        present: { ...present, filter: action.payload },
        future: []
      };
    case 'RESET':
      return {
        past: [],
        present: initialState,
        future: []
      };
    case 'UNDO':
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      return {
        past: past.slice(0, past.length - 1),
        present: previous,
        future: [present, ...future]
      };
    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      return {
        past: [...past, present],
        present: next,
        future: future.slice(1)
      };
    default:
      return state;
  }
}

// Main hook
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

  // Initialize history reducer with store's initial state
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: { ...initialState, ...storeEntry },
    future: []
  });

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  
  // Initialize data
  useEffect(() => {
    loadChallenge();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmailAddress(user.email);
      }
    });
  }, []);

  // Sync reducer state to store
  useEffect(() => {
    syncStateToStore(state.present);
  }, [state.present]);

  // Function to sync our state to the store
  const syncStateToStore = (entry: typeof initialState) => {
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

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Entry update functions using dispatch
  const setText = (text: string) => {
    dispatch({ type: 'SET_TEXT', payload: text });
  };

  const setFont = (font: string) => {
    dispatch({ type: 'SET_FONT', payload: font });
  };

  const setFontSize = (fontSize: string) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: fontSize });
  };

  const setFontWeight = (fontWeight: string) => {
    dispatch({ type: 'SET_FONT_WEIGHT', payload: fontWeight });
  };

  const setFontColor = (fontColor: string) => {
    dispatch({ type: 'SET_FONT_COLOR', payload: fontColor });
  };

  const setGradient = (gradient: string) => {
    dispatch({ type: 'SET_GRADIENT', payload: gradient });
  };

  const setMood = (mood: Mood) => {
    dispatch({ type: 'SET_MOOD', payload: mood });
  };

  const setIsPublic = (isPublic: boolean) => {
    dispatch({ type: 'SET_IS_PUBLIC', payload: isPublic });
  };

  const setTextStyle = (textStyle: string) => {
    dispatch({ type: 'SET_TEXT_STYLE', payload: textStyle });
  };

  const setStickers = (stickers: Sticker[]) => {
    dispatch({ type: 'SET_STICKERS', payload: stickers });
  };

  const setIcons = (icons: Icon[]) => {
    dispatch({ type: 'SET_ICONS', payload: icons });
  };

  const setTextPosition = (textPosition: { x: number, y: number }) => {
    dispatch({ type: 'SET_TEXT_POSITION', payload: textPosition });
  };

  const setBackgroundImage = (backgroundImage: string) => {
    dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: backgroundImage });
  };

  const setDrawing = (drawing: string) => {
    dispatch({ type: 'SET_DRAWING', payload: drawing });
  };

  const setFilter = (filter: string) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // Helper functions
  const addSticker = (sticker: Sticker) => {
    if (sticker.id && state.present.stickers.some(s => s.id === sticker.id)) {
      setStickers(
        state.present.stickers.map(s => s.id === sticker.id ? sticker : s)
      );
    } else {
      setStickers([...state.present.stickers, sticker]);
    }
  };

  const addIcon = (icon: Icon) => {
    setIcons([...state.present.icons, icon]);
  };

  const updateIcon = (iconId: string, updates: Partial<Icon>) => {
    setIcons(
      state.present.icons.map(icon => 
        icon.id === iconId ? { ...icon, ...updates } : icon
      )
    );
  };

  const removeIcon = (iconId: string) => {
    setIcons(state.present.icons.filter(i => i.id !== iconId));
  };

  // Handler functions
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
          (state.present.stickers || []).filter(s => s.id !== stickerId)
        );
      } else {
        setStickers(
          (state.present.stickers || []).map(s => 
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
        const updatedIcons = (state.present.icons || []).map(i => 
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
      const text = state.present.text;
      
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

  // Handler for font size that adjusts icon size when needed
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

    if (!state.present.text.trim()) {
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
          text: state.present.text,
          mood: state.present.mood,
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

  // Reset function
  const handleResetToDefault = () => {
    dispatch({ type: 'RESET' });
    toast.success("Journal reset to default");
  };

  // Undo function
  const handleUndo = () => {
    try {
      dispatch({ type: 'UNDO' });
      console.log("Performing UNDO - Past length:", state.past.length);
      return true;
    } catch (error) {
      console.error("Error during undo:", error);
      return false;
    }
  };

  // Redo function
  const handleRedo = () => {
    try {
      dispatch({ type: 'REDO' });
      console.log("Performing REDO - Future length:", state.future.length);
      return true;
    } catch (error) {
      console.error("Error during redo:", error);
      return false;
    }
  };

  // Save function
  const saveEntry = async () => {
    try {
      syncStateToStore(state.present);
      await storeSaveEntry();
      dispatch({ type: 'RESET' });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry");
    }
  };

  return {
    currentEntry: state.present,
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
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
