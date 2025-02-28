
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { moodOptions } from './config/editorConfig';
import type { Mood } from '@/types/journal';

interface MoodSelectorProps {
  mood?: Mood;
  isPublic: boolean;
  onMoodChange: (mood: Mood) => void;
  onIsPublicChange: (isPublic: boolean) => void;
}

export function MoodSelector({
  mood,
  isPublic,
  onMoodChange,
  onIsPublicChange
}: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Today's Mood</h3>
        <div className="grid grid-cols-5 gap-1">
          {moodOptions.map((option) => (
            <Button
              key={option.value}
              variant={mood === option.value ? "default" : "outline"}
              className="h-10 px-0"
              onClick={() => onMoodChange(option.value as Mood)}
              title={option.label}
            >
              <span className="emoji" role="img" aria-label={option.label}>
                {option.icon}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Make Public</span>
        <Switch
          checked={isPublic}
          onCheckedChange={onIsPublicChange}
          aria-label="Toggle public sharing"
        />
      </div>
    </div>
  );
}
