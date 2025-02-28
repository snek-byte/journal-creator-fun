
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

export interface DailyChallengeProps {
  prompt: string;
  onApply: () => void;
  onRefresh: () => void;
}

export function DailyChallenge({ prompt, onApply, onRefresh }: DailyChallengeProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-yellow-500" />
        <span className="text-xs font-medium">Daily Challenge</span>
        <Button variant="ghost" size="xs" onClick={onRefresh} className="ml-auto">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{prompt}</p>
      <Button variant="secondary" size="sm" className="mt-1 w-full" onClick={onApply}>
        Apply
      </Button>
    </div>
  );
}
