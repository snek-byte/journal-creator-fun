
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
    selectedEmojiId,
    emojiMode,
    handlePrint,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleEmojiMove,
    handleIconUpdate,
    handleEmojiUpdate,
    handleIconSelect,
    handleEmojiSelect,
    handleTextMove,
    handleTextDragStart,
    handleTextDragEnd,
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleEmojiPickerSelect,
    toggleEmojiMode,
    handleSendEmail,
    handleImageUpload,
    handleSizeChange,
    handleFontWeightChange,
    handleFontChange,
    handleFontColorChange,
    handleGradientChange,
    handleTextStyleChange,
    handleRotateEmoji,
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
    canUndo,
    canRedo,
  } = useJournalEditor();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <JournalEditorSidebar 
        textareaRef={textareaRef}
        currentEntry={currentEntry}
        dailyChallenge={dailyChallenge}
        selectedIconId={selectedIconId}
        selectedEmojiId={selectedEmojiId}
        emojiMode={emojiMode}
        handlePrint={handlePrint}
        handleEmojiPickerSelect={handleEmojiPickerSelect}
        toggleEmojiMode={toggleEmojiMode}
        setShowEmailDialog={setShowEmailDialog}
        setText={setText}
        setMood={setMood}
        setIsPublic={setIsPublic}
        setFont={handleFontChange}
        setFontSize={handleSizeChange}
        setFontWeight={handleFontWeightChange}
        setFontColor={handleFontColorChange}
        setGradient={handleGradientChange}
        setTextStyle={handleTextStyleChange}
        handleRotateEmoji={handleRotateEmoji}
        saveEntry={saveEntry}
        loadChallenge={loadChallenge}
        applyChallenge={applyChallenge}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleResetToDefault={handleResetToDefault}
        canUndo={canUndo}
        canRedo={canRedo}
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
        emojis={currentEntry.emojis || []}
        textPosition={currentEntry.textPosition || { x: 50, y: 50 }}
        backgroundImage={currentEntry.backgroundImage}
        drawing={currentEntry.drawing}
        filter={currentEntry.filter}
        onStickerAdd={handleStickerAdd}
        onIconAdd={handleIconAdd}
        onStickerMove={handleStickerMove}
        onIconMove={handleIconMove}
        onEmojiMove={handleEmojiMove}
        onIconUpdate={handleIconUpdate}
        onEmojiUpdate={handleEmojiUpdate}
        onIconSelect={handleIconSelect}
        onEmojiSelect={handleEmojiSelect}
        onTextMove={handleTextMove}
        onTextDragStart={handleTextDragStart}
        onTextDragEnd={handleTextDragEnd}
        onBackgroundSelect={handleBackgroundSelect}
        onDrawingChange={handleDrawingChange}
        onFilterChange={handleFilterChange}
        onTogglePreview={togglePreview}
      />
    </div>
  );
}
