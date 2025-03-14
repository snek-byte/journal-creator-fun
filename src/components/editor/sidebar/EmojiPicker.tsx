
import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import type { EmojiClickData } from 'emoji-picker-react';
import { useEditorStore } from '@/store/editorStore';

export function EmojiPicker() {
  const { insertEmoji } = useEditorStore();
  
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    insertEmoji(emojiData.emoji);
  };
  
  return (
    <div className="py-2">
      <Picker 
        data={data} 
        onEmojiSelect={handleEmojiSelect}
        previewPosition="none"
        skinTonePosition="none"
        theme="light"
      />
    </div>
  );
}
