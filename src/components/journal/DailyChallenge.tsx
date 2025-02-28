
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";
import type { Challenge } from '@/types/journal';

interface DailyChallengeProps {
  dailyChallenge: Challenge | null;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ dailyChallenge, onRefresh, onApply }: DailyChallengeProps) {
  if (!dailyChallenge) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg p-1.5 w-full">
        <div className="flex items-center mb-1">
          <Zap className="h-2.5 w-2.5 text-violet-500 mr-0.5" />
          <span className="text-[10px] font-medium text-violet-500 mr-0.5">Daily Challenge</span>
          <button
            className="ml-auto inline-flex p-0 bg-transparent border-0 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={onRefresh}
            title="Get a new challenge"
            type="button"
          >
            <RotateCcw className="h-2 w-2" />
          </button>
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-medium text-gray-800 italic font-merriweather line-clamp-2">
            Loading challenge...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg p-1.5 w-full">
      <div className="flex items-center mb-1">
        <Zap className="h-2.5 w-2.5 text-violet-500 mr-0.5" />
        <span className="text-[10px] font-medium text-violet-500 mr-0.5">Daily Challenge</span>
        <button
          className="ml-auto inline-flex p-0 bg-transparent border-0 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={onRefresh}
          title="Get a new challenge"
          type="button"
        >
          <RotateCcw className="h-2 w-2" />
        </button>
      </div>
      
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-medium text-gray-800 italic font-merriweather line-clamp-2">
          {dailyChallenge.prompt}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onApply}
          className="text-[10px] font-medium text-violet-600 hover:bg-violet-100 self-start px-1 py-0 h-5"
        >
          Use this prompt
        </Button>
      </div>
    </div>
  );
}
