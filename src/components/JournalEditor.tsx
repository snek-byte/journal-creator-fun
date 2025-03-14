import { useJournalEditor } from '@/hooks/useJournalEditor';
import { JournalEditorSidebar } from './journal/JournalEditorSidebar';
import { JournalPreview } from './journal/JournalPreview';
import { EmailDialog } from './journal/EmailDialog';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Sticker, Icon, TextBox } from '@/types/journal';
import { useJournalStore } from '@/store/journalStore';
import { getOptimalPosition, getNextZIndex } from '@/utils/textBoxUtils';

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
  
  const [currentDrawingTool, setCurrentDrawingTool] = useState('pen');
  const [currentDrawingColor, setCurrentDrawingColor] = useState('#000000');
  const [currentBrushSize, setCurrentBrushSize] = useState(3);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  const [stickerSize, setStickerSize] = useState(100);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const clearBackground = useJournalStore(state => state.clearBackground);

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
    clearBackground();
  };

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

  const handleCreateTextBox = () => {
    console.log("Creating new text box");
    
    const position = getOptimalPosition(currentEntry.textBoxes || [], 50, 30);
    const zIndex = getNextZIndex(currentEntry.textBoxes || []);
    
    const newTextBox: TextBox = {
      id: uuidv4(),
      text: 'Double-click to edit this text box',
      position: position,
      width: 200,
      height: 100,
      font: currentEntry.font || 'sans-serif',
      fontSize: currentEntry.fontSize || '16px',
      fontWeight: currentEntry.fontWeight || 'normal',
      fontColor: currentEntry.fontColor || '#000000',
      gradient: currentEntry.gradient || '',
      textStyle: currentEntry.textStyle || '',
      rotation: 0,
      zIndex: zIndex
    };
    
    handleTextBoxAdd(newTextBox);
    handleTextBoxSelect(newTextBox.id);
  };

  const handleStickerResize = (size: number) => {
    console.log("JournalEditor: handleStickerResize called with size", size);
    setStickerSize(size);
    
    if (selectedStickerId) {
      console.log("Resizing sticker:", selectedStickerId, "to size:", size);
      
      const stickerToUpdate = currentEntry.stickers.find(s => s.id === selectedStickerId);
      if (stickerToUpdate) {
        const updatedSticker: Sticker = {
          ...stickerToUpdate,
          width: size,
          height: size
        };
        
        handleStickerAdd(updatedSticker);
      }
    } else if (currentEntry.stickers.length > 0) {
      console.log("Setting default sticker size for new stickers:", size);
    }
  };

  const handleStickerSelect = (id: string | null) => {
    console.log("Sticker selected in JournalEditor:", id);
    setSelectedStickerId(id);
    
    if (id) {
      const sticker = currentEntry.stickers.find(s => s.id === id);
      if (sticker && sticker.width) {
        setStickerSize(sticker.width);
      }
    }
  };

  const fullEntry = {
    ...currentEntry,
    id: 0,
    date: new Date().toISOString()
  };

  const MobilePreview = () => (
    <div className="bg-white rounded shadow-md p-3 min-h-[200px] w-full relative overflow-hidden">
      <div
        className={`h-full w-full ${currentEntry.filter !== 'none' ? `filter-${currentEntry.filter}` : ''}`}
        style={{
          backgroundImage: currentEntry.backgroundImage ? `url(${currentEntry.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {currentEntry.drawing && (
          <div className="absolute inset-0 pointer-events-none">
            <img src={currentEntry.drawing} alt="Drawing" className="w-full h-full object-cover" />
          </div>
        )}
        
        {currentEntry.text && (
          <div
            className={`p-2 break-words font-${currentEntry.font}`}
            style={{
              fontSize: currentEntry.fontSize,
              fontWeight: currentEntry.fontWeight,
              color: currentEntry.fontColor,
              backgroundImage: currentEntry.gradient || 'none',
              WebkitBackgroundClip: currentEntry.gradient ? 'text' : 'border-box',
              WebkitTextFillColor: currentEntry.gradient ? 'transparent' : currentEntry.fontColor,
              position: 'absolute',
              top: `${currentEntry.textPosition.y}%`,
              left: `${currentEntry.textPosition.x}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '80%',
              fontStyle: currentEntry.textStyle?.includes('italic') ? 'italic' : 'normal',
              textDecoration: currentEntry.textStyle?.includes('underline') ? 'underline' : 'none',
            }}
          >
            {currentEntry.text}
          </div>
        )}
        
        {currentEntry.stickers.map((sticker) => (
          <div
            key={sticker.id}
            style={{
              position: 'absolute',
              top: `${sticker.position.y}%`,
              left: `${sticker.position.x}%`,
              transform: 'translate(-50%, -50%)',
              width: `${sticker.width}px`,
              height: `${sticker.height}px`,
              backgroundImage: `url(${sticker.url})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>
    </div>
  );

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
        currentBackground={currentEntry.backgroundImage}
        onFilterChange={handleFilterChange}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleResetToDefault={handleResetToDefault}
        canUndo={canUndo}
        canRedo={canRedo}
        isDrawingMode={isDrawingMode}
        onDrawingModeToggle={handleDrawingModeToggle}
        onCreateTextBox={handleCreateTextBox}
        displayBoxComponent={<MobilePreview />}
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
