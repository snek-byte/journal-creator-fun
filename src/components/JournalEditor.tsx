
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { JournalEditorSidebar } from "./journal/JournalEditorSidebar";
import { JournalPreview } from "./journal/JournalPreview";
import { JournalStylingControls } from "./journal/JournalStylingControls";
import { useJournalEditor } from "@/hooks/useJournalEditor";
import { Button } from "@/components/ui/button";
import { EmailDialog } from "./journal/EmailDialog";
import { MoodSelector } from "./journal/MoodSelector";
import { DailyChallenge } from "./journal/DailyChallenge";
import { type Icon, type Sticker } from "@/types/journal";

export function JournalEditor() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    isDraggingText,
    handlePrint,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleTextMove,
    handleTextDragStart,
    handleTextDragEnd,
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleEmojiSelect,
    handleSendEmail,
    handleImageUpload,
    setShowEmailDialog,
    setEmailAddress,
    setMood,
    setIsPublic,
    setText,
    togglePreview,
    saveEntry,
    applyChallenge,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setTextStyle
  } = useJournalEditor();

  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <div className="flex flex-col w-full lg:w-1/4 border-r min-h-[600px] print:hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-2">My Journal</h2>
          <p className="text-gray-500 text-sm mb-4">
            Express yourself freely in your personal journal.
          </p>

          <div className="mb-4">
            <DailyChallenge 
              prompt={dailyChallenge?.prompt || ""}
              onApply={applyChallenge}
            />
          </div>
          
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              value={currentEntry.text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing your journal entry..."
              className="w-full h-28 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            ></textarea>
          </div>

          <MoodSelector
            mood={currentEntry.mood}
            onMoodChange={setMood}
            className="mb-4"
          />

          <div>
            <h3 className="text-sm font-medium mb-2">Privacy</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="public-toggle"
                checked={currentEntry.isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="public-toggle" className="text-sm">
                Share publicly
              </label>
            </div>
          </div>
        </div>

        <Separator />

        <JournalStylingControls
          font={currentEntry.font}
          fontSize={currentEntry.fontSize}
          fontWeight={currentEntry.fontWeight}
          fontColor={currentEntry.fontColor}
          gradient={currentEntry.gradient}
          textStyle={currentEntry.textStyle}
          onFontChange={setFont}
          onFontSizeChange={setFontSize}
          onFontWeightChange={setFontWeight}
          onFontColorChange={setFontColor}
          onGradientChange={setGradient}
          onTextStyleChange={setTextStyle}
          onEmojiSelect={handleEmojiSelect}
        />

        <div className="mt-auto p-4 border-t">
          <div className="flex space-x-2">
            <Button className="flex-1" onClick={saveEntry}>
              Save Entry
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowEmailDialog(true)}
            >
              Email
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
            >
              Print
            </Button>
          </div>
        </div>
      </div>

      <JournalEditorSidebar 
        onImageUpload={handleImageUpload}
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
        stickers={currentEntry.stickers}
        icons={currentEntry.icons}
        textPosition={currentEntry.textPosition}
        backgroundImage={currentEntry.backgroundImage}
        drawing={currentEntry.drawing}
        filter={currentEntry.filter}
        isDraggingText={isDraggingText}
        onStickerAdd={handleStickerAdd}
        onIconAdd={handleIconAdd}
        onStickerMove={handleStickerMove}
        onIconMove={handleIconMove}
        onIconUpdate={handleIconUpdate}
        onTextMove={handleTextMove}
        onTextDragStart={handleTextDragStart}
        onTextDragEnd={handleTextDragEnd}
        onBackgroundSelect={handleBackgroundSelect}
        onDrawingChange={handleDrawingChange}
        onFilterChange={handleFilterChange}
        onTogglePreview={togglePreview}
      />

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        emailAddress={emailAddress}
        onEmailChange={setEmailAddress}
        onSend={handleSendEmail}
        isSending={isSending}
      />
    </div>
  );
}
