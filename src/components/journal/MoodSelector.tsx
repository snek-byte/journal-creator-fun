
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { moodOptions } from "./config/editorConfig";
import type { Mood } from '@/types/journal';

interface MoodSelectorProps {
  mood?: Mood;
  isPublic: boolean;
  onMoodChange: (value: Mood) => void;
  onIsPublicChange: (value: boolean) => void;
}

export function MoodSelector({
  mood,
  isPublic,
  onMoodChange,
  onIsPublicChange,
}: MoodSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">How are you feeling?</label>
        <Select 
          value={mood} 
          onValueChange={onMoodChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your mood" />
          </SelectTrigger>
          <SelectContent>
            {moodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {option.icon} {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Make Entry Public</label>
        <Switch
          checked={isPublic}
          onCheckedChange={onIsPublicChange}
        />
      </div>
    </div>
  );
}
