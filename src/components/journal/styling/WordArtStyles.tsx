
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WordArtStylesProps {
  onWordArtStyleSelect: (style: string) => void;
}

export function WordArtStyles({ onWordArtStyleSelect }: WordArtStylesProps) {
  const wordArtStyles = [
    { id: 'rainbow', name: 'Rainbow', className: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text' },
    { id: 'neon', name: 'Neon', className: 'text-green-400 font-extrabold tracking-wider' },
    { id: 'shadow', name: 'Shadow', className: 'text-white font-bold' },
    { id: 'outlined', name: 'Outlined', className: 'text-transparent font-extrabold' },
    { id: 'retro', name: 'Retro', className: 'text-amber-500 font-bold' },
    { id: 'metallic', name: 'Metallic', className: 'text-gray-300 font-bold' },
    { id: 'golden', name: 'Golden', className: 'text-amber-400 font-bold' },
    { id: 'bubble', name: 'Bubble', className: 'text-blue-400 font-extrabold' },
  ];

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium">Word Art Styles</span>
      <div className="grid grid-cols-2 gap-2">
        {wordArtStyles.map((style) => (
          <Button
            key={style.id}
            onClick={() => onWordArtStyleSelect(style.id)}
            variant="outline"
            className="h-14 relative overflow-hidden"
          >
            <span className={cn("text-base font-bold", style.className)}>
              {style.name}
            </span>
            {style.id === 'shadow' && (
              <span className="absolute text-base font-bold text-gray-800" style={{ left: '8px', top: '14px' }}>
                {style.name}
              </span>
            )}
            {style.id === 'outlined' && (
              <span className="absolute text-base font-extrabold" 
                    style={{ 
                      left: '10px', 
                      top: '13px',
                      WebkitTextStroke: '1px black'
                    }}>
                {style.name}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
