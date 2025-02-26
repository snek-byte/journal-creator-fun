
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useJournalStore } from '@/store/journalStore';
import { useEffect, useRef, useState } from 'react';
import { Printer, Lightbulb, RotateCw, Smile, Mail } from 'lucide-react';
import { MoodSelector } from './journal/MoodSelector';
import { JournalStylingControls } from './journal/JournalStylingControls';
import { JournalPreview } from './journal/JournalPreview';
import { StickerSelector } from './journal/StickerSelector';
import type { Mood, Sticker } from '@/types/journal';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function JournalEditor() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
    setText,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setMood,
    setIsPublic,
    setTextStyle,
    setStickers,
    togglePreview,
    saveEntry,
    loadChallenge,
    applyChallenge,
  } = useJournalStore();

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    loadChallenge();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmailAddress(user.email);
      }
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleStickerAdd = (sticker: Sticker) => {
    setStickers([...(currentEntry.stickers || []), sticker]);
  };

  const handleStickerMove = (stickerId: string, position: { x: number, y: number }) => {
    setStickers(
      (currentEntry.stickers || []).map(s => 
        s.id === stickerId ? { ...s, position } : s
      )
    );
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = currentEntry.text;
    
    const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
    setText(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + emojiData.emoji.length;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      toast.error("Please enter an email address");
      return;
    }

    if (!currentEntry.text.trim()) {
      toast.error("Please write something in your journal before sending");
      return;
    }

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to send emails");
        return;
      }

      const response = await supabase.functions.invoke('send-journal', {
        body: {
          to: emailAddress,
          text: currentEntry.text,
          mood: currentEntry.mood,
          date: new Date().toISOString(),
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Journal entry sent to your email!");
      setShowEmailDialog(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="w-full lg:w-1/3 p-6 border-r bg-white print:hidden">
        <div className="space-y-6">
          {dailyChallenge && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-medium">Daily Challenge</h3>
                </div>
                <span className="text-sm font-medium text-yellow-800">+20 XP</span>
              </div>
              <div className="flex items-start gap-2 mb-4">
                <button 
                  onClick={loadChallenge}
                  className="text-yellow-600 hover:text-yellow-700 transition-colors mt-0.5"
                  title="Get a new prompt"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <p className="text-gray-600">{dailyChallenge.prompt}</p>
              </div>
              <Button 
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                variant="ghost"
                onClick={applyChallenge}
              >
                Use This Prompt
              </Button>
            </div>
          )}

          <div className="rounded-lg border border-pink-200 bg-pink-50/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="font-medium">Progress</h3>
              </div>
              <span className="text-sm font-medium">0 XP</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span>0 days</span>
              </div>
              <div className="flex justify-between">
                <span>Total Entries:</span>
                <span>0</span>
              </div>
            </div>
          </div>

          <MoodSelector
            mood={currentEntry.mood}
            isPublic={currentEntry.isPublic}
            onMoodChange={(mood: Mood) => setMood(mood)}
            onIsPublicChange={setIsPublic}
          />

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
          />

          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="end">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width="100%"
                    height={400}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Textarea
              ref={textareaRef}
              placeholder="Start writing your journal entry..."
              value={currentEntry.text}
              onChange={(e) => setText(e.target.value)}
              onSelect={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setCursorPosition(target.selectionStart);
              }}
              className="min-h-[200px] resize-none pr-10"
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={saveEntry} className="flex-1">
              Save Entry
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={() => setShowEmailDialog(true)} 
              variant="outline" 
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Journal Entry</DialogTitle>
            <DialogDescription>
              Send this journal entry to your email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <JournalPreview
        showPreview={showPreview}
        text={currentEntry.text}
        mood={currentEntry.mood}
        font={currentEntry.font}
        fontSize={currentEntry.fontSize}
        fontWeight={currentEntry.fontWeight}
        fontColor={currentEntry.fontColor}
        gradient={currentEntry.gradient}
        textStyle={currentEntry.textStyle}
        stickers={currentEntry.stickers || []}
        onStickerAdd={handleStickerAdd}
        onStickerMove={handleStickerMove}
        onTogglePreview={togglePreview}
      />
    </div>
  );
}
