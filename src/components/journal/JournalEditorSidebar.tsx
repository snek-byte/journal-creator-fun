
import React, { useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoodSelector } from './MoodSelector';
import { JournalStylingControls } from './JournalStylingControls';
import { BackgroundImageSelector } from './BackgroundImageSelector';
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { DailyChallenge } from './DailyChallenge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { ImageFilterSelector } from './ImageFilterSelector';
import { Label } from '@/components/ui/label';
import {
  Save,
  Send,
  Printer,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Paintbrush,
  Edit,
  Smile,
  PanelRight,
  Sparkles,
  Check,
  Palette,
  Image,
  PaintBucket,
  Square,
  FileImage,
  Brush,
  EyeIcon,
  Wand2
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import type { Mood, DailyChallengeData, JournalEntry } from '@/types/journal';

interface JournalEditorSidebarProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  currentEntry: JournalEntry;
  dailyChallenge?: DailyChallengeData;
  selectedIconId?: string | null;
  selectedStickerId?: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emojiData: EmojiClickData) => void;
  setShowEmailDialog: (show: boolean) => void;
  setText: (text: string) => void;
  setMood: (mood?: Mood) => void;
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
  onIconAdd: (icon: { url: string, style: 'outline' | 'color' }) => void;
  onBackgroundSelect: (imageUrl: string) => void;
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
  const [activeTab, setActiveTab] = useState("write");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [showedWelcome, setShowedWelcome] = useState(false);
  
  // Update active tab based on selection
  React.useEffect(() => {
    // If an icon is selected, show the decorate tab
    if (selectedIconId) {
      setActiveTab("decorate");
    }
    
    // If a sticker is selected, show the decorate tab
    if (selectedStickerId) {
      setActiveTab("decorate");
      console.log("Setting activeTab to decorate because sticker is selected:", selectedStickerId);
    }
  }, [selectedIconId, selectedStickerId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = async () => {
    await saveEntry();
  };

  const handleEmail = () => {
    setShowEmailDialog(true);
  };

  return (
    <div className="w-full lg:max-w-96 p-4 border-r bg-background min-h-[50vh] lg:min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">My Journal</h1>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleResetToDefault}
            title="Reset to Default"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="write" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Write
          </TabsTrigger>
          <TabsTrigger value="style" className="flex-1">
            <Palette className="h-4 w-4 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="decorate" className="flex-1">
            <Sparkles className="h-4 w-4 mr-1" />
            Decorate
          </TabsTrigger>
          <TabsTrigger value="draw" className="flex-1">
            <Brush className="h-4 w-4 mr-1" />
            Draw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-4">
          {dailyChallenge && (
            <DailyChallenge 
              challenge={dailyChallenge} 
              onApply={applyChallenge}
              onRefresh={loadChallenge}
            />
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold tracking-tight">How are you feeling today?</span>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Public</span>
                <Switch 
                  checked={currentEntry.isPublic} 
                  onCheckedChange={setIsPublic} 
                />
              </div>
            </div>
            
            <MoodSelector 
              selectedMood={currentEntry.mood} 
              onMoodSelect={setMood} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="journal-text" className="text-xs font-semibold tracking-tight">
                Your thoughts
              </Label>
              
              <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="end">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => {
                      handleEmojiSelect(emojiData);
                      setEmojiPickerOpen(false);
                    }}
                    width="100%"
                    height={350}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Textarea 
              id="journal-text"
              ref={textareaRef}
              placeholder="Today I..."
              value={currentEntry.text}
              onChange={handleTextChange}
              className="resize-none h-48 focus-visible:ring-1"
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-20"
              onClick={handleEmail}
            >
              <Send className="h-4 w-4 mr-1" />
              Email
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-20"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="w-20"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <JournalStylingControls 
            font={currentEntry.font}
            fontSize={currentEntry.fontSize}
            fontWeight={currentEntry.fontWeight}
            fontColor={currentEntry.fontColor}
            gradient={currentEntry.gradient}
            selectedIconId={selectedIconId}
            onFontChange={setFont}
            onFontSizeChange={setFontSize}
            onFontWeightChange={setFontWeight}
            onFontColorChange={setFontColor}
            onGradientChange={setGradient}
            onTextStyleChange={setTextStyle}
          />
          
          <div className="space-y-4 pt-4">
            <BackgroundImageSelector
              onBackgroundSelect={onBackgroundSelect}
            />
          </div>
          
          <div className="space-y-4 pt-4">
            <ImageFilterSelector
              onFilterChange={onFilterChange}
              currentFilter={currentEntry.filter || 'none'}
            />
          </div>
        </TabsContent>

        <TabsContent value="decorate" className="space-y-4">
          <div className="space-y-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-8">
                <StickerSelector 
                  onStickerSelect={onStickerAdd}
                  onStickerResize={onStickerResize}
                  currentStickerSize={currentStickerSize}
                  selectedStickerId={selectedStickerId}
                />
                
                <IconSelector 
                  onIconSelect={onIconAdd}
                  selectedIconId={selectedIconId}
                  iconOptions={
                    selectedIconId && currentEntry.icons 
                      ? {
                          color: currentEntry.icons.find(i => i.id === selectedIconId)?.color || '#000000',
                          size: currentEntry.icons.find(i => i.id === selectedIconId)?.size || 48
                        }
                      : undefined
                  }
                  onIconUpdate={
                    selectedIconId 
                      ? (updates) => {
                          const { color, size } = updates;
                          if (color) setFontColor(color); // Use fontColor setter for icon color
                          if (size) setFontSize(`${size}px`); // Use fontSize setter for icon size
                        }
                      : undefined
                  }
                />
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="draw" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold tracking-tight mb-2">Drawing Tools</h3>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={currentDrawingTool === 'pen' ? "default" : "outline"}
                  className="h-10 p-0"
                  onClick={() => onDrawingToolSelect('pen')}
                >
                  <Paintbrush className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentDrawingTool === 'line' ? "default" : "outline"}
                  className="h-10 p-0"
                  onClick={() => onDrawingToolSelect('line')}
                >
                  <PanelRight className="h-4 w-4 -rotate-45" />
                </Button>
                <Button
                  variant={currentDrawingTool === 'rectangle' ? "default" : "outline"}
                  className="h-10 p-0"
                  onClick={() => onDrawingToolSelect('rectangle')}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-10 p-0"
                  onClick={onClearDrawing}
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-tight">Drawing Color</h3>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map((color) => (
                  <button
                    key={color}
                    className={`w-full h-8 rounded-md ${currentDrawingColor === color ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onDrawingColorChange(color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold tracking-tight">Brush Size</h3>
                <span className="text-xs">{currentBrushSize}px</span>
              </div>
              <div className="flex space-x-4 items-center">
                <span className="text-xs">1px</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={currentBrushSize}
                  onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs">20px</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
