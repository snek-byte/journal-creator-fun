
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Printer,
  Save,
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = async () => {
    await saveEntry();
  };

  return (
    <div className="w-full lg:w-1/4 p-6 flex flex-col max-h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-2">
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

      <Card className="flex-grow overflow-auto">
        <CardContent className="pt-3 px-4 space-y-3">
          {/* Top row with challenge and emoji buttons */}
          <div className="flex justify-between">
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

          {/* Text input area */}
          <Textarea
            ref={textareaRef}
            value={currentEntry.text}
            onChange={handleTextChange}
            placeholder="Start writing your journal entry..."
            className="min-h-[140px] resize-none"
          />

          {/* Styling controls immediately after text area */}
          <div className="bg-slate-50 p-2 rounded-md -mx-1">
            <h3 className="text-xs font-medium mb-2 text-slate-600">Styling Options</h3>
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
          </div>

          {/* Public switch and Email button */}
          <div className="flex justify-between items-center">
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
              onClick={() => setShowEmailDialog(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </CardContent>
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
