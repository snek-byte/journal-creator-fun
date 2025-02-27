
import { useEffect } from "react";
import { JournalEditor } from "@/components/JournalEditor";
import { useJournalStore } from "@/store/journalStore";

const Write = () => {
  const { loadEntries, loadProgress } = useJournalStore();

  useEffect(() => {
    loadEntries();
    loadProgress();
  }, [loadEntries, loadProgress]);

  return (
    <div className="container mx-auto">
      <JournalEditor />
    </div>
  );
};

export default Write;
