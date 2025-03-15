
import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useEditorStore } from '@/store/editorStore';

export function EmojiPicker() {
  const { insertEmoji } = useEditorStore();
  
  const handleEmojiSelect = (emojiData: any) => {
    console.log("Selected emoji:", emojiData);
    // Get the native emoji character
    if (emojiData.native) {
      insertEmoji(emojiData.native);
    } else if (emojiData.emoji) {
      insertEmoji(emojiData.emoji);
    }
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
