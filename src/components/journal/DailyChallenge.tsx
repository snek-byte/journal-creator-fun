
import { Button } from "@/components/ui/button";
import { Lightbulb, RotateCw } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
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
          onClick={onRefresh}
          className="text-yellow-600 hover:text-yellow-700 transition-colors mt-0.5"
          title="Get a new prompt"
        >
          <RotateCw className="h-4 w-4" />
        </button>
        <p className="text-gray-600">{prompt}</p>
      </div>
      <Button 
        className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
        variant="ghost"
        onClick={onApply}
      >
        Use This Prompt
      </Button>
    </div>
  );
}
