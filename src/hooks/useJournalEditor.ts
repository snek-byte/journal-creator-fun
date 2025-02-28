
import { useJournalStore } from '@/store/journalStore';
import { useJournalHistory } from './journal/useJournalHistory';
import { useJournalElements } from './journal/useJournalElements';
import { useJournalStyling } from './journal/useJournalStyling';
import { useJournalUtilities } from './journal/useJournalUtilities';

export function useJournalEditor() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
    togglePreview,
    saveEntry,
    applyChallenge,
    loadChallenge,
    setText,
    setMood,
    setIsPublic,
  } = useJournalStore((state: any) => state);

  // Compose hooks
  const { 
    isDraggingText,
    selectedIconId,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleIconSelect,
    handleTextDragStart,
    handleTextDragEnd,
    handleTextMove
  } = useJournalElements();

  const {
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleFontSizeChange,
    handleFontWeightChange,
    handleFontChange,
    handleFontColorChange,
    handleGradientChange,
    handleTextStyleChange
  } = useJournalStyling({ 
    selectedIconId, 
    handleIconUpdate
  });

  const {
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    handlePrint,
    handleEmojiSelect,
    handleImageUpload,
    handleSendEmail,
    setShowEmailDialog,
    setEmailAddress
  } = useJournalUtilities();

  const {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    handleReset
  } = useJournalHistory();

  return {
    // Store values
    currentEntry,
    showPreview,
    dailyChallenge,
    
    // State from hooks
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    isDraggingText,
    selectedIconId,
    canUndo,
    canRedo,
    
    // Element methods
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleIconSelect,
    handleTextDragStart,
    handleTextDragEnd,
    handleTextMove,
    
    // Styling methods
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleFontSizeChange,
    handleFontWeightChange,
    handleFontChange,
    handleFontColorChange,
    handleGradientChange,
    handleTextStyleChange,
    
    // Utility methods
    handlePrint,
    handleEmojiSelect,
    handleImageUpload,
    handleSendEmail,
    setShowEmailDialog,
    setEmailAddress,
    
    // History methods
    handleUndo,
    handleRedo,
    handleReset,
    
    // Main functionality
    setText,
    setMood,
    setIsPublic,
    togglePreview,
    saveEntry,
    applyChallenge,
    loadChallenge
  };
}
