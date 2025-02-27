
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface DailyChallengeProps {
  prompt: string;
  onRefresh: () => void;
  onApply: () => void;
}

export function DailyChallenge({ prompt, onRefresh, onApply }: DailyChallengeProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1 text-amber-500" />
            <CardTitle className="text-sm font-medium text-gray-600">Daily Challenge</CardTitle>
            <span className="ml-1 text-sm text-amber-500 font-medium">+20 XP</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRefresh}
            title="Get a new challenge"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
        <CardDescription className="text-sm font-medium text-gray-700 mt-1">
          {prompt}
        </CardDescription>
      </CardHeader>
      
      <div className="flex justify-end mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onApply}
          className="text-xs px-2 py-1 h-7"
        >
          Use this prompt
        </Button>
      </div>
    </Card>
  );
}
