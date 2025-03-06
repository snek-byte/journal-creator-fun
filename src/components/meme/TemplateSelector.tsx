
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Frame } from '@/types/meme';

interface TemplateSelectorProps {
  frames: Frame[];
  selectedFrame: Frame | null;
  onFrameSelect: (frame: Frame) => void;
}

export function TemplateSelector({ frames, selectedFrame, onFrameSelect }: TemplateSelectorProps) {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="grid grid-cols-2 gap-4">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onFrameSelect(frame)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:opacity-90 ${
              selectedFrame?.id === frame.id ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img
              src={frame.src}
              alt={frame.name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
