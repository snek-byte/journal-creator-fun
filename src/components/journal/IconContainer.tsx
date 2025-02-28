
import React, { useEffect, useRef } from 'react';
import type { Icon } from '@/types/journal';

interface IconContainerProps {
  icon: Icon;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onUpdate: (id: string, updates: Partial<Icon>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function IconContainer({
  icon,
  selected,
  onSelect,
  onMove,
  onUpdate,
  containerRef
}: IconContainerProps) {
  const iconRef = useRef<HTMLDivElement>(null);

  // Global keyboard event listener for delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected && (e.key === 'Delete' || e.key === 'Backspace')) {
        console.log("Delete key pressed for icon:", icon.id);
        onMove(icon.id, { x: -999, y: -999 });
      }
    };

    // Only add the listener when this icon is selected
    if (selected) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, icon.id, onMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Select this icon
    onSelect(icon.id);
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const iconRect = iconRef.current?.getBoundingClientRect();
    
    if (!iconRect) return;
    
    // Calculate the offset from the mouse position to the icon's top-left corner
    const offsetX = e.clientX - iconRect.left;
    const offsetY = e.clientY - iconRect.top;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the new position as a percentage of the container
      const x = ((e.clientX - offsetX - containerRect.left + iconRect.width / 2) / containerRect.width) * 100;
      const y = ((e.clientY - offsetY - containerRect.top + iconRect.height / 2) / containerRect.height) * 100;
      
      // Ensure position stays within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      onMove(icon.id, { x: boundedX, y: boundedY });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Function to determine the appropriate styling for colored icons
  const getIconStyle = () => {
    if (!icon.color || icon.color === '#000000') {
      return {}; // Default styling
    }

    if (icon.style === 'outline') {
      // For outline icons, we apply the color as a stroke color
      return {
        filter: `invert(1) drop-shadow(0 0 0 ${icon.color})`
      };
    } else {
      // For colored icons, we use a combination of filters to apply the color
      return {
        filter: `brightness(0) saturate(100%) ${getColorFilter(icon.color)}`
      };
    }
  };

  // Convert hex color to filter
  const getColorFilter = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    return `invert(${r/255*100}%) sepia(${g/255*100}%) saturate(${b/255*100}%)`;
  };

  return (
    <div
      ref={iconRef}
      className={`absolute cursor-move transition-all ${
        selected ? 'ring-2 ring-primary z-50' : 'hover:ring-1 hover:ring-primary/30 z-40'
      }`}
      style={{
        left: `${icon.position.x}%`,
        top: `${icon.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
      tabIndex={0} // Make focusable for keyboard events
    >
      <img
        src={icon.url}
        alt="Icon"
        style={{
          width: `${icon.size || 48}px`,
          height: `${icon.size || 48}px`,
          ...(icon.color && icon.color !== '#000000' ? {
            filter: `drop-shadow(0 0 0 ${icon.color})`,
            WebkitFilter: `drop-shadow(0 0 0 ${icon.color})`,
          } : {})
        }}
        draggable={false}
      />
    </div>
  );
}
