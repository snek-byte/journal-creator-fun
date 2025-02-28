
import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './journal/JournalEditorSidebar';
import { JournalPreview } from './journal/JournalPreview';
import { EmailDialog } from './journal/EmailDialog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Sticker, Icon } from '@/types/journal';
import { toast } from "sonner";

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
  
  // Sticker resize state
  const [stickerSize, setStickerSize] = useState(100);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

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
    }
  };

  // Handler for sticker selection
  const handleStickerSelect = (id: string | null) => {
    console.log("Sticker selected:", id);
    setSelectedStickerId(id);
    
    // If a sticker is selected, update the size slider to match
    if (id) {
      const selectedSticker = currentEntry.stickers.find(s => s.id === id);
      if (selectedSticker && selectedSticker.width) {
        setStickerSize(selectedSticker.width);
      }
    }
  };

  console.log("Current stickers in entry:", currentEntry.stickers);
  console.log("Selected sticker ID:", selectedStickerId);
  console.log("Current sticker size:", stickerSize);

  // For TypeScript to accept currentEntry as JournalEntry
  const fullEntry = {
    ...currentEntry,
    id: 0,
    date: new Date().toISOString()
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
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
        onStickerSelect={handleStickerSelect}
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
