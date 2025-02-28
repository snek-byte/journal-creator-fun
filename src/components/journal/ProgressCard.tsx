
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, BookOpen, PenLine } from "lucide-react";

interface ProgressCardProps {
  progress: {
    streak?: number;
    entriesCount?: number;
    wordCount?: number;
    lastEntry?: string | null;
  };
}

export function ProgressCard({ progress }: ProgressCardProps) {
  // Default values if progress data is missing
  const streak = progress?.streak || 0;
  const entriesCount = progress?.entriesCount || 0;
  const wordCount = progress?.wordCount || 0;
  const lastEntry = progress?.lastEntry 
    ? new Date(progress.lastEntry).toLocaleDateString()
    : 'Never';

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <span>Current Streak</span>
          </CardTitle>
          <CardDescription>Days of continuous writing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</div>
          {streak > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Keep it going! Write today to maintain your streak.
            </p>
          )}
          {streak === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Start your streak by writing your first journal entry today!
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Journal Entries</span>
          </CardTitle>
          <CardDescription>Total entries written</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{entriesCount}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Last entry: {lastEntry}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            <span>Word Count</span>
          </CardTitle>
          <CardDescription>Total words written</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{wordCount.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {wordCount > 0 
              ? `That's about ${Math.round(wordCount / 250)} pages!`
              : 'Start writing to see your word count grow!'
            }
          </p>
        </CardContent>
      </Card>
    </>
  );
}
