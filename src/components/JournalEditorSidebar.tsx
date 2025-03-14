import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrawingTools } from './journal/DrawingTools';
import { JournalStylingControls } from './journal/JournalStylingControls';
import { MoodSelector } from './journal/MoodSelector';
import { StickerSelector } from './journal/StickerSelector';
import { IconSelector } from './journal/IconSelector';
import { BackgroundImageSelector } from './journal/BackgroundImageSelector';
import { ImageFilterSelector } from './journal/ImageFilterSelector';
import { DailyChallenge } from './journal/DailyChallenge';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RotateCcw, RotateCw, Save, Printer, Send, ChevronDown, Undo, Redo } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import type { EmojiClickData } from 'emoji-picker-react';
import type { JournalEntry, Challenge } from '@/types/journal';
import { ImageUploader } from './journal/image-uploader/ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useJournalStore } from '@/store/journalStore';

interface JournalEditorSidebarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  currentEntry: JournalEntry;
  dailyChallenge: Challenge | null;
  selectedIconId?: string | null;
  selectedStickerId?: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emoji: EmojiClickData) => void;
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
  onStickerAdd: (url: string) => void;
  onStickerResize?: (size: number) => void;
  currentStickerSize?: number;
  onIconAdd: (icon: { url: string, style: 'outline' | 'color' }) => void;
  onBackgroundSelect: (url: string) => void;
  onFilterChange: (filter: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleResetToDefault: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDrawingMode: boolean;
  onDrawingModeToggle: (enabled: boolean) => void;
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
  isDrawingMode,
  onDrawingModeToggle
}: JournalEditorSidebarProps) {
  const [selectedTab, setSelectedTab] = useState('write');
  const journal = useJournalStore();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleImageSelect = (url: string) => {
    onBackgroundSelect(url);
  };

  const onUndoButton = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const state = { ...journal.currentEntry };
      console.log("UNDO: Current state before:", state);
      
      handleUndo();
      
      console.log("UNDO: Current state after:", journal.currentEntry);
      toast.success("Undo successful");
    } catch (error) {
      console.error("Error during undo:", error);
      toast.error("Undo failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const onRedoButton = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const state = { ...journal.currentEntry };
      console.log("REDO: Current state before:", state);
      
      handleRedo();
      
      console.log("REDO: Current state after:", journal.currentEntry);
      toast.success("Redo successful");
    } catch (error) {
      console.error("Error during redo:", error);
      toast.error("Redo failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };
  
  return (
    <div className="p-4 w-full lg:w-96 border-r bg-white">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xl font-semibold">Journal</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onUndoButton}
            disabled={!canUndo}
            title="Undo"
            className="h-8 w-8"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRedoButton}
            disabled={!canRedo}
            title="Redo"
            className="h-8 w-8"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrint}
            className="h-8 w-8"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowEmailDialog(true)}
            className="h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            onClick={saveEntry}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="write" 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="draw">Draw</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-150px)]">
          <TabsContent value="write" className="space-y-4 pr-4">
            {dailyChallenge && (
              <DailyChallenge 
                dailyChallenge={dailyChallenge} 
                onApply={applyChallenge}
                onRefresh={loadChallenge}
              />
            )}
          
            <Textarea
              ref={textareaRef}
              className="min-h-[200px] resize-none"
              placeholder="What's on your mind today..."
              value={currentEntry.text}
              onChange={handleTextChange}
            />

            <div className="flex justify-between">
              <div className="space-y-1">
                <Label htmlFor="public" className="text-xs">Make Public</Label>
                <Switch
                  id="public"
                  checked={currentEntry.isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8">
                    Emoji <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="end">
                  <Picker 
                    data={data} 
                    onEmojiSelect={handleEmojiSelect}
                    previewPosition="none"
                    skinTonePosition="none"
                    theme="light"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <MoodSelector 
              selectedMood={currentEntry.mood} 
              onMoodSelect={setMood} 
            />
            
            <Button 
              variant="outline" 
              onClick={handleResetToDefault} 
              className="w-full h-8 text-xs m-0 mb-0"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset to Default
            </Button>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4 pr-4">
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
            
            <Separator className="my-4" />
            
            <BackgroundImageSelector onBackgroundSelect={onBackgroundSelect} />
            
            <Separator className="my-4" />
            
            <ImageFilterSelector 
              currentFilter={currentEntry.filter || 'none'} 
              onFilterChange={onFilterChange} 
            />
            
            <Separator className="my-4" />
            
            <StickerSelector 
              onStickerSelect={onStickerAdd} 
              onStickerResize={onStickerResize}
              currentStickerSize={currentStickerSize}
              selectedStickerId={selectedStickerId}
            />
            
            <Separator className="my-4" />
            
            <IconSelector 
              onIconSelect={onIconAdd}
              selectedIconId={selectedIconId}
              iconOptions={{
                color: selectedIconId && currentEntry.icons.find(i => i.id === selectedIconId)?.color || '#000000',
                size: selectedIconId && currentEntry.icons.find(i => i.id === selectedIconId)?.size || 48
              }}
              onIconUpdate={(updates) => {
                if (selectedIconId) {
                  if (updates.color) {
                    setFontColor(updates.color);
                  }
                  if (updates.size) {
                    setFontSize(`${updates.size}px`);
                  }
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="draw" className="space-y-4 pr-4">
            <DrawingTools 
              onToolSelect={onDrawingToolSelect}
              currentTool={currentDrawingTool}
              onColorChange={onDrawingColorChange}
              currentColor={currentDrawingColor}
              onClear={onClearDrawing}
              onBrushSizeChange={onBrushSizeChange}
              currentBrushSize={currentBrushSize}
              isDrawingMode={isDrawingMode}
              onDrawingModeToggle={onDrawingModeToggle}
            />
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-tight">Upload Image</h3>
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
