import React, { useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JournalStylingControls } from "./JournalStylingControls";
import { DailyChallenge } from "./DailyChallenge";
import { StickerSelector } from "./StickerSelector";
import { IconSelector } from "./IconSelector";
import { MoodSelector } from "./MoodSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DrawingTools } from "./DrawingTools";
import { BackgroundImageSelector } from "./BackgroundImageSelector";
import { ImageFilterSelector } from "./ImageFilterSelector";
import { Undo, Redo, Save, RotateCcw, PlusCircle } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ProgressCard } from './ProgressCard';
import { toast } from "sonner";
import { JournalEntry, Challenge } from '@/types/journal';

interface JournalEditorSidebarProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  currentEntry: JournalEntry;
  dailyChallenge: Challenge | null;
  selectedIconId: string | null;
  selectedStickerId: string | null;
  selectedTextBoxId?: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emojiData: EmojiClickData) => void;
  setShowEmailDialog: (show: boolean) => void;
  setText: (text: string) => void;
  setMood: (mood: any) => void;
  setIsPublic: (isPublic: boolean) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
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
  onIconAdd: (iconData: { url: string, style: 'outline' | 'color' }) => void;
  onBackgroundSelect: (imageUrl: string) => void;
  onFilterChange: (filterId: string) => void;
  handleUndo: () => boolean;
  handleRedo: () => boolean;
  handleResetToDefault: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDrawingMode: boolean;
  onDrawingModeToggle: (enabled: boolean) => void;
  onTextBoxAdd?: () => void;
}

export function JournalEditorSidebar({
  textareaRef,
  currentEntry,
  dailyChallenge,
  selectedIconId,
  selectedStickerId,
  selectedTextBoxId,
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
  isDrawingMode,
  onDrawingModeToggle,
  onTextBoxAdd
}: JournalEditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("write");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSave = async () => {
    await saveEntry();
    toast.success("Journal entry saved!");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full lg:w-80 border-r border-gray-200 bg-white flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <ProgressCard />
        </div>
        <Tabs defaultValue="write" className="flex flex-col h-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="m-4">
            <TabsTrigger value="write" className="col-span-3 lg:col-span-1">Write</TabsTrigger>
            <TabsTrigger value="style" className="col-span-3 lg:col-span-1">Style</TabsTrigger>
            <TabsTrigger value="stickers" className="col-span-3 lg:col-span-1">Stickers</TabsTrigger>
            <TabsTrigger value="icons" className="col-span-3 lg:col-span-1">Icons</TabsTrigger>
            <TabsTrigger value="drawing" className="col-span-3 lg:col-span-1">Drawing</TabsTrigger>
            <TabsTrigger value="background" className="col-span-3 lg:col-span-1">Background</TabsTrigger>
            <TabsTrigger value="filter" className="col-span-3 lg:col-span-1">Filter</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="journal">Your Journal</Label>
              <Textarea
                id="journal"
                placeholder="Write about your day..."
                value={currentEntry.text}
                onChange={handleTextChange}
                ref={textareaRef}
                className="resize-none h-48"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => setShowEmailDialog(true)}>
                Email Me
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {showEmojiPicker ? 'Hide Emoji' : 'Show Emoji'}
              </Button>
            </div>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                theme="light"
                width={300}
                height={400}
              />
            )}
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
            <Separator />
            <DailyChallenge dailyChallenge={dailyChallenge} applyChallenge={applyChallenge} loadChallenge={loadChallenge} />
            <Separator />
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo}>
                <Undo className="mr-2 h-4 w-4" />
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo}>
                <Redo className="mr-2 h-4 w-4" />
                Redo
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={handleResetToDefault}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Default
            </Button>
            {onTextBoxAdd && (
              <Button variant="secondary" size="sm" onClick={onTextBoxAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Text Box
              </Button>
            )}
          </TabsContent>
          <TabsContent value="style">
            <JournalStylingControls
              setFont={setFont}
              setFontSize={setFontSize}
              setFontWeight={setFontWeight}
              setFontColor={setFontColor}
              setGradient={setGradient}
              setTextStyle={setTextStyle}
              selectedIconId={selectedIconId}
              selectedTextBoxId={selectedTextBoxId}
            />
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <MoodSelector setMood={setMood} />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="public">Public</Label>
              <Switch id="public" checked={currentEntry.isPublic} onCheckedChange={setIsPublic} />
            </div>
          </TabsContent>
          <TabsContent value="stickers">
            <StickerSelector onStickerAdd={onStickerAdd} onStickerResize={onStickerResize} currentStickerSize={currentStickerSize} />
          </TabsContent>
          <TabsContent value="icons">
            <IconSelector onIconAdd={onIconAdd} selectedIconId={selectedIconId} setFontSize={setFontSize} />
          </TabsContent>
          <TabsContent value="drawing">
            <DrawingTools
              onDrawingToolSelect={onDrawingToolSelect}
              currentDrawingTool={currentDrawingTool}
              onDrawingColorChange={onDrawingColorChange}
              currentDrawingColor={currentDrawingColor}
              onClearDrawing={onClearDrawing}
              onBrushSizeChange={onBrushSizeChange}
              currentBrushSize={currentBrushSize}
              isDrawingMode={isDrawingMode}
              onDrawingModeToggle={onDrawingModeToggle}
            />
          </TabsContent>
          <TabsContent value="background">
            <BackgroundImageSelector onBackgroundSelect={onBackgroundSelect} />
          </TabsContent>
          <TabsContent value="filter">
            <ImageFilterSelector onFilterChange={onFilterChange} />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
