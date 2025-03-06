
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Frame options
const frameOptions = [
  { id: 'none', name: 'No Frame', url: '' },
  { id: 'photo-frame', name: 'Photo Frame', url: '/frames/photo-frame.svg' },
  { id: 'polaroid', name: 'Polaroid', url: '/frames/polaroid.svg' },
  { id: 'dashed-box', name: 'Dashed Box', url: '/frames/dashed-box.svg' },
  { id: 'box-corners', name: 'Box Corners', url: '/frames/box-corners.svg' },
  { id: 'layered-box', name: 'Layered Box', url: '/frames/layered-box.svg' },
  { id: 'shadow-box', name: 'Shadow Box', url: '/frames/shadow-box.svg' },
  { id: 'basic-border', name: 'Basic Border', url: '/frames/basic-border.svg' },
  { id: 'torn-paper', name: 'Torn Paper', url: '/frames/torn-paper.svg' },
  { id: 'social-media', name: 'Social Media', url: '/frames/social-media.svg' },
  { id: 'collage', name: 'Collage', url: '/frames/collage.svg' },
  { id: 'taped', name: 'Taped Photo', url: '/frames/taped.svg' },
  { id: 'instant-photo', name: 'Instant Photo', url: '/frames/instant-photo.svg' },
  { id: 'birthday', name: 'Birthday', url: '/frames/birthday.svg' },
  { id: 'landscape', name: 'Landscape', url: '/frames/landscape.svg' },
  { id: 'hexagon', name: 'Hexagon', url: '/frames/hexagon.svg' },
  { id: 'rounded', name: 'Rounded', url: '/frames/rounded.svg' },
  { id: 'dotted', name: 'Dotted', url: '/frames/dotted.svg' },
  { id: 'double-box', name: 'Double Box', url: '/frames/double-box.svg' },
  { id: 'fancy-box', name: 'Fancy Box', url: '/frames/fancy-box.svg' },
  { id: 'ribbon-box', name: 'Ribbon Box', url: '/frames/ribbon-box.svg' },
  { id: 'grid-box', name: 'Grid Box', url: '/frames/grid-box.svg' },
  { id: 'certificate', name: 'Certificate', url: '/frames/certificate.svg' },
  { id: 'comic', name: 'Comic', url: '/frames/comic.svg' },
  { id: 'minimalist', name: 'Minimalist', url: '/frames/minimalist.svg' },
  { id: 'speech-bubble', name: 'Speech Bubble', url: '/frames/speech-bubble.svg' },
  { id: 'vintage', name: 'Vintage', url: '/frames/vintage.svg' },
  { id: 'floral', name: 'Floral', url: '/frames/floral.svg' },
  { id: 'geometric', name: 'Geometric', url: '/frames/geometric.svg' },
  { id: 'grunge', name: 'Grunge', url: '/frames/grunge.svg' },
  { id: 'cinema', name: 'Cinema', url: '/frames/cinema.svg' },
  { id: 'circular', name: 'Circular', url: '/frames/circular.svg' },
  { id: 'watercolor', name: 'Watercolor', url: '/frames/watercolor.svg' },
  { id: 'triangle-pattern', name: 'Triangle Pattern', url: '/frames/triangle-pattern.svg' },
  { id: 'puzzle', name: 'Puzzle', url: '/frames/puzzle.svg' },
  { id: 'pixel', name: 'Pixel', url: '/frames/pixel.svg' },
  { id: 'zigzag', name: 'Zigzag', url: '/frames/zigzag.svg' },
  { id: 'art-deco', name: 'Art Deco', url: '/frames/art-deco.svg' },
  { id: 'neon', name: 'Neon', url: '/frames/neon.svg' },
  { id: 'wave', name: 'Wave', url: '/frames/wave.svg' },
  { id: 'abstract', name: 'Abstract', url: '/frames/abstract.svg' },
  { id: 'scalloped', name: 'Scalloped', url: '/frames/scalloped.svg' },
];

interface FrameSelectorProps {
  selectedFrame: string;
  onSelectFrame: (frame: string) => void;
}

export function FrameSelector({ selectedFrame, onSelectFrame }: FrameSelectorProps) {
  // Debug the current selected frame
  useEffect(() => {
    console.log("Current selected frame in FrameSelector:", selectedFrame);
  }, [selectedFrame]);

  const handleFrameClick = (frameUrl: string) => {
    console.log("Frame clicked:", frameUrl);
    
    // Select the frame
    onSelectFrame(frameUrl);
    
    // Show confirmation toast
    const frameName = frameOptions.find(f => f.url === frameUrl)?.name || 'Custom';
    toast.success(`${frameName} frame selected`);
  };

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
              onClick={() => handleFrameClick(frame.url)}
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
                          console.error(`Error loading frame preview: ${frame.url}`);
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
