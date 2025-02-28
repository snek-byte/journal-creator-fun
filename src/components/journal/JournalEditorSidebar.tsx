
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Text,
  Send,
  Printer,
  Eye,
  EyeOff,
  Save,
  FileCheck,
  Undo,
  Redo,
  RotateCcw,
  Type,
  Move,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { JournalStylingControls } from "./JournalStylingControls";
import { DailyChallenge } from "./DailyChallenge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import EmojiPicker from "emoji-picker-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JournalEditorSidebarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  currentEntry: any;
  dailyChallenge: any;
  selectedIconId: string | null;
  selectedEmojiId: string | null;
  emojiMode: 'text' | 'graphic';
  handlePrint: () => void;
  handleEmojiPickerSelect: (emojiData: any) => void;
  toggleEmojiMode: () => void;
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
  handleRotateEmoji: (rotation: number) => void;
  saveEntry: () => Promise<void>;
  loadChallenge: () => void;
  applyChallenge: () => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  handleResetToDefault?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function JournalEditorSidebar({
  textareaRef,
  currentEntry,
  dailyChallenge,
  selectedIconId,
  selectedEmojiId,
  emojiMode,
  handlePrint,
  handleEmojiPickerSelect,
  toggleEmojiMode,
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
  handleRotateEmoji,
  saveEntry,
  loadChallenge,
  applyChallenge,
  handleUndo,
  handleRedo,
  handleResetToDefault,
  canUndo = false,
  canRedo = false,
}: JournalEditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("write");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = async () => {
    await saveEntry();
  };

  return (
    <div className="w-full lg:w-1/4 p-6 flex flex-col max-h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Journal</h1>
        <div className="flex gap-2">
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

      <Card className="flex-grow overflow-hidden">
        <Tabs
          defaultValue="write"
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="write">
              <Text className="h-4 w-4 mr-2" />
              Write
            </TabsTrigger>
            <TabsTrigger value="style">
              <Settings className="h-4 w-4 mr-2" />
              Style
            </TabsTrigger>
          </TabsList>

          <CardContent className="flex-grow overflow-auto pb-6">
            <TabsContent
              value="write"
              className="mt-0 h-full flex flex-col"
            >
              <div className="flex justify-between mb-3">
                <DailyChallenge
                  prompt={dailyChallenge?.prompt || ""}
                  onApply={applyChallenge}
                  onRefresh={loadChallenge}
                />

                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <div className="flex">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="rounded-r-none border-r-0"
                              onClick={toggleEmojiMode}
                            >
                              {emojiMode === 'text' ? <Type className="h-4 w-4" /> : <Move className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{emojiMode === 'text' ? 'Text Mode: Insert emoji in text' : 'Graphic Mode: Add emoji as movable object'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Button variant="outline" size="sm" className="rounded-l-none">
                        😊
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" className="w-full p-0">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        handleEmojiPickerSelect(emojiData);
                        setShowEmojiPicker(false);
                      }}
                      width="100%"
                      height={350}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Textarea
                ref={textareaRef}
                value={currentEntry.text}
                onChange={handleTextChange}
                placeholder="Start writing your journal entry..."
                className="min-h-[300px] flex-grow mb-3 resize-none"
              />

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={currentEntry.isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Make Public</Label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowEmailDialog(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-0 p-0">
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
                onEmojiRotate={handleRotateEmoji}
                selectedIconId={selectedIconId}
                selectedEmojiId={selectedEmojiId}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>

        <Button
          variant="default"
          className="flex-1"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}
