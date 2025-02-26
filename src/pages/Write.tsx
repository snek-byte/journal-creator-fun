
import { JournalEditor } from "@/components/JournalEditor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Write() {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50">
        <Link to="/auth">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs bg-white/50 hover:bg-white/80 text-gray-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
          >
            Sign up to save
          </Button>
        </Link>
      </div>
      <JournalEditor />
    </div>
  );
}
