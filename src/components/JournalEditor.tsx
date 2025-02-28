
import React, { useEffect } from 'react';
import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './journal/JournalEditorSidebar';
import { JournalPreview } from './journal/JournalPreview';
import { EmailDialog } from './journal/EmailDialog';
import { useJournalStore } from '@/store/journalStore';
import { toast } from 'sonner';

export function JournalEditor() {
  // Get all the functionality from the hook
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    isDocked,
    textareaRef,
    handlePrint,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleTextMove,
    handleBackgroundSelect,
    handleDrawingChange,
    handleEmojiSelect,
    handleSendEmail,
    toggleDocked,
    setShowEmailDialog,
    setEmailAddress,
    setMood,
    setIsPublic,
    setText,
    togglePreview,
    saveEntry,
    applyChallenge,
    loadChallenge
  } = useJournalEditor();

  // Load challenge on mount
  useEffect(() => {
    try {
      loadChallenge();
      console.log("Challenge loaded successfully");
    } catch (error) {
      console.error("Failed to load challenge:", error);
      toast.error("Failed to load daily challenge");
    }
  }, [loadChallenge]);

  // Force immediate display of editor content for debugging
  console.log("Journal Editor rendering with:", { 
    currentEntryExists: !!currentEntry,
    isDocked, 
    showPreview,
    hasDailyChallenge: !!dailyChallenge
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Sidebar */}
      <JournalEditorSidebar 
        isDocked={isDocked}
        toggleDocked={toggleDocked}
        textareaRef={textareaRef}
        currentEntry={currentEntry}
        dailyChallenge={dailyChallenge}
        handlePrint={handlePrint}
        handleEmojiSelect={handleEmojiSelect}
        setShowEmailDialog={setShowEmailDialog}
        setText={setText}
        setMood={setMood}
        setIsPublic={setIsPublic}
        setFont={value => useJournalStore.getState().setFont(value)}
        setFontSize={value => useJournalStore.getState().setFontSize(value)}
        setFontWeight={value => useJournalStore.getState().setFontWeight(value)}
        setFontColor={value => useJournalStore.getState().setFontColor(value)}
        setGradient={value => useJournalStore.getState().setGradient(value)}
        setTextStyle={value => useJournalStore.getState().setTextStyle(value)}
        saveEntry={saveEntry}
        loadChallenge={loadChallenge}
        applyChallenge={applyChallenge}
      />

      {/* Email dialog */}
      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        emailAddress={emailAddress}
        onEmailChange={setEmailAddress}
        onSend={handleSendEmail}
        isSending={isSending}
      />

      {/* Preview area */}
      <div className={`flex-1 ${!isDocked ? 'ml-64' : ''}`}>
        <JournalPreview
          showPreview={showPreview}
          text={currentEntry.text}
          mood={currentEntry.mood}
          font={currentEntry.font}
          fontSize={currentEntry.fontSize}
          fontWeight={currentEntry.fontWeight}
          fontColor={currentEntry.fontColor}
          gradient={currentEntry.gradient}
          textStyle={currentEntry.textStyle}
          stickers={currentEntry.stickers || []}
          icons={currentEntry.icons || []}
          textPosition={currentEntry.textPosition || { x: 50, y: 50 }}
          backgroundImage={currentEntry.backgroundImage}
          drawing={currentEntry.drawing}
          onStickerAdd={handleStickerAdd}
          onIconAdd={handleIconAdd}
          onStickerMove={handleStickerMove}
          onIconMove={handleIconMove}
          onIconUpdate={handleIconUpdate}
          onTextMove={handleTextMove}
          onBackgroundSelect={handleBackgroundSelect}
          onDrawingChange={handleDrawingChange}
          onTogglePreview={togglePreview}
        />
      </div>
    </div>
  );
}
