import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "./MoodSelector";
import { JournalStylingControls } from "./JournalStylingControls";
import { DailyChallenge } from "./DailyChallenge";
import { BackgroundImageSelector } from "./BackgroundImageSelector";
import { ImageFilterSelector } from "./ImageFilterSelector";
import { StickerSelector } from "./StickerSelector";
import { IconSelector } from "./IconSelector";
import { IconColorPicker } from "./IconColorPicker";
import { ProgressCard } from "./ProgressCard";
import type { JournalEntry, Challenge, Mood } from "@/types/journal";
import {
  FileText,
  Send,
  Save,
  Printer,
  Undo2,
  Redo2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JournalEditorSidebarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  currentEntry: JournalEntry;
  dailyChallenge: Challenge | null;
  selectedIconId: string | null;
  selectedStickerId: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emoji: EmojiClickData) => void;
  setShowEmailDialog: (show: boolean) => void;
  setText: (text: string) => void;
  setMood: (mood: Mood | undefined) => void;
  setIsPublic: (isPublic: boolean) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
  setIconColor?: (color: string) => void;
  setGradient: (gradient: string) => void;
  setTextStyle: (style: string) => void;
  saveEntry: () => Promise<void>;
  loadChallenge: () => void;
  applyChallenge: () => void;
  onDrawingToolSelect: (tool: string) => void;
  currentDrawingTool: string;
  onDrawingColorChange: (color: string) => void;
  currentDrawingColor: string;
  onClearDrawing: () => void;
  onBrushSizeChange: (size: number) => void;
  currentBrushSize: number;
  onStickerAdd: (stickerUrl: string) => void;
  onStickerResize: (size: number) => void;
  currentStickerSize: number;
  onIconAdd: (iconData: { url: string; style: 'outline' | 'color' }) => void;
  onBackgroundSelect: (image: string) => void;
  onFilterChange: (filter: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleResetToDefault: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function JournalEditorSidebar({
  textareaRef,
  currentEntry,
  dailyChallenge,
  selectedIconId,
  selectedStickerId,
  handlePrint,
  handleEmojiSelect,
  setShowEmailDialog,
  setText,
  setMood,
  setIsPublic,
  setFont,
  setFontSize,
  setFontWeight,
  setFontColor,
  setIconColor,
  setGradient,
  setTextStyle,
  saveEntry,
  loadChallenge,
  applyChallenge,
  onDrawingToolSelect,
  currentDrawingTool,
  onDrawingColorChange,
  currentDrawingColor,
  onClearDrawing,
  onBrushSizeChange,
  currentBrushSize,
  onStickerAdd,
  onStickerResize,
  currentStickerSize,
  onIconAdd,
  onBackgroundSelect,
  onFilterChange,
  handleUndo,
  handleRedo,
  handleResetToDefault,
  canUndo,
  canRedo,
}: JournalEditorSidebarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [stickerSearchQuery, setStickerSearchQuery] = useState('');
  const [stickerSize, setStickerSize] = useState(100);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    handleEmojiSelect(emojiData);
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-72 flex-none p-4 bg-gray-100 border-r border-gray-200 flex flex-col">
      <ScrollArea className="flex-1 space-y-4">
        <ProgressCard />

        <Tabs defaultValue="edit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="edit" className="text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="style" className="text-sm">
              <Palette className="h-4 w-4 mr-2" />
              Style
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4">
            <DailyChallenge
              dailyChallenge={dailyChallenge}
              loadChallenge={loadChallenge}
              applyChallenge={applyChallenge}
            />

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="public" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  Make Public
                </label>
                <Switch
                  id="public"
                  checked={currentEntry.isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              {currentEntry.isPublic && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This entry will be visible to other users.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            <MoodSelector setMood={setMood} />

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => setShowEmailDialog(true)}>
                <Send className="h-4 w-4 mr-2" />
                Send via Email
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <span className="mr-2">Emoji</span>
                    {showEmojiPicker ? 'Close' : 'Open'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] shadow-md border border-gray-200">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="light"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>
          <TabsContent value="style" className="space-y-4">
            <JournalStylingControls
              setFont={setFont}
              setFontSize={setFontSize}
              setFontWeight={setFontWeight}
              setFontColor={setFontColor}
              setGradient={setGradient}
              setTextStyle={setTextStyle}
            />

            <Separator />

            <BackgroundImageSelector onBackgroundSelect={onBackgroundSelect} />

            <Separator />

            <ImageFilterSelector onFilterChange={onFilterChange} />

            <Separator />

            <StickerSelector
              onStickerAdd={onStickerAdd}
              searchQuery={stickerSearchQuery}
              setSearchQuery={setStickerSearchQuery}
              onStickerResize={onStickerResize}
              currentStickerSize={currentStickerSize}
            />

            <Separator />

            <IconSelector
              onIconSelect={onIconAdd}
              selectedIconId={selectedIconId}
              onIconColorChange={setIconColor}
            />

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Drawing Tools</h4>
              <div className="flex gap-2">
                <Button
                  variant={currentDrawingTool === 'pen' ? 'default' : 'outline'}
                  onClick={() => onDrawingToolSelect('pen')}
                  className="w-1/2 text-xs"
                >
                  Pen
                </Button>
                <Button
                  variant={currentDrawingTool === 'eraser' ? 'default' : 'outline'}
                  onClick={() => onDrawingToolSelect('eraser')}
                  className="w-1/2 text-xs"
                >
                  Eraser
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="brushSize" className="text-sm font-medium">Brush Size:</label>
                <input
                  type="number"
                  id="brushSize"
                  className="w-16 h-8 p-2 border rounded text-sm"
                  value={currentBrushSize}
                  onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="drawingColor" className="text-sm font-medium">Color:</label>
                <input
                  type="color"
                  id="drawingColor"
                  className="h-8 w-12"
                  value={currentDrawingColor}
                  onChange={(e) => onDrawingColorChange(e.target.value)}
                />
              </div>
              <Button variant="destructive" className="w-full text-sm" onClick={onClearDrawing}>
                Clear Drawing
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      <div className="mt-4 space-x-2 flex justify-center">
        <Button variant="secondary" size="sm" onClick={handleUndo} disabled={!canUndo}>
          <Undo2 className="h-4 w-4 mr-2" />
          Undo
        </Button>
        <Button variant="secondary" size="sm" onClick={handleRedo} disabled={!canRedo}>
          <Redo2 className="h-4 w-4 mr-2" />
          Redo
        </Button>
        <Button variant="ghost" size="sm" onClick={handleResetToDefault}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <Button className="mt-4 w-full" onClick={saveEntry}>
        <Save className="h-4 w-4 mr-2" />
        Save Entry
      </Button>
    </div>
  );
}
