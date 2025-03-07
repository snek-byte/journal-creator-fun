
import { useState } from 'react';
import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './JournalEditorSidebar';
import { JournalPreview } from './JournalPreview';
import { EmailDialog } from './EmailDialog';
import { StickerControls } from './StickerControls';
import { DrawingControls } from './DrawingControls';
import { TextBoxCreator } from './TextBoxCreator';
import { StickerCreator } from './StickerCreator';
import { IconCreator } from './IconCreator';
import { useJournalStore } from '@/store/journalStore';

export function JournalEditorContainer() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
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
    canUndo,
    canRedo,
  } = useJournalEditor();
  
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [stickerSize, setStickerSize] = useState(100);
  
  const clearBackground = useJournalStore(state => state.clearBackground);

  // Use the DrawingControls component to manage drawing state
  const {
    currentDrawingTool,
    currentDrawingColor,
    currentBrushSize,
    isDrawingMode,
    handleDrawingToolChange,
    handleDrawingColorChange,
    handleBrushSizeChange,
    handleDrawingModeToggle,
    handleClearDrawing
  } = DrawingControls({
    onDrawingToolSelect: (tool) => setCurrentDrawingTool(tool),
    onDrawingColorChange: setCurrentDrawingColor,
    onBrushSizeChange: setCurrentBrushSize,
    onDrawingModeToggle: setIsDrawingMode,
    onClearDrawing: () => {
      handleDrawingChange('');
      clearBackground();
    }
  });

  // Use the TextBoxCreator to handle text box creation
  const { handleCreateTextBox } = TextBoxCreator({
    font: currentEntry.font,
    fontSize: currentEntry.fontSize,
    fontWeight: currentEntry.fontWeight,
    fontColor: currentEntry.fontColor,
    gradient: currentEntry.gradient,
    textStyle: currentEntry.textStyle,
    textBoxes: currentEntry.textBoxes || [],
    onTextBoxAdd: handleTextBoxAdd,
    onTextBoxSelect: handleTextBoxSelect
  });

  // Use the StickerCreator to handle sticker creation
  const { handleStickerAddFromUrl } = StickerCreator({
    stickerSize,
    onStickerAdd: handleStickerAdd
  });

  // Use the IconCreator to handle icon creation
  const { handleIconAddWithId } = IconCreator({
    onIconAdd: handleIconAdd
  });

  // Handle sticker selection and resizing
  const handleStickerSelect = (id: string | null) => {
    console.log("Sticker selected in JournalEditorContainer:", id);
    setSelectedStickerId(id);
    
    if (id) {
      const sticker = currentEntry.stickers.find(s => s.id === id);
      if (sticker && sticker.width) {
        setStickerSize(sticker.width);
      }
    }
  };

  const handleStickerResize = (size: number) => {
    console.log("JournalEditorContainer: handleStickerResize called with size", size);
    setStickerSize(size);
    
    if (selectedStickerId) {
      console.log("Resizing sticker:", selectedStickerId, "to size:", size);
      
      const stickerToUpdate = currentEntry.stickers.find(s => s.id === selectedStickerId);
      if (stickerToUpdate) {
        const updatedSticker = {
          ...stickerToUpdate,
          width: size,
          height: size
        };
        
        handleStickerAdd(updatedSticker);
      }
    }
  };

  const fullEntry = {
    ...currentEntry,
    id: 0,
    date: new Date().toISOString()
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 overflow-auto">
      <JournalEditorSidebar 
        textareaRef={textareaRef}
        currentEntry={fullEntry}
        dailyChallenge={dailyChallenge}
        selectedIconId={selectedIconId}
        selectedStickerId={selectedStickerId}
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
        onDrawingToolSelect={handleDrawingToolChange}
        currentDrawingTool={currentDrawingTool}
        onDrawingColorChange={handleDrawingColorChange}
        currentDrawingColor={currentDrawingColor}
        onClearDrawing={handleClearDrawing}
        onBrushSizeChange={handleBrushSizeChange}
        currentBrushSize={currentBrushSize}
        onStickerAdd={handleStickerAddFromUrl}
        onStickerResize={handleStickerResize}
        currentStickerSize={stickerSize}
        onIconAdd={handleIconAddWithId}
        onBackgroundSelect={handleBackgroundSelect}
        onFilterChange={handleFilterChange}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleResetToDefault={handleResetToDefault}
        canUndo={canUndo}
        canRedo={canRedo}
        isDrawingMode={isDrawingMode}
        onDrawingModeToggle={handleDrawingModeToggle}
        onCreateTextBox={handleCreateTextBox}
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
        textBoxes={currentEntry.textBoxes || []}
        textPosition={currentEntry.textPosition}
        backgroundImage={currentEntry.backgroundImage}
        drawing={currentEntry.drawing}
        filter={currentEntry.filter}
        onStickerAdd={handleStickerAdd}
        onIconAdd={handleIconAdd}
        onStickerMove={handleStickerMove}
        onIconMove={handleIconMove}
        onIconUpdate={handleIconUpdate}
        onIconSelect={handleIconSelect}
        onStickerSelect={handleStickerSelect}
        onTextBoxAdd={handleTextBoxAdd}
        onTextBoxUpdate={handleTextBoxUpdate}
        onTextBoxRemove={handleTextBoxRemove}
        onTextBoxSelect={handleTextBoxSelect}
        onTextMove={handleTextMove}
        onTextDragStart={handleTextDragStart}
        onTextDragEnd={handleTextDragEnd}
        onBackgroundSelect={handleBackgroundSelect}
        onDrawingChange={handleDrawingChange}
        onFilterChange={handleFilterChange}
        onTogglePreview={togglePreview}
        drawingTool={currentDrawingTool}
        drawingColor={currentDrawingColor}
        brushSize={currentBrushSize}
        isDrawingMode={isDrawingMode}
      />
    </div>
  );
}
