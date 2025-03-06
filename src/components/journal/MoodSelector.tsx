
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { moodOptions } from './config/editorConfig';
import type { Mood } from '@/types/journal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MoodSelectorProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
}

export function MoodSelector({
  selectedMood,
  onMoodSelect
}: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Today's Mood</label>
        <Select 
          value={selectedMood?.id} 
          onValueChange={(value) => {
            // Find the mood object by id
            const mood = moodOptions.find(option => option.value === value)?.mood;
            if (mood) onMoodSelect(mood);
          }}
        >
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
    </div>
  );
}
