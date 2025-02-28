import React, { useState, useRef } from 'react';
import { Icon } from '@/types/journal';
import { Button } from "@/components/ui/button";
import { X, GripVertical } from 'lucide-react';

interface IconContainerProps {
  icons: Icon[];
  onIconClick: (iconId: string) => void;
  onRemoveContainer: () => void;
  onContainerMove: (position: { x: number, y: number }) => void;
  containerPosition: { x: number, y: number };
}

export function IconContainer({ 
  icons, 
  onIconClick, 
  onRemoveContainer,
  onContainerMove,
  containerPosition 
}: IconContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current?.parentElement) return;
      
      const parentRect = containerRef.current.parentElement.getBoundingClientRect();
      const x = ((e.clientX - parentRect.left - dragOffset.x) / parentRect.width) * 100;
      const y = ((e.clientY - parentRect.top - dragOffset.y) / parentRect.height) * 100;
      
      // Keep the container within bounds
      const boundedX = Math.max(0, Math.min(x, 95));
      const boundedY = Math.max(0, Math.min(y, 95));
      
      onContainerMove({ x: boundedX, y: boundedY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current?.parentElement) return;
      
      const touch = e.touches[0];
      const parentRect = containerRef.current.parentElement.getBoundingClientRect();
      const x = ((touch.clientX - parentRect.left - dragOffset.x) / parentRect.width) * 100;
      const y = ((touch.clientY - parentRect.top - dragOffset.y) / parentRect.height) * 100;
      
      // Keep the container within bounds
      const boundedX = Math.max(0, Math.min(x, 95));
      const boundedY = Math.max(0, Math.min(y, 95));
      
      onContainerMove({ x: boundedX, y: boundedY });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={containerRef}
      style={{
        left: `${containerPosition.x}%`,
        top: `${containerPosition.y}%`,
      }}
      className={`absolute px-2 py-1.5 rounded-md bg-white/80 backdrop-blur-sm border shadow-sm
        transition-all ${isDragging ? 'ring-2 ring-primary/30' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <div 
          className="cursor-move p-0.5 rounded hover:bg-gray-100 flex items-center"
          onMouseDown={handleContainerMouseDown}
          onTouchStart={handleTouchStart}
        >
          <GripVertical className="h-3 w-3 text-gray-500" />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 p-0 hover:bg-gray-100"
          onClick={onRemoveContainer}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1 max-w-[150px]">
        {icons.map((icon) => (
          <img
            key={icon.id}
            src={icon.url}
            alt={icon.id}
            style={{
              width: '24px',
              height: '24px',
              color: icon.color,
            }}
            className="cursor-pointer transition-all hover:scale-110"
            onClick={() => onIconClick(icon.id)}
          />
        ))}
      </div>
    </div>
  );
}
