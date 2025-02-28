
import React, { useEffect } from 'react';
import { useJournalStore } from "@/store/journalStore";
import { JournalGrid } from '@/components/journal/JournalGrid';
import { ProgressCard } from '@/components/journal/ProgressCard';
import { BadgeCollection } from '@/components/journal/BadgeCollection';

export default function Dashboard() {
  const { entries, progress, badges, loadEntries, loadProgress } = useJournalStore((state: any) => state);

  useEffect(() => {
    loadEntries();
    loadProgress();
  }, [loadEntries, loadProgress]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Journal Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ProgressCard progress={progress} />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Recent Entries</h2>
      <JournalGrid entries={entries} />
      
      <h2 className="text-2xl font-semibold mt-12 mb-4">Your Badges</h2>
      <BadgeCollection badges={badges} />
    </div>
  );
}
