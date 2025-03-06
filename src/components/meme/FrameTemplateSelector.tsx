
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface FrameTemplateSelectorProps {
  onSelect: (framePath: string) => void;
  selectedFrame: string | null;
}

export default function FrameTemplateSelector({ onSelect, selectedFrame }: FrameTemplateSelectorProps) {
  const [frames, setFrames] = useState<string[]>([]);
  
  useEffect(() => {
    // These are the SVG frames we already have in the public directory
    const availableFrames = [
      '/frames/basic-border.svg',
      '/frames/rounded.svg',
      '/frames/shadow-box.svg',
      '/frames/photo-frame.svg',
      '/frames/polaroid.svg',
      '/frames/vintage.svg',
      '/frames/neon.svg',
      '/frames/wave.svg',
      '/frames/ribbon-box.svg',
      '/frames/social-media.svg',
      '/frames/zigzag.svg',
      '/frames/taped.svg',
      '/frames/torn-paper.svg',
      '/frames/puzzle.svg',
      '/frames/triangle-pattern.svg',
      '/frames/watercolor.svg',
      '/frames/scalloped.svg',
      '/frames/dashed-box.svg',
      '/frames/dotted.svg',
      '/frames/circular.svg',
      '/frames/double-box.svg',
      '/frames/minimalist.svg',
      '/frames/layered-box.svg',
      '/frames/grunge.svg',
      '/frames/box-corners.svg',
      '/frames/comic.svg',
      '/frames/hexagon.svg',
      '/frames/geometric.svg',
      '/frames/birthday.svg',
      '/frames/abstract.svg',
      '/frames/instant-photo.svg',
      '/frames/certificate.svg',
      '/frames/art-deco.svg',
      '/frames/landscape.svg',
      '/frames/grid-box.svg',
      '/frames/floral.svg',
      '/frames/collage.svg',
      '/frames/fancy-box.svg',
      '/frames/pixel.svg',
    ];
    
    setFrames(availableFrames);
  }, []);
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {frames.map((frame, index) => (
        <div 
          key={index}
          className={cn(
            "border rounded-md cursor-pointer hover:border-primary transition-colors p-1",
            selectedFrame === frame ? "border-primary bg-primary/10" : "border-gray-200"
          )}
          onClick={() => onSelect(frame)}
        >
          <div className="aspect-square bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            <img 
              src={frame} 
              alt={`Frame ${index + 1}`} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <p className="text-xs text-center mt-1 truncate">
            {frame.split('/').pop()?.replace('.svg', '').replace(/-/g, ' ')}
          </p>
        </div>
      ))}
    </div>
  );
}
