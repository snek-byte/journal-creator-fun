
import { useState, useRef, useEffect } from 'react';
import { useJournalStore } from '@/store/journalStore';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Mood, Sticker, Icon } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';

export function useJournalEditor() {
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
    setBackgroundImage,
    setDrawing,
    setFilter,
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
    try {
      loadChallenge();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setEmailAddress(user.email);
        }
      });
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleStickerAdd = (sticker: Sticker) => {
    try {
      addSticker(sticker);
    } catch (error) {
      console.error("Error adding sticker:", error);
    }
  };

  const handleIconAdd = (icon: Icon) => {
    try {
      addIcon(icon);
      toast.success('Icon added! Drag it to position on your journal.');
    } catch (error) {
      console.error("Error adding icon:", error);
    }
  };

  const handleStickerMove = (stickerId: string, position: { x: number, y: number }) => {
    try {
      setStickers(
        (currentEntry.stickers || []).map(s => 
          s.id === stickerId ? { ...s, position } : s
        )
      );
    } catch (error) {
      console.error("Error moving sticker:", error);
    }
  };

  const handleIconMove = (iconId: string, position: { x: number, y: number }) => {
    try {
      setIcons(
        (currentEntry.icons || []).map(i => 
          i.id === iconId ? { ...i, position } : i
        )
      );
    } catch (error) {
      console.error("Error moving icon:", error);
    }
  };

  const handleIconUpdate = (iconId: string, updates: Partial<Icon>) => {
    try {
      updateIcon(iconId, updates);
    } catch (error) {
      console.error("Error updating icon:", error);
    }
  };

  const handleTextMove = (position: { x: number, y: number }) => {
    try {
      setTextPosition(position);
    } catch (error) {
      console.error("Error moving text:", error);
    }
  };

  const handleBackgroundSelect = (imageUrl: string) => {
    try {
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error("Error selecting background:", error);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    try {
      setDrawing(dataUrl);
    } catch (error) {
      console.error("Error updating drawing:", error);
    }
  };

  const handleFilterChange = (filterId: string) => {
    try {
      setFilter(filterId);
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    try {
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
    } catch (error) {
      console.error("Error selecting emoji:", error);
    }
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

  return {
    currentEntry,
    showPreview,
    dailyChallenge,
    showEmailDialog,
    emailAddress,
    isSending,
    textareaRef,
    handlePrint,
    handleStickerAdd,
    handleIconAdd,
    handleStickerMove,
    handleIconMove,
    handleIconUpdate,
    handleTextMove,
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleEmojiSelect,
    handleSendEmail,
    setShowEmailDialog,
    setEmailAddress,
    setMood,
    setIsPublic,
    setText,
    togglePreview,
    saveEntry,
    applyChallenge,
    loadChallenge,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setTextStyle
  };
}
