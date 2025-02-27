
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 max-w-xs rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-xs font-medium text-violet-500">Daily Challenge</span>
          <span className="text-xs font-medium text-violet-500 ml-1.5">+20 XP</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          onClick={onRefresh}
          title="Get a new challenge"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      
      <p className="text-sm font-medium text-gray-800 my-1 italic font-merriweather">
        "{prompt}"
      </p>
      
      <div className="flex justify-end mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-xs font-medium text-violet-600 hover:bg-violet-100 px-3 py-1 h-7"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
