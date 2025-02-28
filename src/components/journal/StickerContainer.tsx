
import React, { useRef, useState } from 'react';
import { Sticker } from '@/types/journal';

interface StickerContainerProps {
  sticker: Sticker;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number, y: number }) => void;
  onResize?: (id: string, size: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

export function StickerContainer({
  sticker,
  selected,
  onSelect,
  onMove,
  onResize,
  containerRef,
  style = {}
}: StickerContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const stickerRef = useRef<HTMLDivElement>(null);
  
  const width = sticker.width || 100;
  const height = sticker.height || 100;
  
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    onSelect(sticker.id);
    
    // Get container dimensions for percentage calculations
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    
    // Initial mouse position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Initial sticker position
    const startPositionX = sticker.position.x;
    const startPositionY = sticker.position.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Calculate the move delta in pixels
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Convert to percentage of container
      const deltaXPercent = (deltaX / containerRect.width) * 100;
      const deltaYPercent = (deltaY / containerRect.height) * 100;
      
      // New position
      const newX = startPositionX + deltaXPercent;
      const newY = startPositionY + deltaYPercent;
      
      // Update sticker position
      onMove(sticker.id, { x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    // Initial mouse position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Initial size
    const startWidth = width;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // Calculate the resize delta
      const deltaX = e.clientX - startX;
      
      // New size (width and height are the same for square stickers)
      const newSize = Math.max(20, startWidth + deltaX);
      
      // Update sticker size if the callback exists
      if (onResize) {
        onResize(sticker.id, newSize);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div
      ref={stickerRef}
      className={`absolute cursor-move select-none touch-none ${selected ? 'z-30' : 'z-20'}`}
      style={{
        left: `${sticker.position.x}%`,
        top: `${sticker.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${width}px`,
        height: `${height}px`,
        border: selected ? '2px dashed rgba(59, 130, 246, 0.7)' : 'none',
        ...style
      }}
      onMouseDown={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(sticker.id);
      }}
    >
      <img
        src={sticker.url}
        alt="Sticker"
        className="w-full h-full object-contain"
        draggable={false}
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Resize handle */}
      {selected && onResize && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 bg-white border border-gray-300 rounded-full cursor-se-resize transform translate-x-1/3 translate-y-1/3 flex items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
          </svg>
        </div>
      )}
    </div>
  );
}
