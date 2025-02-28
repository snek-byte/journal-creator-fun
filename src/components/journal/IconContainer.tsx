
import React, { useRef, useState } from 'react';
import { Icon } from '@/types/journal';

interface IconContainerProps {
  icon: Icon;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number, y: number }) => void;
  onUpdate: (id: string, updates: Partial<Icon>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

export function IconContainer({
  icon,
  selected,
  onSelect,
  onMove,
  onUpdate,
  containerRef,
  style = {}
}: IconContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    onSelect(icon.id);
    
    // Get container dimensions for percentage calculations
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    
    // Initial mouse position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Initial icon position
    const startPositionX = icon.position.x;
    const startPositionY = icon.position.y;
    
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
      
      // Update icon position
      onMove(icon.id, { x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Determine if the icon is an SVG from react-icons or a URL
  const isUrlIcon = icon.url.startsWith('http');
  const iconSize = icon.size || 48;
  
  return (
    <div
      ref={iconRef}
      className={`absolute cursor-move select-none touch-none ${selected ? 'z-30' : 'z-20'}`}
      style={{
        left: `${icon.position.x}%`,
        top: `${icon.position.y}%`,
        transform: 'translate(-50%, -50%)',
        border: selected ? '2px dashed rgba(59, 130, 246, 0.7)' : 'none',
        borderRadius: '4px',
        padding: selected ? '2px' : '0',
        ...style
      }}
      onMouseDown={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(icon.id);
      }}
    >
      {isUrlIcon ? (
        // URL-based icon
        <img
          src={icon.url}
          alt="Icon"
          className="block"
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            color: icon.color || 'currentColor',
            filter: icon.style === 'outline' ? undefined : `drop-shadow(0 0 1px ${icon.color || '#000'})`,
            pointerEvents: 'none'
          }}
          draggable={false}
        />
      ) : (
        // SVG icon name (used as a placeholder for now)
        <div
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: icon.color || 'currentColor',
            pointerEvents: 'none'
          }}
        >
          {icon.url}
        </div>
      )}
    </div>
  );
}
