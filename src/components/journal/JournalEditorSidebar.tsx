
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { JournalStylingControls } from './JournalStylingControls';
import { MoodSelector } from './MoodSelector';
import { DailyChallenge } from './DailyChallenge';
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { BackgroundImageSelector } from './BackgroundImageSelector';
import { ImageFilterSelector } from './ImageFilterSelector';
import { Save, Printer, Mail, Undo, Redo, RotateCcw, Paintbrush, Eraser, PaintBucket, CircleDashed, Pencil, Highlighter, Trash2 } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import type { Mood, Sticker, Icon } from '@/types/journal';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { gradients } from './config/editorConfig';

interface JournalEditorSidebarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  currentEntry: {
    text: string;
    font: string;
    fontSize: string;
    fontWeight: string;
    fontColor: string;
    gradient: string;
    mood?: Mood;
    isPublic: boolean;
  };
  dailyChallenge: any;
  selectedIconId: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emojiData: EmojiClickData) => void;
  setShowEmailDialog: (show: boolean) => void;
  setText: (text: string) => void;
  setMood: (mood: Mood) => void;
  setIsPublic: (isPublic: boolean) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
  setGradient: (gradient: string) => void;
  setTextStyle: (style: string) => void;
  saveEntry: () => void;
  loadChallenge: () => void;
  applyChallenge: () => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  handleResetToDefault?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onDrawingToolSelect?: (tool: string) => void;
  currentDrawingTool?: string;
  onDrawingColorChange?: (color: string) => void;
  currentDrawingColor?: string;
  onClearDrawing?: () => void;
  onBrushSizeChange?: (size: number) => void;
  currentBrushSize?: number;
  onStickerAdd?: (stickerUrl: string) => void;
  onIconAdd?: (icon: { url: string, style: 'outline' | 'color' }) => void;
  onBackgroundSelect?: (imageUrl: string) => void;
  onFilterChange?: (filter: string) => void;
}

// Drawing tool options with colors
const drawingTools = [
  { name: 'Pen', value: 'pen', icon: Pencil, color: '#9b87f5' },
  { name: 'Marker', value: 'marker', icon: Paintbrush, color: '#7E69AB' },
  { name: 'Highlighter', value: 'highlighter', icon: Highlighter, color: '#D6BCFA' },
  { name: 'Spray', value: 'spray', icon: CircleDashed, color: '#FEC6A1' },
  { name: 'Fill', value: 'fill', icon: PaintBucket, color: '#FDE1D3' },
  { name: 'Eraser', value: 'eraser', icon: Eraser, color: '#8E9196' },
];

// Drawing color palette
const drawingColors = [
  { value: '#000000', label: 'Black' },
  { value: '#1e40af', label: 'Blue' },
  { value: '#7e22ce', label: 'Purple' },
  { value: '#dc2626', label: 'Red' },
  { value: '#ea580c', label: 'Orange' },
  { value: '#ca8a04', label: 'Yellow' },
  { value: '#16a34a', label: 'Green' },
  { value: '#0d9488', label: 'Teal' },
];

// Brush sizes
const brushSizes = [2, 4, 6, 8];

