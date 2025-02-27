
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useJournalStore } from '@/store/journalStore';
import { useEffect, useRef, useState } from 'react';
import { Printer, Smile, Mail } from 'lucide-react';
import { MoodSelector } from './journal/MoodSelector';
import { JournalStylingControls } from './journal/JournalStylingControls';
import { JournalPreview } from './journal/JournalPreview';
import { StickerSelector } from './journal/StickerSelector';
import { EmailDialog } from './journal/EmailDialog';
import { ProgressCard } from './journal/ProgressCard';
import { DailyChallenge } from './journal/DailyChallenge';
import type { Mood, Sticker, Icon } from '@/types/journal';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    setIcons,
    setTextPosition,
    addSticker,
    addIcon,
    updateIcon,
    togglePreview,
    saveEntry,
    loadChallenge,
    applyChallenge,
  } = useJournalStore();

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
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
    addSticker(sticker);
  };

  const handleIconAdd = (icon: Icon) => {
    addIcon(icon);
  };

  const handleStickerMove = (stickerId: string, position: { x: number, y: number }) => {
    setStickers(
      (currentEntry.stickers || []).map(s => 
        s.id === stickerId ? { ...s, position } : s
      )
    );
  };

  const handleIconMove = (iconId: string, position: { x: number, y: number }) => {
    setIcons(
      (currentEntry.icons || []).map(i => 
        i.id === iconId ? { ...i, position } : i
      )
    );
  };

  const handleIconUpdate = (iconId: string, updates: Partial<Icon>) => {
    updateIcon(iconId, updates);
  };

  const handleTextMove = (position: { x: number, y: number }) => {
    setTextPosition(position);
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
            <DailyChallenge
              prompt={dailyChallenge.prompt}
              onRefresh={loadChallenge}
              onApply={applyChallenge}
            />
          )}

          <ProgressCard />

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

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        emailAddress={emailAddress}
        onEmailChange={setEmailAddress}
        onSend={handleSendEmail}
        isSending={isSending}
      />

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
        icons={currentEntry.icons || []}
        textPosition={currentEntry.textPosition || { x: 50, y: 50 }}
        onStickerAdd={handleStickerAdd}
        onIconAdd={handleIconAdd}
        onStickerMove={handleStickerMove}
        onIconMove={handleIconMove}
        onIconUpdate={handleIconUpdate}
        onTextMove={handleTextMove}
        onTogglePreview={togglePreview}
      />
    </div>
  );
}
