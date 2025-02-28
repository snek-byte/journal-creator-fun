
import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './journal/JournalEditorSidebar';
import { JournalPreview } from './journal/JournalPreview';
import { EmailDialog } from './journal/EmailDialog';

export function JournalEditor() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
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
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleEmojiSelect,
    handleSendEmail,
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
    loadChallenge,
  } = useJournalEditor();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <JournalEditorSidebar 
        textareaRef={textareaRef}
        currentEntry={currentEntry}
        dailyChallenge={dailyChallenge}
        selectedIconId={selectedIconId}
        handlePrint={handlePrint}
        handleEmojiSelect={handleEmojiSelect}
        setShowEmailDialog={setShowEmailDialog}
        setText={setText}
        setMood={setMood}
        setIsPublic={setIsPublic}
        setFont={handleFontChange}
        setFontSize={handleFontSizeChange}
        setFontWeight={handleFontWeightChange}
        setFontColor={handleFontColorChange}
        setGradient={handleGradientChange}
        setTextStyle={handleTextStyleChange}
        saveEntry={saveEntry}
        loadChallenge={loadChallenge}
        applyChallenge={applyChallenge}
        canUndo={canUndo}
        canRedo={canRedo}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleReset={handleReset}
      />

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        emailAddress={emailAddress}
        onEmailChange={setEmailAddress}
        onSend={handleSendEmail}
        isSending={isSending}
      />

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
        filter={currentEntry.filter}
        onStickerAdd={handleStickerAdd}
        onIconAdd={handleIconAdd}
        onStickerMove={handleStickerMove}
        onIconMove={handleIconMove}
        onIconUpdate={handleIconUpdate}
        onIconSelect={handleIconSelect}
        onTextMove={handleTextMove}
        onBackgroundSelect={handleBackgroundSelect}
        onDrawingChange={handleDrawingChange}
        onFilterChange={handleFilterChange}
        onTogglePreview={togglePreview}
      />
    </div>
  );
}
