import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { toast } from 'sonner';
import { useUndoRedoState } from './useUndoRedoState';
import type { Sticker, Icon, TextBox, HistoryEntry, AudioTrack } from '@/types/journal';
import type { EmojiClickData } from 'emoji-picker-react';
import { supabase } from "@/integrations/supabase/client";
import { useTextBoxPosition } from './useTextBoxPosition';
import { useScreenshot } from 'use-react-screenshot';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function useJournalEditor() {
  const [emailAddress, setEmailAddress] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    currentEntry,
    entries,
    dailyChallenge,
    showPreview,
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
    removeSticker,
    addIcon,
    removeIcon,
    updateIcon,
    togglePreview,
    saveEntry,
    loadEntries,
    loadProgress,
    loadChallenge,
    applyChallenge,
    setTextBoxes,
    addTextBox,
    updateTextBox,
    removeTextBox,
    setAudio
  } = useJournalStore();

  const {
    state: historyState,
    setState: setHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory
  } = useUndoRedoState<HistoryEntry>({
    text: currentEntry.text,
    font: currentEntry.font,
    fontSize: currentEntry.fontSize,
    fontWeight: currentEntry.fontWeight,
    fontColor: currentEntry.fontColor,
    gradient: currentEntry.gradient,
    mood: currentEntry.mood,
    moodNote: currentEntry.moodNote,
    isPublic: currentEntry.isPublic,
    textStyle: currentEntry.textStyle || 'normal',
    stickers: currentEntry.stickers || [],
    icons: currentEntry.icons || [],
    textPosition: currentEntry.textPosition,
    backgroundImage: currentEntry.backgroundImage,
    drawing: currentEntry.drawing,
    filter: currentEntry.filter,
    textBoxes: currentEntry.textBoxes || [],
  });
  
  const {
    localPosition,
    containerDimensions,
    isDraggingText,
    handleDragStart,
    handleDragEnd
  } = useTextBoxPosition(currentEntry.textPosition, containerRef);

  useEffect(() => {
    loadChallenge();
    
    if (entries.length === 0) {
      loadEntries();
    }
    
    loadProgress();
  }, [loadChallenge, loadEntries, loadProgress, entries.length]);
  
  useEffect(() => {
    setHistoryState({
      text: currentEntry.text,
      font: currentEntry.font,
      fontSize: currentEntry.fontSize,
      fontWeight: currentEntry.fontWeight,
      fontColor: currentEntry.fontColor,
      gradient: currentEntry.gradient,
      mood: currentEntry.mood,
      moodNote: currentEntry.moodNote,
      isPublic: currentEntry.isPublic,
      textStyle: currentEntry.textStyle || 'normal',
      stickers: currentEntry.stickers || [],
      icons: currentEntry.icons || [],
      textPosition: currentEntry.textPosition,
      backgroundImage: currentEntry.backgroundImage,
      drawing: currentEntry.drawing,
      filter: currentEntry.filter,
      textBoxes: currentEntry.textBoxes || [],
    });
  }, [
    currentEntry.text,
    currentEntry.font,
    currentEntry.fontSize,
    currentEntry.fontWeight,
    currentEntry.fontColor,
    currentEntry.gradient,
    currentEntry.mood,
    currentEntry.moodNote,
    currentEntry.isPublic,
    currentEntry.textStyle,
    currentEntry.stickers,
    currentEntry.icons,
    currentEntry.textPosition,
    currentEntry.backgroundImage,
    currentEntry.drawing,
    currentEntry.filter,
    currentEntry.textBoxes,
    setHistoryState
  ]);
  
  const handleStickerAdd = (sticker: Sticker) => {
    console.log("Adding sticker:", sticker);
    const existingIndex = currentEntry.stickers.findIndex(s => s.id === sticker.id);
    
    if (existingIndex >= 0) {
      const updatedStickers = [...currentEntry.stickers];
      updatedStickers[existingIndex] = sticker;
      setStickers(updatedStickers);
    } else {
      addSticker(sticker);
    }
  };
  
  const handleIconAdd = (icon: Icon) => {
    console.log("Adding icon:", icon);
    const existingIndex = currentEntry.icons.findIndex(i => i.id === icon.id);
    
    if (existingIndex >= 0) {
      const updatedIcons = [...currentEntry.icons];
      updatedIcons[existingIndex] = icon;
      setIcons(updatedIcons);
    } else {
      addIcon(icon);
    }
  };
  
  const handleStickerMove = (id: string, position: { x: number; y: number }) => {
    const updatedStickers = currentEntry.stickers.map(sticker => 
      sticker.id === id ? { ...sticker, position } : sticker
    );
    setStickers(updatedStickers);
  };
  
  const handleIconMove = (id: string, position: { x: number; y: number }) => {
    const updatedIcons = currentEntry.icons.map(icon => 
      icon.id === id ? { ...icon, position } : icon
    );
    setIcons(updatedIcons);
  };
  
  const handleIconUpdate = (id: string, updates: Partial<Icon>) => {
    updateIcon(id, updates);
  };
  
  const handleIconSelect = (id: string | null) => {
    setSelectedIconId(id);
  };
  
  const handleTextBoxAdd = (textBox: TextBox) => {
    addTextBox(textBox);
  };
  
  const handleTextBoxUpdate = (id: string, updates: Partial<TextBox>) => {
    updateTextBox(id, updates);
  };
  
  const handleTextBoxRemove = (id: string) => {
    removeTextBox(id);
  };
  
  const handleTextBoxSelect = (id: string | null) => {
    setSelectedTextBoxId(id);
  };
  
  const handleTextMove = (position: { x: number; y: number }) => {
    setTextPosition(position);
  };
  
  const handleTextDragStart = () => {
    handleDragStart();
  };
  
  const handleTextDragEnd = () => {
    handleDragEnd();
  };
  
  const handleBackgroundSelect = (url: string) => {
    setBackgroundImage(url);
  };
  
  const handleDrawingChange = (drawing: string) => {
    setDrawing(drawing);
  };
  
  const handleFilterChange = (filter: string) => {
    setFilter(filter);
  };
  
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd, value } = textareaRef.current;
      const emoji = (emojiData as any).native || emojiData.emoji;
      
      const updatedText = 
        value.substring(0, selectionStart) + 
        emoji + 
        value.substring(selectionEnd);
      
      setText(updatedText);
      
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = selectionStart + emoji.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    } else {
      const emoji = (emojiData as any).native || emojiData.emoji;
      setText(currentEntry.text + emoji);
    }
  };
  
  const handleAudioChange = (audio: AudioTrack) => {
    setAudio(audio);
  };
  
  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setText(previousState.text);
      setFont(previousState.font);
      setFontSize(previousState.fontSize);
      setFontWeight(previousState.fontWeight);
      setFontColor(previousState.fontColor);
      setGradient(previousState.gradient);
      setMood(previousState.mood);
      setIsPublic(previousState.isPublic);
      setTextStyle(previousState.textStyle);
      setStickers(previousState.stickers);
      setIcons(previousState.icons);
      setTextPosition(previousState.textPosition);
      setBackgroundImage(previousState.backgroundImage || '');
      setDrawing(previousState.drawing || '');
      setFilter(previousState.filter || 'none');
      setTextBoxes(previousState.textBoxes);
    }
  };
  
  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setText(nextState.text);
      setFont(nextState.font);
      setFontSize(nextState.fontSize);
      setFontWeight(nextState.fontWeight);
      setFontColor(nextState.fontColor);
      setGradient(nextState.gradient);
      setMood(nextState.mood);
      setIsPublic(nextState.isPublic);
      setTextStyle(nextState.textStyle);
      setStickers(nextState.stickers);
      setIcons(nextState.icons);
      setTextPosition(nextState.textPosition);
      setBackgroundImage(nextState.backgroundImage || '');
      setDrawing(nextState.drawing || '');
      setFilter(nextState.filter || 'none');
      setTextBoxes(nextState.textBoxes);
    }
  };
  
  const handleResetToDefault = () => {
    setText('');
    setFont('inter');
    setFontSize('16px');
    setFontWeight('normal');
    setFontColor('#000000');
    setGradient('none');
    setMood(undefined);
    setIsPublic(false);
    setTextStyle('normal');
    setStickers([]);
    setIcons([]);
    setTextPosition({ x: 50, y: 50 });
    setBackgroundImage('');
    setDrawing('');
    setFilter('none');
    setTextBoxes([]);
    setAudio(undefined);
    resetHistory({
      text: '',
      font: 'inter',
      fontSize: '16px',
      fontWeight: 'normal',
      fontColor: '#000000',
      gradient: 'none',
      mood: undefined,
      moodNote: undefined,
      isPublic: false,
      textStyle: 'normal',
      stickers: [],
      icons: [],
      textPosition: { x: 50, y: 50 },
      backgroundImage: undefined,
      drawing: undefined,
      filter: 'none',
      textBoxes: [],
    });
    toast.success('Reset to default settings');
  };
  
  const handlePrint = async () => {
    try {
      const element = document.querySelector('.max-w-2xl');
      if (!element) {
        toast.error('Could not find journal element');
        return;
      }
      
      toast.info('Preparing PDF...');
      
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('journal-entry.pdf');
      
      toast.success('PDF downloaded');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };
  
  const handleSendEmail = async () => {
    if (!emailAddress) {
      toast.error('Please enter an email address');
      return;
    }
    
    setIsSending(true);
    
    try {
      const element = document.querySelector('.max-w-2xl');
      if (!element) {
        toast.error('Could not find journal element');
        setIsSending(false);
        return;
      }
      
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      const imageDataUrl = canvas.toDataURL('image/png');
      
      const { error } = await supabase.functions.invoke('send-journal', {
        body: {
          email: emailAddress,
          imageData: imageDataUrl,
          text: currentEntry.text
        }
      });
      
      if (error) throw error;
      
      toast.success('Journal sent to your email');
      setShowEmailDialog(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };
  
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('journal-images')
        .upload(`public/${fileName}`, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('journal-images')
        .getPublicUrl(`public/${fileName}`);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return '';
    }
  };
  
  const handleFontChange = (font: string) => {
    setFont(font);
  };
  
  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };
  
  const handleFontWeightChange = (weight: string) => {
    setFontWeight(weight);
  };
  
  const handleFontColorChange = (color: string) => {
    setFontColor(color);
  };
  
  const handleGradientChange = (gradient: string) => {
    setGradient(gradient);
  };
  
  const handleTextStyleChange = (style: string) => {
    setTextStyle(style);
  };
  
  return {
    currentEntry,
    entries,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    selectedIconId,
    selectedTextBoxId,
    containerRef,
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
    handleAudioChange,
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
