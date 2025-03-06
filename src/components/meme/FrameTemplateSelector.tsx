import { useState, useEffect, CSSProperties } from 'react';
import { cn } from "@/lib/utils";

interface FrameTemplateSelectorProps {
  onSelect: (framePath: string) => void;
  selectedFrame: string | null;
}

export default function FrameTemplateSelector({ onSelect, selectedFrame }: FrameTemplateSelectorProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  
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
    
    // Organize frames into categories
    const categorizedFrames: Record<string, string[]> = {
      'Simple': [
        '/frames/basic-border.svg',
        '/frames/rounded.svg',
        '/frames/shadow-box.svg',
        '/frames/minimalist.svg',
        '/frames/dashed-box.svg',
        '/frames/dotted.svg',
        '/frames/double-box.svg',
      ],
      'Photo': [
        '/frames/photo-frame.svg',
        '/frames/polaroid.svg',
        '/frames/instant-photo.svg',
        '/frames/taped.svg',
        '/frames/box-corners.svg',
      ],
      'Decorative': [
        '/frames/vintage.svg',
        '/frames/neon.svg',
        '/frames/ribbon-box.svg',
        '/frames/wave.svg',
        '/frames/scalloped.svg',
        '/frames/watercolor.svg',
        '/frames/torn-paper.svg',
        '/frames/puzzle.svg',
        '/frames/social-media.svg',
        '/frames/triangle-pattern.svg',
      ],
      'Geometric': [
        '/frames/circular.svg',
        '/frames/hexagon.svg',
        '/frames/geometric.svg',
        '/frames/layered-box.svg',
        '/frames/grid-box.svg',
        '/frames/pixel.svg',
        '/frames/zigzag.svg',
      ],
      'Special': [
        '/frames/grunge.svg',
        '/frames/comic.svg',
        '/frames/birthday.svg',
        '/frames/certificate.svg',
        '/frames/art-deco.svg',
        '/frames/landscape.svg',
        '/frames/floral.svg',
        '/frames/collage.svg',
        '/frames/fancy-box.svg',
        '/frames/abstract.svg',
      ],
    };
    
    setCategories(categorizedFrames);
    setFrames(availableFrames);
  }, []);
  
  // Function to get the friendly name from the file path
  const getFrameName = (framePath: string): string => {
    return framePath.split('/').pop()?.replace('.svg', '').replace(/-/g, ' ') || '';
  };
  
  // Updated function to calculate correct positioning for the preview image inside each frame
  const getFramePreviewStyle = (framePath: string): CSSProperties => {
    // Different frames need different padding for the preview image
    if (framePath.includes('shadow-box')) {
      return { 
        margin: '0',
        width: '70%', 
        height: '70%',
        position: 'absolute' as const,
        top: '15%',
        left: '15%',
        borderRadius: '4px'
      };
    } else if (framePath.includes('polaroid')) {
      return { 
        margin: '10% 10% 30% 10%',
        borderRadius: '0'
      }; 
    } else if (framePath.includes('taped')) {
      return { 
        margin: '15%',
        borderRadius: '0'
      }; 
    } else if (framePath.includes('photo-frame')) {
      return { 
        margin: '12%',
        borderRadius: '0'
      }; 
    } else if (framePath.includes('rounded')) {
      return { 
        margin: '8%',
        borderRadius: '8px'
      }; 
    } else if (framePath.includes('basic-border')) {
      return { 
        margin: '8%',
        borderRadius: '0'
      }; 
    } else if (framePath.includes('circular')) {
      return { 
        margin: '15%',
        borderRadius: '50%'
      };
    } else if (framePath.includes('hexagon')) {
      return { 
        margin: '15%',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
      };
    }
    
    // Default for other frames
    return { 
      margin: '12%',
      borderRadius: '2px'
    };
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, categoryFrames]) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-medium mb-2">{category}</h3>
          <div className="grid grid-cols-2 gap-3">
            {categoryFrames.map((frame, index) => (
              <div 
                key={index}
                className={cn(
                  "border rounded-md cursor-pointer hover:border-primary transition-colors p-2",
                  selectedFrame === frame ? "border-primary bg-primary/10" : "border-gray-200"
                )}
                onClick={() => onSelect(frame)}
              >
                <div className="aspect-square bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Sample image square that fits inside the frame */}
                    <div 
                      className="absolute bg-gray-300 rounded-sm"
                      style={getFramePreviewStyle(frame)}
                    ></div>
                    <img 
                      src={frame} 
                      alt={`Frame ${index + 1}`} 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-center mt-1 truncate capitalize">
                  {getFrameName(frame)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
