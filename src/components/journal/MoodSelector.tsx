
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface MoodSelectorProps {
  mood: string | null;
  onSelect: (mood: string) => void;
}

const moods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "tired", emoji: "😴", label: "Tired" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "angry", emoji: "😠", label: "Angry" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "inspired", emoji: "🌟", label: "Inspired" },
  { id: "focused", emoji: "🧠", label: "Focused" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "confused", emoji: "😕", label: "Confused" },
  { id: "loving", emoji: "❤️", label: "Loving" },
];

export function MoodSelector({ mood, onSelect }: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">How are you feeling today?</h3>
        <div className="grid grid-cols-3 gap-2">
          {moods.map((item) => (
            <Button
              key={item.id}
              variant={mood === item.id ? "default" : "outline"}
              className="flex flex-col items-center justify-center py-3 h-auto"
              onClick={() => onSelect(item.id)}
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Tracking your mood helps you understand patterns in your emotional wellbeing over time.
        </p>
      </div>
    </div>
  );
}
