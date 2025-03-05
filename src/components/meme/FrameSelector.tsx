
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

// Frame options
const frameOptions = [
  { id: 'none', name: 'No Frame', url: '' },
  { id: 'basic-border', name: 'Basic Border', url: '/frames/basic-border.svg' },
  { id: 'polaroid', name: 'Polaroid', url: '/frames/polaroid.svg' },
  { id: 'vintage', name: 'Vintage', url: '/frames/vintage.svg' },
  { id: 'floral', name: 'Floral', url: '/frames/floral.svg' },
  { id: 'geometric', name: 'Geometric', url: '/frames/geometric.svg' },
  { id: 'grunge', name: 'Grunge', url: '/frames/grunge.svg' },
  { id: 'minimalist', name: 'Minimalist', url: '/frames/minimalist.svg' },
];

interface FrameSelectorProps {
  selectedFrame: string;
  onSelectFrame: (frame: string) => void;
}

export function FrameSelector({ selectedFrame, onSelectFrame }: FrameSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Select Frame</Label>
        <p className="text-sm text-muted-foreground">Choose a frame for your creation</p>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {frameOptions.map((frame) => (
            <Card
              key={frame.id}
              className={`p-2 cursor-pointer hover:bg-accent transition-colors ${
                selectedFrame === frame.url ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectFrame(frame.url)}
            >
              <div className="aspect-square relative flex items-center justify-center bg-muted rounded overflow-hidden">
                {frame.url ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={frame.url} 
                        alt={frame.name} 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-gray-100"></div>
                  </div>
                )}
              </div>
              <p className="text-center text-sm mt-1">{frame.name}</p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
