
import { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseJournalTextPositionProps {
  initialPosition: Position;
  containerRef: React.RefObject<HTMLDivElement>;
  onTextMove?: (position: Position) => void;
  onTextDragStart?: () => void;
  onTextDragEnd?: () => void;
}

export function useJournalTextPosition({
  initialPosition,
  containerRef,
  onTextMove,
  onTextDragStart,
  onTextDragEnd
}: UseJournalTextPositionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);
  
  // Initialize position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (onTextDragStart) onTextDragStart();
    
    // Initial position
    const startX = e.clientX;
    const startY = e.clientY;
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!container) return;
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Convert pixel delta to percentage of container
      const deltaXPercent = (deltaX / container.offsetWidth) * 100;
      const deltaYPercent = (deltaY / container.offsetHeight) * 100;
      
      // Calculate new position
      const newPosition = {
        x: Math.max(0, Math.min(100, position.x + deltaXPercent)),
        y: Math.max(0, Math.min(100, position.y + deltaYPercent))
      };
      
      setPosition(newPosition);
      if (onTextMove) onTextMove(newPosition);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      if (onTextDragEnd) onTextDragEnd();
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    position,
    isDragging,
    handleDragStart
  };
}
