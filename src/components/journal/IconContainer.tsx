
import React, { useRef, useState, useEffect } from 'react';
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
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!selected || !iconRef.current) return;
    
    // Make the icon focusable when selected
    iconRef.current.tabIndex = 0;
    iconRef.current.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      
      const STEP = 1; // movement step in percentage
      const container = containerRef.current;
      if (!container) return;
      
      // Get current position
      const { x, y } = icon.position;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onMove(icon.id, { x: x - STEP, y });
          break;
        case 'ArrowRight':
          e.preventDefault();
          onMove(icon.id, { x: x + STEP, y });
          break;
        case 'ArrowUp':
          e.preventDefault();
          onMove(icon.id, { x, y: y - STEP });
          break;
        case 'ArrowDown':
          e.preventDefault();
          onMove(icon.id, { x, y: y + STEP });
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          // Move the icon far off-screen to trigger deletion
          onMove(icon.id, { x: -1000, y: -1000 });
          break;
        case '+':
        case '=':
          e.preventDefault();
          onUpdate(icon.id, { size: (icon.size || 48) + 5 });
          break;
        case '-':
          e.preventDefault();
          onUpdate(icon.id, { size: Math.max(10, (icon.size || 48) - 5) });
          break;
      }
    };
    
    // Add event listener for keyboard navigation
    iconRef.current.addEventListener('keydown', handleKeyDown);
    
    return () => {
      if (iconRef.current) {
        iconRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [selected, icon.id, icon.position, icon.size, onMove, onUpdate, containerRef]);
  
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
      e.preventDefault();
      
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
      className="absolute cursor-move select-none touch-none"
      style={{
        left: `${icon.position.x}%`,
        top: `${icon.position.y}%`,
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: '4px',
        padding: '0',
        zIndex: selected ? 30 : 20,
        ...style
      }}
      onMouseDown={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(icon.id);
      }}
      role="button"
      aria-label={`Icon (use arrow keys to move, Delete to remove, plus/minus to resize)`}
      tabIndex={selected ? 0 : -1}
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
