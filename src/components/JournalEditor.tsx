
import { useState, useEffect } from "react";
import { useJournalStore } from "@/store/journalStore";
import { JournalEditorSidebar } from "./JournalEditorSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Send } from "lucide-react";
import { EmailDialog } from "./journal/EmailDialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function JournalEditor() {
  const { togglePreview, showPreview, currentEntry, setTextPosition } = useJournalStore();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [defaultLayout, setDefaultLayout] = useState([55, 45]);
  
  useEffect(() => {
    if (isMobile) {
      setDefaultLayout([100, 0]);
    } else {
      setDefaultLayout([55, 45]);
    }
  }, [isMobile]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen w-full rounded-lg bg-background"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          minSize={isMobile ? 100 : 30}
          maxSize={isMobile ? 100 : 70}
          className="p-4"
        >
          {/* Editor Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Journal</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreview}
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmailDialogOpen(true)}
                title="Share via Email"
              >
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </div>
          </div>

          {/* Editor Content */}
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <JournalEditorSidebar />
          </ScrollArea>
        </ResizablePanel>

        {/* Hide the preview panel since it's now handled in App.tsx */}
        {!isMobile && showPreview && (
          <>
            <ResizableHandle withHandle className={cn(!showPreview && "hidden")} />
            <ResizablePanel
              defaultSize={defaultLayout[1]}
              minSize={30}
              maxSize={70}
              className={cn(!showPreview && "hidden")}
            >
              {/* We'll leave this empty as the preview is now rendered at the App level */}
              <div className="h-full w-full"></div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <EmailDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />
    </div>
  );
}
