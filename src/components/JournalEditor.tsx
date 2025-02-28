
import { useState, useEffect, useRef } from "react";
import { useJournalStore } from "@/store/journalStore";
import { JournalEditorSidebar } from "./JournalEditorSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Send } from "lucide-react";
import { EmailDialog } from "./journal/EmailDialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { type EmojiClickData } from 'emoji-picker-react';
import { toast } from "sonner";

export function JournalEditor() {
  // Store state and actions
  const { 
    togglePreview, 
    showPreview, 
    currentEntry, 
    setCurrentEntryText,
    setMood,
    setIsPublic,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setTextStyle,
    setTextPosition,
    saveCurrentEntry,
    setBackgroundImage,
    setDrawing,
    setFilter,
    addSticker,
    addIcon,
    updateIcon,
    removeSticker,
    removeIcon,
    addTextBox,
    updateTextBox,
    removeTextBox,
    undo,
    redo,
    canUndo,
    canRedo,
    resetCurrentEntry
  } = useJournalStore();
  
  // Local state
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [currentDrawingTool, setCurrentDrawingTool] = useState("pen");
  const [currentDrawingColor, setCurrentDrawingColor] = useState("#000000");
  const [currentBrushSize, setCurrentBrushSize] = useState(3);
  const [currentStickerSize, setCurrentStickerSize] = useState(100);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Responsive layout
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [defaultLayout, setDefaultLayout] = useState([55, 45]);
  
  useEffect(() => {
    if (isMobile) {
      setDefaultLayout([100, 0]);
    } else {
      setDefaultLayout([55, 45]);
    }
  }, [isMobile]);

  // Handlers
  const handlePrint = () => {
    window.print();
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = currentEntry.text;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setCurrentEntryText(newText);
      
      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + emoji.length;
          textareaRef.current.selectionEnd = start + emoji.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setCurrentEntryText(currentEntry.text + emoji);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Journal entry sent to ${emailAddress}`);
      setIsEmailDialogOpen(false);
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const loadChallenge = () => {
    // For now, just a mock challenge
    setDailyChallenge({
      id: "challenge-1",
      prompt: "Write about something that made you smile today",
      date: new Date().toISOString(),
      xpReward: 10
    });
  };

  const applyChallenge = () => {
    if (dailyChallenge) {
      setCurrentEntryText(dailyChallenge.prompt);
    }
  };

  const handleDrawingToolSelect = (tool: string) => {
    setCurrentDrawingTool(tool);
  };

  const handleDrawingColorChange = (color: string) => {
    setCurrentDrawingColor(color);
  };

  const handleClearDrawing = () => {
    setDrawing("");
  };

  const handleBrushSizeChange = (size: number) => {
    setCurrentBrushSize(size);
  };

  const handleStickerResize = (size: number) => {
    setCurrentStickerSize(size);
  };

  const handleDrawingModeToggle = (enabled: boolean) => {
    setIsDrawingMode(enabled);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen w-full rounded-lg bg-background"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          minSize={isMobile ? 100 : 30}
          maxSize={isMobile ? 100 : 70}
          className="p-4"
        >
          {/* Editor Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Journal</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreview}
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmailDialogOpen(true)}
                title="Share via Email"
              >
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </div>
          </div>

          {/* Editor Content */}
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <JournalEditorSidebar
              textareaRef={textareaRef}
              currentEntry={currentEntry}
              dailyChallenge={dailyChallenge}
              selectedIconId={selectedIconId}
              selectedStickerId={selectedStickerId}
              handlePrint={handlePrint}
              handleEmojiSelect={handleEmojiSelect}
              setShowEmailDialog={setIsEmailDialogOpen}
              setText={setCurrentEntryText}
              setMood={setMood}
              setIsPublic={setIsPublic}
              setFont={setFont}
              setFontSize={setFontSize}
              setFontWeight={setFontWeight}
              setFontColor={setFontColor}
              setGradient={setGradient}
              setTextStyle={setTextStyle}
              saveEntry={saveCurrentEntry}
              loadChallenge={loadChallenge}
              applyChallenge={applyChallenge}
              onDrawingToolSelect={handleDrawingToolSelect}
              currentDrawingTool={currentDrawingTool}
              onDrawingColorChange={handleDrawingColorChange}
              currentDrawingColor={currentDrawingColor}
              onClearDrawing={handleClearDrawing}
              onBrushSizeChange={handleBrushSizeChange}
              currentBrushSize={currentBrushSize}
              onStickerAdd={addSticker}
              onStickerResize={handleStickerResize}
              currentStickerSize={currentStickerSize}
              onIconAdd={addIcon}
              onBackgroundSelect={setBackgroundImage}
              onFilterChange={setFilter}
              handleUndo={undo}
              handleRedo={redo}
              handleResetToDefault={resetCurrentEntry}
              canUndo={canUndo}
              canRedo={canRedo}
              isDrawingMode={isDrawingMode}
              onDrawingModeToggle={handleDrawingModeToggle}
            />
          </ScrollArea>
        </ResizablePanel>

        {/* Hide the preview panel since it's now handled in App.tsx */}
        {!isMobile && showPreview && (
          <>
            <ResizableHandle withHandle className={cn(!showPreview && "hidden")} />
            <ResizablePanel
              defaultSize={defaultLayout[1]}
              minSize={30}
              maxSize={70}
              className={cn(!showPreview && "hidden")}
            >
              {/* We'll leave this empty as the preview is now rendered at the App level */}
              <div className="h-full w-full"></div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <EmailDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        emailAddress={emailAddress}
        onEmailChange={setEmailAddress}
        onSend={handleSendEmail}
        isSending={isSending}
      />
    </div>
  );
}
