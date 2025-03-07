import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WordArtStylesProps {
  onWordArtStyleSelect: (style: string) => void;
}

export function WordArtStyles({ onWordArtStyleSelect }: WordArtStylesProps) {
  const wordArtStyles = [
    { 
      id: 'rainbow', 
      name: 'Rainbow', 
      className: 'font-extrabold',
      style: { 
        background: 'linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
      }
    },
    { 
      id: 'neon', 
      name: 'Neon', 
      className: 'text-green-400 font-extrabold tracking-wider',
      style: { textShadow: '0 0 5px #4ade80, 0 0 10px #4ade80' }
    },
    { 
      id: 'shadow', 
      name: 'Shadow', 
      className: 'text-white font-bold',
      style: { textShadow: '2px 2px 0 #333, 3px 3px 0 #555' }
    },
    { 
      id: 'outlined', 
      name: 'Outlined', 
      className: 'text-transparent font-extrabold',
      style: { WebkitTextStroke: '1.5px black' }
    },
    { 
      id: 'retro', 
      name: 'Retro', 
      className: 'text-amber-500 font-bold',
      style: { textShadow: '1px 1px 0 #78350f, 2px 2px 0 #78350f', borderBottom: '3px solid #78350f' }
    },
    { 
      id: 'metallic', 
      name: 'Metallic', 
      className: 'font-extrabold',
      style: { 
        backgroundImage: 'linear-gradient(180deg, #FFFFFF, #E8E8E8, #B0B0B0, #707070, #B0B0B0, #E8E8E8, #FFFFFF)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0px 1px 2px rgba(0,0,0,0.4)',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))'
      }
    },
    { 
      id: 'golden', 
      name: 'Golden', 
      className: 'font-extrabold',
      style: { 
        background: 'linear-gradient(to bottom, #F5D100, #FEF7CD, #FFC926, #BF9B30, #FFEE75, #D4AF37)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '800',
        textShadow: '0px 1px 0px rgba(255,255,255,0.2), 0px 2px 2px rgba(0,0,0,0.3)',
        filter: 'drop-shadow(1px 1px 1px rgba(139,105,20,0.4))'
      }
    },
    { 
      id: 'bubble', 
      name: 'Bubble', 
      className: 'text-blue-400 font-extrabold',
      style: { textShadow: '0 1px 0 #2563eb, 0 2px 0 #1d4ed8, 0 3px 0 #1e40af, 0 4px 0 #1e3a8a' }
    },
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
            <span
              className={cn("text-base", style.className)}
              style={style.style}
            >
              {style.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
