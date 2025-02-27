
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 max-w-[240px] rounded-lg p-1.5">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-0.5">
          <Zap className="h-2.5 w-2.5 text-violet-500" />
          <span className="text-[10px] font-medium text-violet-500">Daily Challenge</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-0"
          onClick={onRefresh}
          title="Get a new challenge"
        >
          <RotateCcw className="h-2 w-2" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-between min-h-[70px] py-0.5 space-y-1.5">
        <p className="text-[11px] font-medium text-gray-800 italic font-merriweather text-center px-1.5">
          {prompt}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-[10px] font-medium text-violet-600 hover:bg-violet-100 px-1.5 py-0 h-4"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
