
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { JournalStylingControls } from './JournalStylingControls';
import { MoodSelector } from './MoodSelector';
import { DailyChallenge } from './DailyChallenge';
import { Save, Printer, Mail } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import type { Mood } from '@/types/journal';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';
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
    <aside className="w-full lg:w-1/4 border-r p-4 flex flex-col h-auto lg:h-screen min-h-[400px] bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="write" className="flex-1">Write</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          <TabsTrigger value="publish" className="flex-1">Publish</TabsTrigger>
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

          <TabsContent value="style" className="mt-0 space-y-4">
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
          </TabsContent>

          <TabsContent value="publish" className="mt-0 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-medium">Public Entry</label>
                <Switch 
                  checked={currentEntry.isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Make your entry visible to other users
              </p>
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
