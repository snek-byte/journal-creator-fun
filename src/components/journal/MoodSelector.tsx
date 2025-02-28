
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { moodOptions } from './config/editorConfig';
import type { Mood } from '@/types/journal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Today's Mood</label>
        <Select value={mood} onValueChange={(value) => onMoodChange(value as Mood)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select mood" />
          </SelectTrigger>
          <SelectContent>
            {moodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <span className="mr-2">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
