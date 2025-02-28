
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
    loadChallenge,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setTextStyle
  } = useJournalEditor();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
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
        setFont={setFont}
        setFontSize={setFontSize}
        setFontWeight={setFontWeight}
        setFontColor={setFontColor}
        setGradient={setGradient}
        setTextStyle={setTextStyle}
        saveEntry={saveEntry}
        loadChallenge={loadChallenge}
        applyChallenge={applyChallenge}
      />

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        emailAddress={emailAddress}
        onEmailChange={setEmailAddress}
        onSend={handleSendEmail}
        isSending={isSending}
      />

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
