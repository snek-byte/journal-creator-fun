
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RefreshCw } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onApply: () => void;
  onRefresh: () => void;
}

export function DailyChallenge({ prompt, onRefresh }: DailyChallengeProps) {
  const handleApplyPrompt = () => {
    // Apply prompt automatically when clicked
    onRefresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 h-auto">
          🌟 Challenge
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-3 w-[260px]">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Daily Challenge</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5" 
              onClick={onRefresh}
              title="Get new challenge"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Write about:
          </p>
          <blockquote className="border-l-2 pl-2 text-sm italic">
            {prompt || "Loading challenge..."}
          </blockquote>
          <Button 
            size="sm" 
            variant="secondary" 
            className="w-full" 
            onClick={handleApplyPrompt}
          >
            Get New Challenge
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
