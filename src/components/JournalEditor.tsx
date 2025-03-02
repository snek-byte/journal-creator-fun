
import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './journal/JournalEditorSidebar';
import { JournalPreview } from './journal/JournalPreview';
import { EmailDialog } from './journal/EmailDialog';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Sticker, Icon, TextBox } from '@/types/journal';

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
  
  // Drawing tool state
  const [currentDrawingTool, setCurrentDrawingTool] = useState('pen');
  const [currentDrawingColor, setCurrentDrawingColor] = useState('#000000');
  const [currentBrushSize, setCurrentBrushSize] = useState(3);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  // Sticker resize state - default to 100px
  const [stickerSize, setStickerSize] = useState(100);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Update sticker size when a new sticker is selected
  useEffect(() => {
    if (selectedStickerId) {
      const sticker = currentEntry.stickers.find(s => s.id === selectedStickerId);
      if (sticker && sticker.width) {
        setStickerSize(sticker.width);
        console.log("Set sticker size to:", sticker.width);
      }
    }
  }, [selectedStickerId, currentEntry.stickers]);

  const handleDrawingModeToggle = (enabled: boolean) => {
    setIsDrawingMode(enabled);
  };

  const handleClearDrawing = () => {
    handleDrawingChange('');
  };

  // Function to create a sticker object from a URL
  const handleStickerAddFromUrl = (stickerUrl: string) => {
    console.log("Creating sticker from URL:", stickerUrl);
    const newSticker: Sticker = {
      id: uuidv4(),
      url: stickerUrl,
      position: { x: 50, y: 50 },
      width: stickerSize,
      height: stickerSize
    };
    console.log("New sticker object:", newSticker);
    handleStickerAdd(newSticker);
  };

  const handleIconAddWithId = (iconData: { url: string, style: 'outline' | 'color' }) => {
    console.log("Adding icon with style:", iconData.style);
    const newIcon: Icon = {
      id: uuidv4(),
      url: iconData.url,
      position: { x: 50, y: 50 },
      color: iconData.style === 'color' ? '#ff5555' : '#000000',
      size: 48,
      style: iconData.style
    };
    console.log("New icon created:", newIcon);
    handleIconAdd(newIcon);
  };

  // Function to create a new empty text box
  const handleCreateTextBox = () => {
    console.log("Creating new text box");
    const newTextBox: TextBox = {
      id: uuidv4(),
      text: '', // Empty by default
      position: { x: 50, y: 50 },
      width: 200,
      height: 100,
      font: currentEntry.font,
      fontSize: currentEntry.fontSize,
      fontWeight: currentEntry.fontWeight,
      fontColor: currentEntry.fontColor,
      gradient: currentEntry.gradient,
      textStyle: currentEntry.textStyle,
      rotation: 0,
      zIndex: (currentEntry.textBoxes?.length || 0) + 10
    };
    
    handleTextBoxAdd(newTextBox);
    handleTextBoxSelect(newTextBox.id);
  };

  // Resize sticker handler
  const handleStickerResize = (size: number) => {
    console.log("JournalEditor: handleStickerResize called with size", size);
    setStickerSize(size);
    
    // If a sticker is selected, update its size
    if (selectedStickerId) {
      console.log("Resizing sticker:", selectedStickerId, "to size:", size);
      
      // Find the sticker to update
      const stickerToUpdate = currentEntry.stickers.find(s => s.id === selectedStickerId);
      if (stickerToUpdate) {
        // Create updated sticker with new size
        const updatedSticker: Sticker = {
          ...stickerToUpdate,
          width: size,
          height: size
        };
        
        // Update the sticker by passing the entire updated sticker object
        handleStickerAdd(updatedSticker);
      }
    } else if (currentEntry.stickers.length > 0) {
      // No sticker is selected, but we'll set the size for the next sticker that's added
      console.log("Setting default sticker size for new stickers:", size);
    }
  };

  // Handler for sticker selection
  const handleStickerSelect = (id: string | null) => {
    console.log("Sticker selected in JournalEditor:", id);
    setSelectedStickerId(id);
    
    // If we selected a new sticker, update the size state
    if (id) {
      const sticker = currentEntry.stickers.find(s => s.id === id);
      if (sticker && sticker.width) {
        setStickerSize(sticker.width);
      }
    }
  };

  // For TypeScript to accept currentEntry as JournalEntry
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
        onDrawingToolSelect={setCurrentDrawingTool}
        currentDrawingTool={currentDrawingTool}
        onDrawingColorChange={setCurrentDrawingColor}
        currentDrawingColor={currentDrawingColor}
        onClearDrawing={handleClearDrawing}
        onBrushSizeChange={setCurrentBrushSize}
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
