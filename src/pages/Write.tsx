
import React, { useEffect } from 'react';
import { JournalEditor } from '@/components/JournalEditor';
import { useJournalStore } from '@/store/journalStore';

export default function Write() {
  const { loadEntries, loadProgress } = useJournalStore((state: any) => state);

  useEffect(() => {
    // Load entries and user progress when the page loads
    loadEntries();
    loadProgress();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <JournalEditor />
    </div>
  );
}
