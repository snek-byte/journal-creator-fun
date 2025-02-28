
import React, { useEffect, useRef } from 'react';
import type { Sticker } from '@/types/journal';

interface StickerContainerProps {
  sticker: Sticker;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize?: (id: string, size: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function StickerContainer({
  sticker,
  selected,
  onSelect,
  onMove,
  onResize,
  containerRef
}: StickerContainerProps) {
  const stickerRef = useRef<HTMLDivElement>(null);

  // Global keyboard event listener for delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected && (e.key === 'Delete' || e.key === 'Backspace')) {
        console.log("Delete key pressed for sticker:", sticker.id);
        onMove(sticker.id, { x: -999, y: -999 });
      }
    };

    // Only add the listener when this sticker is selected
    if (selected) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, sticker.id, onMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Select this sticker
    onSelect(sticker.id);
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const stickerRect = stickerRef.current?.getBoundingClientRect();
    
    if (!stickerRect) return;
    
    // Calculate the offset from the mouse position to the sticker's top-left corner
    const offsetX = e.clientX - stickerRect.left;
    const offsetY = e.clientY - stickerRect.top;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the new position as a percentage of the container
      const x = ((e.clientX - offsetX - containerRect.left + stickerRect.width / 2) / containerRect.width) * 100;
      const y = ((e.clientY - offsetY - containerRect.top + stickerRect.height / 2) / containerRect.height) * 100;
      
      // Ensure position stays within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      onMove(sticker.id, { x: boundedX, y: boundedY });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={stickerRef}
      className={`absolute cursor-move transition-all ${
        selected ? 'border-2 border-primary z-50' : 'hover:border hover:border-primary/30 z-40'
      }`}
      style={{
        left: `${sticker.position.x}%`,
        top: `${sticker.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${sticker.width || 100}px`,
        height: `${sticker.height || 100}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(sticker.id);
      }}
      tabIndex={0} // Make focusable for keyboard events
    >
      <img
        src={sticker.url}
        alt="Sticker"
        className="w-full h-full object-contain"
        draggable={false}
        onError={(e) => {
          console.error(`Failed to load sticker image: ${sticker.url}`);
          e.currentTarget.src = '/stickers/star.svg';
        }}
      />
    </div>
  );
}
