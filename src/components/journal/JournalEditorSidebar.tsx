
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector } from './MoodSelector';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Mail, Share2, History, Star, BookOpenText, Palette, Printer } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fontOptions, fontSizes, fontWeights, gradients } from './config/editorConfig';
import { JournalStylingControls } from './JournalStylingControls';
import { DailyChallenge } from './DailyChallenge';
import { ProgressCard } from './ProgressCard';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import type { JournalEntry, Challenge, Mood } from '@/types/journal';

interface JournalEditorSidebarProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  currentEntry: {
    text: string;
    font: string;
    fontSize: string;
    fontWeight: string;
    fontColor: string;
    gradient: string;
    mood?: Mood;
    isPublic: boolean;
    textStyle: string;
  };
  dailyChallenge: Challenge | null;
  selectedIconId?: string | null;
  handlePrint: () => void;
  handleEmojiSelect: (emoji: EmojiClickData) => void;
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
  applyChallenge
}: JournalEditorSidebarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChangeFontSize = (size: string) => {
    setFontSize(size);
  };

  const handleChangeFontWeight = (weight: string) => {
    setFontWeight(weight);
  };

  const handleChangeFont = (font: string) => {
    setFont(font);
  };

  const handleChangeFontColor = (color: string) => {
    setFontColor(color);
  };

  const handleChangeGradient = (gradient: string) => {
    setGradient(gradient);
  };

  const handleChangeTextStyle = (style: string) => {
    setTextStyle(style);
  };

  return (
    <div className="w-full lg:w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="write" className="flex-1">Write</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="space-y-4">
          <DailyChallenge 
            dailyChallenge={dailyChallenge} 
            onRefresh={loadChallenge}
            onApply={applyChallenge}
          />
          
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Start writing your journal entry..."
              value={currentEntry.text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none p-3"
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 p-0"
              >
                😊
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-10 right-0 z-10">
                  <EmojiPicker 
                    onEmojiClick={emoji => {
                      handleEmojiSelect(emoji);
                      setShowEmojiPicker(false);
                    }}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <MoodSelector 
              mood={currentEntry.mood} 
              isPublic={currentEntry.isPublic}
              onMoodChange={setMood}
              onIsPublicChange={setIsPublic}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="public"
              checked={currentEntry.isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Make Entry Public</Label>
          </div>
          
          <div className="pt-4 flex flex-col gap-3">
            <Button onClick={saveEntry} className="w-full" size="lg">
              Save Journal Entry
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowEmailDialog(true)}
                className="flex-1"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
                className="flex-1"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          {selectedIconId && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <h3 className="font-semibold text-amber-700 mb-1">Icon Editing Mode</h3>
              <p className="text-sm text-amber-600 mb-1">
                • Use the font size control to resize the selected icon
              </p>
              <p className="text-sm text-amber-600">
                • Press the Delete key to remove the selected icon
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label>{selectedIconId ? "Icon Size" : "Font Size"}</Label>
              <Select value={currentEntry.fontSize} onValueChange={handleChangeFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fontSizes.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {!selectedIconId && (
              <>
                <div>
                  <Label>Font</Label>
                  <Select value={currentEntry.font} onValueChange={handleChangeFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fontOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Font Weight</Label>
                  <Select value={currentEntry.fontWeight} onValueChange={handleChangeFontWeight}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fontWeights.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div>
              <Label>{selectedIconId ? "Icon Color" : "Text Color"}</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {['#000000', '#FF5555', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#6B7280', '#FFFFFF', '#EF4444'].map(color => (
                  <div
                    key={color}
                    className={`h-6 w-6 rounded-full cursor-pointer border ${
                      currentEntry.fontColor === color ? 'ring-2 ring-offset-2 ring-primary' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChangeFontColor(color)}
                  />
                ))}
              </div>
            </div>
            
            {!selectedIconId && (
              <div>
                <Label>Background</Label>
                <ScrollArea className="h-40 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {gradients.map(gradient => (
                      <div
                        key={gradient.value}
                        className={`h-14 rounded-md cursor-pointer border ${
                          currentEntry.gradient === gradient.value ? 'ring-2 ring-primary' : 'border-gray-200'
                        }`}
                        style={{ background: gradient.value }}
                        onClick={() => handleChangeGradient(gradient.value)}
                      >
                        <div className="p-1 bg-white/70 text-xs font-medium rounded-sm m-1 w-fit">
                          {gradient.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            <JournalStylingControls 
              font={currentEntry.font}
              fontSize={currentEntry.fontSize}
              fontWeight={currentEntry.fontWeight}
              fontColor={currentEntry.fontColor}
              gradient={currentEntry.gradient}
              onFontChange={handleChangeFont}
              onFontSizeChange={handleChangeFontSize}
              onFontWeightChange={handleChangeFontWeight}
              onFontColorChange={handleChangeFontColor}
              onGradientChange={handleChangeGradient}
              onTextStyleChange={handleChangeTextStyle}
              selectedIconId={selectedIconId}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <ProgressCard />
          
          <div className="space-y-2 mt-4">
            <h3 className="font-medium text-lg">Achievements</h3>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Star className="w-5 h-5 mr-3 text-yellow-500" />
                <div>
                  <p className="font-medium">Journal Streak</p>
                  <p className="text-sm text-gray-500">Write daily to earn rewards</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <BookOpenText className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">Entry Count</p>
                  <p className="text-sm text-gray-500">Write more entries to level up</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Palette className="w-5 h-5 mr-3 text-purple-500" />
                <div>
                  <p className="font-medium">Creativity Score</p>
                  <p className="text-sm text-gray-500">Use more features to increase</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <h3 className="font-medium text-lg">History</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <History className="mr-2 h-4 w-4" />
                View Past Entries
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
