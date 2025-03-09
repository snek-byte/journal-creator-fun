import { useState, useRef, useEffect, useReducer } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon, HistoryEntry, TextBox } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';
import { v4 as uuidv4 } from 'uuid';

// Define initial state
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
  filter: 'none',
  textBoxes: [] as TextBox[]
};

// We use this type for both the state and the history entries
type JournalState = typeof initialState;

// Action types
type Action = 
  | { type: 'SET_STATE'; payload: JournalState }
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'SET_FONT'; payload: string }
  | { type: 'SET_FONT_SIZE'; payload: string }
  | { type: 'SET_FONT_WEIGHT'; payload: string }
  | { type: 'SET_FONT_COLOR'; payload: string }
  | { type: 'SET_GRADIENT'; payload: string }
  | { type: 'SET_MOOD'; payload: Mood | undefined }
  | { type: 'SET_IS_PUBLIC'; payload: boolean }
  | { type: 'SET_TEXT_STYLE'; payload: string }
  | { type: 'SET_STICKERS'; payload: Sticker[] }
  | { type: 'SET_ICONS'; payload: Icon[] }
  | { type: 'SET_TEXT_POSITION'; payload: { x: number, y: number } }
  | { type: 'SET_BACKGROUND_IMAGE'; payload: string }
  | { type: 'SET_DRAWING'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_TEXT_BOXES'; payload: TextBox[] }
  | { type: 'ADD_TEXT_BOX'; payload: TextBox }
  | { type: 'UPDATE_TEXT_BOX'; payload: { id: string, updates: Partial<TextBox> } }
  | { type: 'REMOVE_TEXT_BOX'; payload: string }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

interface EditorState {
  currentState: JournalState;
  history: JournalState[];
  historyIndex: number;
}

// Initialize the editor state
const initialEditorState: EditorState = {
  currentState: { ...initialState },
  history: [],
  historyIndex: -1
};

// Create a deep copy function
const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Editor reducer
function editorReducer(state: EditorState, action: Action): EditorState {
  console.log("REDUCER ACTION:", action.type);
  
  // Helper to add current state to history
  const addToHistory = (currentState: JournalState) => {
    // Get a copy of the current history up to the current index
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    // Add the current state to history
    return [...newHistory, deepCopy(currentState)];
  };
  
  switch (action.type) {
    case 'SET_STATE': {
      return {
        ...state,
        currentState: action.payload,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_TEXT': {
      const newState = {
        ...state.currentState,
        text: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_FONT': {
      const newState = {
        ...state.currentState,
        font: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_FONT_SIZE': {
      const newState = {
        ...state.currentState,
        fontSize: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_FONT_WEIGHT': {
      const newState = {
        ...state.currentState,
        fontWeight: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_FONT_COLOR': {
      const newState = {
        ...state.currentState,
        fontColor: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_GRADIENT': {
      const newState = {
        ...state.currentState,
        gradient: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_MOOD': {
      const newState = {
        ...state.currentState,
        mood: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_IS_PUBLIC': {
      const newState = {
        ...state.currentState,
        isPublic: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_TEXT_STYLE': {
      const newState = {
        ...state.currentState,
        textStyle: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_STICKERS': {
      const newState = {
        ...state.currentState,
        stickers: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_ICONS': {
      const newState = {
        ...state.currentState,
        icons: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_TEXT_POSITION': {
      const newState = {
        ...state.currentState,
        textPosition: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_BACKGROUND_IMAGE': {
      const newState = {
        ...state.currentState,
        backgroundImage: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_DRAWING': {
      const newState = {
        ...state.currentState,
        drawing: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_FILTER': {
      const newState = {
        ...state.currentState,
        filter: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'SET_TEXT_BOXES': {
      const newState = {
        ...state.currentState,
        textBoxes: action.payload
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'ADD_TEXT_BOX': {
      const newState = {
        ...state.currentState,
        textBoxes: [...state.currentState.textBoxes, action.payload]
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'UPDATE_TEXT_BOX': {
      const { id, updates } = action.payload;
      const newState = {
        ...state.currentState,
        textBoxes: state.currentState.textBoxes.map(box => 
          box.id === id ? { ...box, ...updates } : box
        )
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'REMOVE_TEXT_BOX': {
      const newState = {
        ...state.currentState,
        textBoxes: state.currentState.textBoxes.filter(box => box.id !== action.payload)
      };
      
      return {
        ...state,
        currentState: newState,
        history: addToHistory(state.currentState),
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'RESET': {
      console.log("Resetting journal to default");
      const freshState = deepCopy(initialState);
      console.log("Fresh reset state:", freshState);
      
      return {
        currentState: freshState,
        history: [],
        historyIndex: -1
      };
    }
    
    case 'UNDO': {
      console.log("UNDO: historyIndex =", state.historyIndex);
      // Can't undo if we're at the beginning or have no history
      if (state.historyIndex < 0 || state.history.length === 0) {
        console.log("Cannot undo - no history or at beginning");
        return state;
      }
      
      const previousState = state.history[state.historyIndex];
      console.log("UNDO: Previous state =", previousState);
      
      return {
        ...state,
        currentState: deepCopy(previousState),
        historyIndex: state.historyIndex - 1
      };
    }
    
    case 'REDO': {
      console.log("REDO: historyIndex =", state.historyIndex);
      // Can't redo if we're at the end of the history
      if (state.historyIndex >= state.history.length - 1) {
        console.log("Cannot redo - at end of history");
        return state;
      }
      
      const nextState = state.history[state.historyIndex + 1];
      console.log("REDO: Next state =", nextState);
      
      return {
        ...state,
        currentState: deepCopy(nextState),
        historyIndex: state.historyIndex + 1
      };
    }
    
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
    setTextBoxes: setStoreTextBoxes,
    togglePreview,
    saveEntry: storeSaveEntry,
    loadChallenge,
    applyChallenge,
  } = useJournalStore();

  // Initialize state with values from the store
  const initialStateFromStore = {
    ...initialState,
    ...storeEntry,
    textBoxes: storeEntry.textBoxes || []
  };

  // Set up reducer
  const [editorState, dispatch] = useReducer(editorReducer, {
    ...initialEditorState,
    currentState: initialStateFromStore
  });

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Initialize data
  useEffect(() => {
    loadChallenge();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmailAddress(user.email);
      }
    });
  }, []);

  // Sync current state to store
  useEffect(() => {
    syncStateToStore(editorState.currentState);
  }, [editorState.currentState]);

  // Function to sync state to store
  const syncStateToStore = (state: JournalState) => {
    console.log("Syncing state to store:", state);
    setStoreText(state.text);
    setStoreFont(state.font);
    setStoreFontSize(state.fontSize);
    setStoreFontWeight(state.fontWeight);
    setStoreFontColor(state.fontColor);
    setStoreGradient(state.gradient);
    setStoreMood(state.mood);
    setStoreIsPublic(state.isPublic);
    setStoreTextStyle(state.textStyle);
    setStoreStickers(state.stickers);
    setStoreIcons(state.icons);
    setStoreTextPosition(state.textPosition);
    setStoreBackgroundImage(state.backgroundImage);
    setStoreDrawing(state.drawing);
    setStoreFilter(state.filter);
    setStoreTextBoxes(state.textBoxes);
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
  
  const setTextBoxes = (textBoxes: TextBox[]) => {
    dispatch({ type: 'SET_TEXT_BOXES', payload: textBoxes });
  };
  
  const addTextBox = (textBox: TextBox) => {
    dispatch({ type: 'ADD_TEXT_BOX', payload: textBox });
  };
  
  const updateTextBox = (id: string, updates: Partial<TextBox>) => {
    dispatch({ type: 'UPDATE_TEXT_BOX', payload: { id, updates } });
  };
  
  const removeTextBox = (id: string) => {
    dispatch({ type: 'REMOVE_TEXT_BOX', payload: id });
  };

  // Helper functions
  const addSticker = (sticker: Sticker) => {
    if (sticker.id && editorState.currentState.stickers.some(s => s.id === sticker.id)) {
      setStickers(
        editorState.currentState.stickers.map(s => s.id === sticker.id ? sticker : s)
      );
    } else {
      setStickers([...editorState.currentState.stickers, sticker]);
    }
  };

  const addIcon = (icon: Icon) => {
    setIcons([...editorState.currentState.icons, icon]);
  };

  const updateIcon = (iconId: string, updates: Partial<Icon>) => {
    setIcons(
      editorState.currentState.icons.map(icon => 
        icon.id === iconId ? { ...icon, ...updates } : icon
      )
    );
  };

  const removeIcon = (iconId: string) => {
    setIcons(editorState.currentState.icons.filter(i => i.id !== iconId));
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
  
  const handleTextBoxAdd = (textBox: TextBox) => {
    try {
      console.log("Adding text box:", textBox);
      addTextBox(textBox);
    } catch (error) {
      console.error("Error adding text box:", error);
    }
  };
  
  const handleTextBoxUpdate = (id: string, updates: Partial<TextBox>) => {
    try {
      console.log(`Updating text box ${id} with:`, updates);
      updateTextBox(id, updates);
    } catch (error) {
      console.error("Error updating text box:", error);
    }
  };
  
  const handleTextBoxRemove = (id: string) => {
    try {
      console.log("Removing text box with ID:", id);
      removeTextBox(id);
      if (selectedTextBoxId === id) {
        setSelectedTextBoxId(null);
      }
    } catch (error) {
      console.error("Error removing text box:", error);
    }
  };

  const handleStickerMove = (stickerId: string, position: { x: number, y: number }) => {
    try {
      if (position.x < -900 || position.y < -900) {
        console.log("Removing sticker with ID:", stickerId);
        setStickers(
          (editorState.currentState.stickers || []).filter(s => s.id !== stickerId)
        );
      } else {
        setStickers(
          (editorState.currentState.stickers || []).map(s => 
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
        const updatedIcons = (editorState.currentState.icons || []).map(i => 
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
    setSelectedTextBoxId(null);
    console.log("Selected icon ID:", iconId);
  };
  
  const handleTextBoxSelect = (id: string | null) => {
    setSelectedTextBoxId(id);
    setSelectedIconId(null);
    console.log("Selected text box ID:", id);
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
      const text = editorState.currentState.text;
      
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
    } else if (selectedTextBoxId) {
      console.log("Setting font size for text box:", selectedTextBoxId, "to:", size);
      handleTextBoxUpdate(selectedTextBoxId, { fontSize: size });
    } else {
      setFontSize(size);
    }
  };

  const handleFontWeightChange = (weight: string) => {
    if (selectedTextBoxId) {
      console.log("Setting font weight for text box:", selectedTextBoxId, "to:", weight);
      handleTextBoxUpdate(selectedTextBoxId, { fontWeight: weight });
    } else if (!selectedIconId) {
      setFontWeight(weight);
    }
  };

  const handleFontChange = (font: string) => {
    if (selectedTextBoxId) {
      console.log("Setting font for text box:", selectedTextBoxId, "to:", font);
      handleTextBoxUpdate(selectedTextBoxId, { font });
    } else if (!selectedIconId) {
      setFont(font);
    }
  };

  const handleFontColorChange = (color: string) => {
    if (selectedIconId) {
      console.log("Setting color for icon:", selectedIconId, "to:", color);
      handleIconUpdate(selectedIconId, { color });
    } else if (selectedTextBoxId) {
      console.log("Setting font color for text box:", selectedTextBoxId, "to:", color);
      handleTextBoxUpdate(selectedTextBoxId, { fontColor: color });
    } else {
      setFontColor(color);
    }
  };

  const handleGradientChange = (gradient: string) => {
    if (selectedTextBoxId) {
      console.log("Setting gradient for text box:", selectedTextBoxId, "to:", gradient);
      handleTextBoxUpdate(selectedTextBoxId, { gradient });
    } else if (!selectedIconId) {
      console.log("Setting gradient to:", gradient);
      setGradient(gradient);
    }
  };

  const handleTextStyleChange = (style: string) => {
    if (selectedTextBoxId) {
      console.log("Setting text style for text box:", selectedTextBoxId, "to:", style);
      handleTextBoxUpdate(selectedTextBoxId, { textStyle: style });
    } else if (!selectedIconId) {
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

    if (!editorState.currentState.text.trim()) {
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
          text: editorState.currentState.text,
          mood: editorState.currentState.mood,
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

  const handleAddTextBox = () => {
    if (isDrawingMode) return;
    
    const newTextBox: TextBox = {
      id: uuidv4(),
      text: 'Double-click to edit this text box',
      position: { x: 50, y: 15 },
      width: 160,
      height: 80,
      font: editorState.currentState.font,
      fontSize: editorState.currentState.fontSize,
      fontWeight: editorState.currentState.fontWeight,
      fontColor: editorState.currentState.fontColor,
      gradient: editorState.currentState.gradient,
      textStyle: editorState.currentState.textStyle,
      rotation: 0,
      zIndex: editorState.currentState.textBoxes.length + 10
    };
    
    handleTextBoxAdd(newTextBox);
    handleTextBoxSelect(newTextBox.id);
  };

  const handleResetToDefault = () => {
    console.log("Starting reset to default");
    
    // First reset through the reducer
    dispatch({ type: 'RESET' });
    
    // Immediately reset all store values
    setStoreText('');
    setStoreFont('sans-serif');
    setStoreFontSize('16px');
    setStoreFontWeight('normal');
    setStoreFontColor('#000000');
    setStoreGradient('');
    setStoreMood(undefined);
    setStoreIsPublic(false);
    setStoreTextStyle('');
    setStoreStickers([]);
    setStoreIcons([]);
    setStoreTextPosition({ x: 50, y: 50 });
    setStoreBackgroundImage('');
    setStoreDrawing('');
    setStoreFilter('none');
    setStoreTextBoxes([]);
    
    console.log("Reset completed");
  };

  const handleUndo = () => {
    try {
      console.log("Attempting UNDO - History index:", editorState.historyIndex, "History length:", editorState.history.length);
      dispatch({ type: 'UNDO' });
      return true;
    } catch (error) {
      console.error("Error during undo:", error);
      return false;
    }
  };

  const handleRedo = () => {
    try {
      console.log("Attempting REDO - History index:", editorState.historyIndex, "History length:", editorState.history.length);
      dispatch({ type: 'REDO' });
      return true;
    } catch (error) {
      console.error("Error during redo:", error);
      return false;
    }
  };

  const saveEntry = async () => {
    try {
      syncStateToStore(editorState.currentState);
      await storeSaveEntry();
      dispatch({ type: 'RESET' });
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  return {
    currentEntry: editorState.currentState,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    isDraggingText,
    selectedIconId,
    selectedTextBoxId,
    handlePrint,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleIconSelect,
    handleTextBoxAdd,
    handleTextBoxUpdate,
    handleTextBoxRemove,
    handleTextBoxSelect,
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
    canUndo: editorState.historyIndex >= 0,
    canRedo: editorState.historyIndex < editorState.history.length - 1,
  };
}
