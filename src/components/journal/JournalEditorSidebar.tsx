
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JournalStylingControls } from './JournalStylingControls';
import { MoodSelector } from './MoodSelector';
import { DailyChallenge } from './DailyChallenge';
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { BackgroundImageSelector } from './BackgroundImageSelector';
import { ImageFilterSelector } from './ImageFilterSelector';
import { DrawingLayer } from './DrawingLayer';
import { Save, Printer, Mail, Undo, Redo, RotateCcw, Camera, Palette, ImageIcon, Pencil, Filter } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import type { Mood, Sticker, Icon } from '@/types/journal';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';

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
    textStyle?: string;
    backgroundImage?: string;
    filter?: string;
  };
  dailyChallenge: any;
  selectedIconId: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emoji: any) => void;
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
  // New props for tool functions
  handleStickerAdd?: (sticker: Sticker) => void;
  handleIconAdd?: (icon: Icon) => void;
  handleIconUpdate?: (iconId: string, updates: Partial<Icon>) => void;
  handleBackgroundSelect?: (imageUrl: string) => void;
  handleDrawingChange?: (dataUrl: string) => void;
  handleFilterChange?: (filter: string) => void;
  drawing?: string;
}

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
  handleStickerAdd,
  handleIconAdd,
  handleIconUpdate,
  handleBackgroundSelect,
  handleDrawingChange,
  handleFilterChange,
  drawing,
}: JournalEditorSidebarProps) {
  const [activeTab, setActiveTab] = useState('write');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [toolsTab, setToolsTab] = useState<string | null>(null);

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

  const handleToolClick = (tool: string) => {
    setToolsTab(toolsTab === tool ? null : tool);
  };

  const handleEmojiPickerSelect = (emoji: any) => {
    if (handleEmojiSelect && emoji.native) {
      handleEmojiSelect({ emoji: emoji.native });
    }
  };

  return (
    <aside className="w-full lg:w-1/4 border-r p-4 flex flex-col h-auto lg:h-screen min-h-[400px] bg-background">
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
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 w-full">
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
              
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Add Emoji
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Picker 
                      data={data} 
                      onEmojiSelect={handleEmojiPickerSelect}
                      theme="light"
                      previewPosition="none"
                      skinTonePosition="none"
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

          <TabsContent value="style" className="mt-0 space-y-6">
            {/* Text Styling Section */}
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

            {/* Tools Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-tight">Tools</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  variant={toolsTab === 'stickers' ? 'default' : 'outline'}
                  className="flex flex-col items-center py-2"
                  onClick={() => handleToolClick('stickers')}
                >
                  <Camera className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">Stickers</span>
                </Button>
                
                <Button
                  variant={toolsTab === 'icons' ? 'default' : 'outline'}
                  className="flex flex-col items-center py-2"
                  onClick={() => handleToolClick('icons')}
                >
                  <Palette className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">Icons</span>
                </Button>
                
                <Button
                  variant={toolsTab === 'backgrounds' ? 'default' : 'outline'}
                  className="flex flex-col items-center py-2"
                  onClick={() => handleToolClick('backgrounds')}
                >
                  <ImageIcon className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">Backgrounds</span>
                </Button>
                
                <Button
                  variant={toolsTab === 'drawing' ? 'default' : 'outline'}
                  className="flex flex-col items-center py-2"
                  onClick={() => handleToolClick('drawing')}
                >
                  <Pencil className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">Drawing</span>
                </Button>
                
                <Button
                  variant={toolsTab === 'filters' ? 'default' : 'outline'}
                  className="flex flex-col items-center py-2"
                  onClick={() => handleToolClick('filters')}
                >
                  <Filter className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">Filters</span>
                </Button>
              </div>
              
              {toolsTab === 'stickers' && handleStickerAdd && (
                <div className="border rounded-md p-2">
                  <h3 className="text-[10px] font-medium mb-2">Stickers</h3>
                  <StickerSelector onStickerSelect={handleStickerAdd} />
                </div>
              )}
              
              {toolsTab === 'icons' && handleIconAdd && handleIconUpdate && (
                <div className="border rounded-md p-2">
                  <h3 className="text-[10px] font-medium mb-2">Icons</h3>
                  <IconSelector onIconSelect={handleIconAdd} />
                </div>
              )}
              
              {toolsTab === 'backgrounds' && handleBackgroundSelect && (
                <div className="border rounded-md p-2">
                  <h3 className="text-[10px] font-medium mb-2">Backgrounds</h3>
                  <BackgroundImageSelector onImageSelect={handleBackgroundSelect} />
                </div>
              )}
              
              {toolsTab === 'drawing' && handleDrawingChange && (
                <div className="border rounded-md p-2">
                  <h3 className="text-[10px] font-medium mb-2">Drawing Tool</h3>
                  <DrawingLayer 
                    width={300} 
                    height={300} 
                    onDrawingChange={handleDrawingChange}
                    initialDrawing={drawing}
                  />
                </div>
              )}
              
              {toolsTab === 'filters' && handleFilterChange && (
                <div className="border rounded-md p-2">
                  <h3 className="text-[10px] font-medium mb-2">Image Filters</h3>
                  <ImageFilterSelector 
                    onFilterSelect={handleFilterChange} 
                    currentFilter={currentEntry.filter || 'none'} 
                  />
                </div>
              )}
            </div>
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
