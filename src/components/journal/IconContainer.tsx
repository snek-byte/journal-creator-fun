
import React, { useRef, useEffect } from 'react';
import type { Icon } from '@/types/journal';

interface IconContainerProps {
  icon: Icon;
  selected: boolean;
  onSelect: (id: string | null) => void;
  onMove: (id: string, position: { x: number, y: number }) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export function IconContainer({
  icon,
  selected,
  onSelect,
  onMove,
  containerRef
}: IconContainerProps) {
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && iconRef.current) {
      iconRef.current.focus();
    }
  }, [selected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(icon.id);
    
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      // Calculate position relative to container
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;
      
      const newX = icon.position.x + deltaX;
      const newY = icon.position.y + deltaY;
      
      startPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      
      // Check if position is within container boundaries
      if (
        newX >= 0 && 
        newX <= 100 && 
        newY >= 0 && 
        newY <= 100
      ) {
        onMove(icon.id, { x: newX, y: newY });
      } else if (newX < -900 || newY < -900 || newX > 1000 || newY > 1000) {
        // If dragged far away, consider it a deletion
        onMove(icon.id, { x: -999, y: -999 });
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={iconRef}
      className={`absolute cursor-move ${selected ? 'outline outline-2 outline-primary' : ''}`}
      style={{
        left: `${icon.position.x}%`,
        top: `${icon.position.y}%`,
        zIndex: selected ? 10 : 5,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(icon.id);
      }}
      tabIndex={0}
    >
      <img 
        src={icon.url} 
        alt="Icon"
        style={{ 
          width: `${icon.size || 48}px`, 
          height: `${icon.size || 48}px`,
          objectFit: 'contain',
          filter: icon.style === 'outline' && icon.color ? 
            `drop-shadow(0 0 0 ${icon.color})` : 'none',
          color: icon.color,
        }}
        draggable={false}
      />
    </div>
  );
}
