
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
    <Card className="border-none shadow-none bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">+20 XP</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
            onClick={onRefresh}
            title="Get a new challenge"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
        
        <div>
          <CardTitle className="text-base font-medium text-gray-900 mb-2">
            Daily Writing Challenge
          </CardTitle>
          <CardDescription className="text-base font-normal text-gray-700 leading-relaxed">
            {prompt}
          </CardDescription>
        </div>
      
        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onApply}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-100"
          >
            Use this prompt
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
