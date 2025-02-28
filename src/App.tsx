
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Write from "./pages/Write";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { JournalPreview } from "./components/journal/JournalPreview";
import { useJournalStore } from "./store/journalStore";
import { useState } from "react";

const PreviewWrapper = () => {
  const location = useLocation();
  const {
    currentEntry,
    showPreview,
    togglePreview,
    setTextPosition,
    setBackgroundImage,
    setDrawing,
    setFilter,
    addSticker,
    addIcon,
    removeSticker,
    removeIcon,
    updateIcon,
    addTextBox,
    updateTextBox,
    removeTextBox,
  } = useJournalStore();
  
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  const isWritePage = location.pathname === '/' || location.pathname === '/write' || location.pathname === '/index';
  
  const handleTextDragStart = () => {
    // Placeholder for drag start handler
  };
  
  const handleTextDragEnd = () => {
    // Placeholder for drag end handler
  };
  
  const handleIconSelect = (id: string) => {
    setSelectedIconId(id);
    setSelectedStickerId(null);
    setSelectedTextBoxId(null);
  };
  
  const handleStickerSelect = (id: string | null) => {
    setSelectedStickerId(id);
    setSelectedIconId(null);
    setSelectedTextBoxId(null);
  };
  
  const handleTextBoxSelect = (id: string | null) => {
    setSelectedTextBoxId(id);
    setSelectedStickerId(null);
    setSelectedIconId(null);
  };
  
  if (!isWritePage || !showPreview) return null;
  
  return (
    <div className="fixed top-0 right-0 w-1/2 h-screen z-50 shadow-xl bg-background border-l border-border">
      <JournalPreview
        showPreview={showPreview}
        text={currentEntry.text}
        mood={currentEntry.mood}
        font={currentEntry.font}
        fontSize={currentEntry.fontSize}
        fontWeight={currentEntry.fontWeight}
        fontColor={currentEntry.fontColor}
        gradient={currentEntry.gradient}
        textStyle={currentEntry.textStyle}
        stickers={currentEntry.stickers || []}
        icons={currentEntry.icons || []}
        textBoxes={currentEntry.textBoxes || []}
        textPosition={currentEntry.textPosition}
        backgroundImage={currentEntry.backgroundImage}
        drawing={currentEntry.drawing}
        filter={currentEntry.filter}
        onStickerAdd={addSticker}
        onIconAdd={addIcon}
        onStickerMove={(id, position) => {
          const sticker = currentEntry.stickers.find(s => s.id === id);
          if (sticker) {
            addSticker({ ...sticker, position });
          }
        }}
        onIconMove={(id, position) => {
          const icon = currentEntry.icons.find(i => i.id === id);
          if (icon) {
            updateIcon(id, { position });
          }
        }}
        onIconUpdate={updateIcon}
        onIconSelect={handleIconSelect}
        onStickerSelect={handleStickerSelect}
        onTextBoxAdd={addTextBox}
        onTextBoxUpdate={updateTextBox}
        onTextBoxRemove={removeTextBox}
        onTextBoxSelect={handleTextBoxSelect}
        onTextMove={setTextPosition}
        onTextDragStart={handleTextDragStart}
        onTextDragEnd={handleTextDragEnd}
        onBackgroundSelect={setBackgroundImage}
        onDrawingChange={setDrawing}
        onFilterChange={setFilter}
        onTogglePreview={togglePreview}
        drawingTool="pen"
        drawingColor="#000000"
        brushSize={3}
        isDrawingMode={isDrawingMode}
      />
    </div>
  );
};

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Write />} />
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="/write" element={<Write />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PreviewWrapper />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
