
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg p-3 w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-medium text-violet-500">Daily Challenge</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-gray-400 hover:text-gray-600 hover:bg-transparent p-0 -mr-3"
          onClick={onRefresh}
          title="Get a new challenge"
        >
          <RotateCcw className="h-2.5 w-2.5" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 mt-1">
        <p className="text-sm font-medium text-gray-800 italic font-merriweather">
          {prompt}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-xs font-medium text-violet-600 hover:bg-violet-100 self-start px-2 py-1 h-7"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
