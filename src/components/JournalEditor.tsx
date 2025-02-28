
import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './journal/JournalEditorSidebar';
import { JournalPreview } from './journal/JournalPreview';
import { EmailDialog } from './journal/EmailDialog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Sticker, Icon } from '@/types/journal';

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
  } = useJournalEditor();
  
  // Drawing tool state
  const [currentDrawingTool, setCurrentDrawingTool] = useState('pen');
  const [currentDrawingColor, setCurrentDrawingColor] = useState('#000000');
  const [currentBrushSize, setCurrentBrushSize] = useState(3);

  const handleClearDrawing = () => {
    handleDrawingChange('');
  };

  // Function to create a sticker object from a URL
  const handleStickerAddFromUrl = (stickerUrl: string) => {
    const newSticker: Sticker = {
      id: uuidv4(),
      url: stickerUrl,
      position: { x: 50, y: 50 },
      width: 100,
      height: 100
    };
    handleStickerAdd(newSticker);
  };

  const handleIconAddWithId = (iconData: { url: string, style: 'outline' | 'color' }) => {
    const newIcon: Icon = {
      id: uuidv4(),
      url: iconData.url,
      position: { x: 50, y: 50 },
      color: '#000000',
      size: 48,
      style: iconData.style
    };
    handleIconAdd(newIcon);
  };

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
        onDrawingToolSelect={setCurrentDrawingTool}
        currentDrawingTool={currentDrawingTool}
        onDrawingColorChange={setCurrentDrawingColor}
        currentDrawingColor={currentDrawingColor}
        onClearDrawing={handleClearDrawing}
        onBrushSizeChange={setCurrentBrushSize}
        currentBrushSize={currentBrushSize}
        onStickerAdd={handleStickerAddFromUrl}
        onIconAdd={handleIconAddWithId}
        onBackgroundSelect={handleBackgroundSelect}
        onFilterChange={handleFilterChange}
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
        drawingTool={currentDrawingTool}
        drawingColor={currentDrawingColor}
        brushSize={currentBrushSize}
      />
    </div>
  );
}