export function JournalEditorSidebar({
  textareaRef,
  currentEntry,
  dailyChallenge,
  selectedIconId,
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
  handleUndo,
  handleRedo,
  handleResetToDefault,
  canUndo = false,
  canRedo = false,
  onDrawingToolSelect,
  currentDrawingTool = 'pen',
  onDrawingColorChange,
  currentDrawingColor = '#000000',
  onClearDrawing,
  onBrushSizeChange,
  currentBrushSize = 3,
  onStickerAdd,
  onIconAdd,
  onBackgroundSelect,
  onFilterChange,
}: JournalEditorSidebarProps) {
  const [activeTab, setActiveTab] = useState('write');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Recalculate word and character counts when text changes
  useEffect(() => {
    const text = currentEntry.text;
    setCharCount(text.length);
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
  }, [currentEntry.text]);

  // Switch to style tab when an icon is selected
  useEffect(() => {
    if (selectedIconId) {
      setActiveTab('style');
    }
  }, [selectedIconId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <aside className="w-full lg:w-96 border-r p-4 flex flex-col h-auto lg:h-screen min-h-[400px] bg-background overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Journal Editor</h2>
        <div className="flex gap-1">
          {handleUndo && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
          )}
          
          {handleRedo && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          )}
          
          {handleResetToDefault && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetToDefault}
              title="Reset to Default"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="write" className="flex-1">Write</TabsTrigger>
          <TabsTrigger value="decorate" className="flex-1">Decorate</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 w-full pr-2">
          {/* WRITING TAB - For text entry, mood selection, and now text styling */}
          <TabsContent value="write" className="mt-0 h-full flex flex-col gap-4">
            <div className="space-y-4">
              <MoodSelector 
                mood={currentEntry.mood} 
                isPublic={currentEntry.isPublic}
                onMoodChange={setMood}
                onIsPublicChange={setIsPublic}
              />
              
              <Textarea
                ref={textareaRef}
                placeholder="What's on your mind today?"
                value={currentEntry.text}
                onChange={handleTextChange}
                className="min-h-[200px] resize-none font-normal text-base"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{charCount} characters</span>
                <span>{wordCount} words</span>
              </div>
              
              {/* Text Styling Controls moved here */}
              <JournalStylingControls
                font={currentEntry.font}
                fontSize={currentEntry.fontSize}
                fontWeight={currentEntry.fontWeight}
                fontColor={currentEntry.fontColor}
                gradient={currentEntry.gradient}
                onFontChange={setFont}
                onFontSizeChange={setFontSize}
                onFontWeightChange={setFontWeight}
                onFontColorChange={setFontColor}
                onGradientChange={setGradient}
                onTextStyleChange={setTextStyle}
                selectedIconId={selectedIconId}
              />
              
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Add Emoji
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <EmojiPicker 
                      onEmojiClick={handleEmojiSelect}
                      width={300}
                      height={320}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <DailyChallenge
                dailyChallenge={dailyChallenge}
                onRefresh={loadChallenge}
                onApply={applyChallenge}
              />
            </div>
          </TabsContent>

          {/* DECORATE TAB - For stickers, icons, backgrounds, etc. */}
          <TabsContent value="decorate" className="mt-0 space-y-4">
            <Tabs defaultValue="stickers" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="stickers" className="text-[10px]">Stickers</TabsTrigger>
                <TabsTrigger value="icons" className="text-[10px]">Icons</TabsTrigger>
                <TabsTrigger value="background" className="text-[10px]">Background</TabsTrigger>
                <TabsTrigger value="drawing" className="text-[10px]">Drawing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stickers" className="mt-0">
                {onStickerAdd && (
                  <StickerSelector onStickerSelect={onStickerAdd} />
                )}
              </TabsContent>
              
              <TabsContent value="icons" className="mt-0">
                {onIconAdd && (
                  <IconSelector onIconSelect={onIconAdd} />
                )}
              </TabsContent>
              
              <TabsContent value="background" className="mt-0 space-y-4">
                {onBackgroundSelect && (
                  <BackgroundImageSelector onBackgroundSelect={onBackgroundSelect} />
                )}
                
                {onFilterChange && (
                  <div className="pt-4">
                    <ImageFilterSelector onFilterChange={onFilterChange} />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="drawing" className="mt-0 space-y-4">
                {/* Drawing Tools Section */}
                {onDrawingToolSelect && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold tracking-tight">Drawing Tools</h3>
                    
                    {/* Tool Selection */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-medium">Select Tool</Label>
                      <div className="flex flex-wrap gap-2">
                        {drawingTools.map((tool) => (
                          <button
                            key={tool.value}
                            onClick={() => onDrawingToolSelect(tool.value)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              currentDrawingTool === tool.value 
                                ? 'ring-2 ring-primary ring-offset-2' 
                                : 'hover:opacity-80'
                            }`}
                            style={{ backgroundColor: tool.color }}
                            title={tool.name}
                            type="button"
                          >
                            <tool.icon className="h-3.5 w-3.5 text-white" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Color Selection - Only for non-eraser tools */}
                    {currentDrawingTool !== 'eraser' && onDrawingColorChange && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-medium">Select Color</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {drawingColors.map((color) => (
                            <button
                              key={color.value}
                              className={`w-6 h-6 rounded-full ${
                                currentDrawingColor === color.value 
                                  ? 'ring-2 ring-black ring-offset-1' 
                                  : ''
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => onDrawingColorChange(color.value)}
                              title={color.label}
                              type="button"
                            />
                          ))}
                        </div>
                        
                        {/* Custom color picker */}
                        <input
                          type="color"
                          value={currentDrawingColor}
                          onChange={(e) => onDrawingColorChange(e.target.value)}
                          className="w-full h-8 rounded-md cursor-pointer mt-1"
                        />
                      </div>
                    )}
                    
                    {/* Brush Size Selection */}
                    {onBrushSizeChange && currentDrawingTool !== 'fill' && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-medium">Brush Size</Label>
                        <div className="flex justify-between gap-1.5">
                          {brushSizes.map((size) => (
                            <button
                              key={size}
                              className={`flex-1 h-8 rounded-md flex items-center justify-center ${
                                currentBrushSize === size 
                                  ? 'bg-primary/20 border border-primary' 
                                  : 'border border-gray-200'
                              }`}
                              onClick={() => onBrushSizeChange(size)}
                              type="button"
                            >
                              <div 
                                className="rounded-full"
                                style={{ 
                                  width: `${size * 2}px`, 
                                  height: `${size * 2}px`, 
                                  backgroundColor: currentDrawingTool === 'eraser' ? '#888' : currentDrawingColor 
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Clear Drawing Button */}
                    {onClearDrawing && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={onClearDrawing}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Clear Drawing
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </ScrollArea>

        <div className="h-[1px] w-full bg-border my-4"></div>
        
        <div className="flex gap-2 justify-between">
          <Button 
            onClick={saveEntry} 
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrint}
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowEmailDialog(true)}
            title="Email Entry"
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </Tabs>
    </aside>
  );
}
