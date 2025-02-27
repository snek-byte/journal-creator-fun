
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 max-w-[270px] rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <Zap className="h-3 w-3 text-violet-500" />
          <span className="text-xs font-medium text-violet-500">Daily Challenge</span>
          <span className="text-xs font-medium text-violet-500 ml-0.5">+20 XP</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-0"
          onClick={onRefresh}
          title="Get a new challenge"
        >
          <RotateCcw className="h-2 w-2" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-between min-h-[120px]">
        <p className="text-xs font-medium text-gray-800 mt-5 mb-5 italic font-merriweather text-center px-2">
          {prompt}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-xs font-medium text-violet-600 hover:bg-violet-100 px-1.5 py-0 h-5"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
