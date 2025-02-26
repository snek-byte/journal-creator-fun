
import { JournalEditor } from "@/components/JournalEditor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Write() {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Sign up to save your journal
          </Button>
        </Link>
      </div>
      <JournalEditor />
    </div>
  );
}
