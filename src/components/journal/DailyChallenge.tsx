
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 max-w-[270px] rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-violet-500" />
          <span className="text-xs font-medium text-violet-500">Daily Challenge</span>
          <span className="text-xs font-medium text-violet-500 ml-1">+20 XP</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          onClick={onRefresh}
          title="Get a new challenge"
        >
          <RotateCcw className="h-2.5 w-2.5" />
        </Button>
      </div>
      
      <p className="text-xs font-medium text-gray-800 my-1 italic font-merriweather">
        "{prompt}"
      </p>
      
      <div className="flex justify-end mt-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-xs font-medium text-violet-600 hover:bg-violet-100 px-2 py-0.5 h-6"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
