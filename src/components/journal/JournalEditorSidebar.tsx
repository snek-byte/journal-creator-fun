
import React, { useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import EmojiPicker from 'emoji-picker-react';
import { ProgressCard } from './ProgressCard';
import { toast } from "sonner";
import { JournalEntry, Challenge, TextBox } from '@/types/journal';

interface JournalEditorSidebarProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  currentEntry: JournalEntry;
  dailyChallenge: Challenge | null;
  selectedIconId: string | null;
  selectedStickerId: string | null;
  selectedTextBoxId?: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emojiData: any) => void;
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
  onTextBoxAdd: () => void;
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
    <div className="w-full lg:w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <ProgressCard />
        </div>
        <Tabs defaultValue="write" className="flex flex-col h-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="m-4 grid grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="stickers" className="text-xs">Stickers</TabsTrigger>
            <TabsTrigger value="icons" className="text-xs">Icons</TabsTrigger>
            <TabsTrigger value="drawing" className="text-xs">Drawing</TabsTrigger>
            <TabsTrigger value="background" className="text-xs">Background</TabsTrigger>
            <TabsTrigger value="filter" className="text-xs">Filter</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="space-y-4 px-4">
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
              <div className="max-w-full overflow-hidden">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width="100%"
                  height={350}
                />
              </div>
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
            {dailyChallenge && (
              <div className="bg-muted p-3 rounded">
                <h3 className="text-sm font-medium mb-1">Daily Challenge</h3>
                <p className="text-xs mb-2">{dailyChallenge.prompt}</p>
                <div className="flex justify-between">
                  <Button size="sm" variant="outline" onClick={loadChallenge}>
                    New Challenge
                  </Button>
                  <Button size="sm" onClick={applyChallenge}>
                    Apply
                  </Button>
                </div>
              </div>
            )}
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
            <Button variant="destructive" size="sm" onClick={handleResetToDefault} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Default
            </Button>
            <Button variant="secondary" size="sm" onClick={onTextBoxAdd} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Text Box
            </Button>
          </TabsContent>
          <TabsContent value="style" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="font">Font</Label>
                <select id="font" className="w-full p-2 border rounded" value={currentEntry.font} onChange={(e) => setFont(e.target.value)}>
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="cursive">Cursive</option>
                  <option value="fantasy">Fantasy</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <select id="fontSize" className="w-full p-2 border rounded" value={currentEntry.fontSize} onChange={(e) => setFontSize(e.target.value)}>
                  <option value="12px">Small</option>
                  <option value="16px">Medium</option>
                  <option value="20px">Large</option>
                  <option value="24px">Extra Large</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontWeight">Font Weight</Label>
                <select id="fontWeight" className="w-full p-2 border rounded" value={currentEntry.fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontColor">Font Color</Label>
                <input type="color" id="fontColor" className="w-full h-10" value={currentEntry.fontColor} onChange={(e) => setFontColor(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textStyle">Text Style</Label>
                <select id="textStyle" className="w-full p-2 border rounded" value={currentEntry.textStyle} onChange={(e) => setTextStyle(e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="underline">Underline</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="mood">Mood</Label>
              <div className="grid grid-cols-4 gap-2">
                {['happy', 'sad', 'angry', 'excited', 'calm', 'tired', 'anxious', 'content'].map((mood) => (
                  <Button 
                    key={mood}
                    variant={currentEntry.mood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMood(mood)}
                    className="capitalize"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Label htmlFor="public">Public</Label>
              <Switch id="public" checked={currentEntry.isPublic} onCheckedChange={setIsPublic} />
            </div>
          </TabsContent>
          <TabsContent value="stickers" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stickerSize">Sticker Size</Label>
                <input 
                  type="range" 
                  id="stickerSize" 
                  min="30" 
                  max="200" 
                  value={currentStickerSize} 
                  onChange={(e) => onStickerResize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-xs">{currentStickerSize}px</div>
              </div>
              
              <div className="space-y-2">
                <Label>Stickers</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    '/stickers/heart.svg',
                    '/stickers/star.svg',
                    '/stickers/happy.svg',
                    '/stickers/sad.svg',
                    '/stickers/thumbsup.svg',
                    '/stickers/camera.svg',
                    '/stickers/cake.svg',
                    '/stickers/gift.svg'
                  ].map((sticker) => (
                    <Button 
                      key={sticker}
                      variant="outline"
                      size="sm"
                      className="p-1 h-16 flex items-center justify-center"
                      onClick={() => onStickerAdd(sticker)}
                    >
                      <img src={sticker} alt="sticker" className="w-full h-full object-contain" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="icons" className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Icons</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { url: '/icons/heart.svg', style: 'outline' },
                    { url: '/icons/star.svg', style: 'outline' },
                    { url: '/icons/smiley.svg', style: 'outline' },
                    { url: '/icons/flag.svg', style: 'outline' },
                    { url: '/icons/heart.svg', style: 'color' },
                    { url: '/icons/star.svg', style: 'color' },
                    { url: '/icons/smiley.svg', style: 'color' },
                    { url: '/icons/flag.svg', style: 'color' }
                  ].map((icon, index) => (
                    <Button 
                      key={`${icon.url}-${icon.style}-${index}`}
                      variant="outline"
                      size="sm"
                      className="p-1 h-16 flex items-center justify-center"
                      onClick={() => onIconAdd({ url: icon.url, style: icon.style as 'outline' | 'color' })}
                    >
                      <div className={`w-full h-full ${icon.style === 'color' ? 'text-red-500' : 'text-black'}`}>
                        <img src={icon.url} alt="icon" className="w-full h-full object-contain" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedIconId && (
                <div className="space-y-2">
                  <Label htmlFor="iconSize">Icon Size</Label>
                  <input 
                    type="range" 
                    id="iconSize" 
                    min="16" 
                    max="96" 
                    value={parseInt(currentEntry.fontSize) || 24}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full"
                  />
                  <div className="text-right text-xs">{parseInt(currentEntry.fontSize) || 24}px</div>
                  
                  <Label htmlFor="iconColor">Icon Color</Label>
                  <input 
                    type="color" 
                    id="iconColor" 
                    value={currentEntry.fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-full h-10" 
                  />
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="drawing" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="drawing-mode">Drawing Mode</Label>
                <Switch 
                  id="drawing-mode" 
                  checked={isDrawingMode} 
                  onCheckedChange={onDrawingModeToggle}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Drawing Tools</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pen', name: 'Pen' },
                    { id: 'marker', name: 'Marker' },
                    { id: 'highlighter', name: 'Highlighter' },
                    { id: 'eraser', name: 'Eraser' },
                    { id: 'spray', name: 'Spray' },
                    { id: 'fill', name: 'Fill' }
                  ].map((tool) => (
                    <Button 
                      key={tool.id}
                      variant={currentDrawingTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onDrawingToolSelect(tool.id)}
                    >
                      {tool.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="drawingColor">Color</Label>
                <input 
                  type="color" 
                  id="drawingColor" 
                  value={currentDrawingColor}
                  onChange={(e) => onDrawingColorChange(e.target.value)}
                  className="w-full h-10" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brushSize">Brush Size: {currentBrushSize}px</Label>
                <input 
                  type="range" 
                  id="brushSize" 
                  min="1" 
                  max="20" 
                  value={currentBrushSize}
                  onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                  className="w-full" 
                />
              </div>
              
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onClearDrawing}
                className="w-full"
              >
                Clear Drawing
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="background" className="p-4">
            <div className="space-y-4">
              <Label>Background Images</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
                  'https://images.unsplash.com/photo-1496062031456-07b8f162a322',
                  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5',
                  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107',
                  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
                ].map((bg, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    className="h-16 p-0 overflow-hidden"
                    onClick={() => onBackgroundSelect(bg)}
                  >
                    <div 
                      className="w-full h-full" 
                      style={{ 
                        background: bg.includes('http') ? `url(${bg})` : bg,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onBackgroundSelect('')}
                className="w-full"
              >
                Remove Background
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="filter" className="p-4">
            <div className="space-y-4">
              <Label>Image Filters</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', name: 'None' },
                  { id: 'grayscale', name: 'Grayscale' },
                  { id: 'sepia', name: 'Sepia' },
                  { id: 'blur', name: 'Blur' },
                  { id: 'brightness', name: 'Bright' },
                  { id: 'contrast', name: 'Contrast' },
                  { id: 'invert', name: 'Invert' },
                  { id: 'saturate', name: 'Saturate' }
                ].map((filter) => (
                  <Button 
                    key={filter.id}
                    variant={currentEntry.filter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange(filter.id)}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
