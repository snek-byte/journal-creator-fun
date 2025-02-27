
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg p-2 w-full">
      <div className="flex items-center mb-1.5">
        <Zap className="h-3 w-3 text-violet-500 mr-1" />
        <span className="text-xs font-medium text-violet-500 mr-1">Daily Challenge</span>
        <button
          className="ml-auto inline-flex p-0 bg-transparent border-0 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={onRefresh}
          title="Get a new challenge"
          type="button"
        >
          <RotateCcw className="h-2.5 w-2.5" />
        </button>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-gray-800 italic font-merriweather line-clamp-3">
          {prompt}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-xs font-medium text-violet-600 hover:bg-violet-100 self-start px-1.5 py-0.5 h-6"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
