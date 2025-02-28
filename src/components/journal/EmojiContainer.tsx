
import React, { useState, useRef, useEffect } from 'react';
import { Emoji } from '@/types/journal';

interface EmojiContainerProps {
  emoji: Emoji;
  onMove: (id: string, position: { x: number, y: number }) => void;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<Emoji>) => void;
  isSelected: boolean;
}

export function EmojiContainer({
  emoji,
  onMove,
  onSelect,
  onUpdate,
  isSelected
}: EmojiContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(emoji.position);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState(emoji.size);
  const [startResizePosition, setStartResizePosition] = useState({ x: 0, y: 0 });
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition(emoji.position);
  }, [emoji.position]);

  // Prevent any clicks from bubbling up
  const stopAllPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any default browser action
    
    setIsDragging(true);
    setStartDragPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onSelect(emoji.id);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent default actions
    
    setIsResizing(true);
    setStartSize(emoji.size);
    setStartResizePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onUpdate(emoji.id, { rotation: (emoji.rotation || 0) + 45 });
  };

  // Handle keyboard deletion for emojis when selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSelected && (e.key === 'Delete' || e.key === 'Backspace')) {
        console.log("Delete key pressed for emoji:", emoji.id);
        onMove(emoji.id, { x: -999, y: -999 });
      }
    };

    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, emoji.id, onMove]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - startDragPosition.x,
          y: e.clientY - startDragPosition.y
        };
        setPosition(newPosition);
      } else if (isResizing) {
        // Calculate size change based on diagonal movement
        const dx = e.clientX - startResizePosition.x;
        const dy = e.clientY - startResizePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const sign = dx + dy > 0 ? 1 : -1;
        const newSize = Math.max(20, startSize + sign * distance * 0.5);
        onUpdate(emoji.id, { size: newSize });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        onMove(emoji.id, position);
        setIsDragging(false);
      }
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startDragPosition, position, emoji.id, onMove, startResizePosition, startSize, onUpdate]);

  const rotateDeg = emoji.rotation || 0;
  
  return (
    <div
      ref={emojiRef}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary shadow-lg z-50' : 'z-40'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: `${emoji.size}px`,
        transform: `rotate(${rotateDeg}deg)`,
        userSelect: 'none',
        // Use these styles to ensure emoji display correctly
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: '"Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Symbol", sans-serif',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={stopAllPropagation}
      onContextMenu={stopAllPropagation}
    >
      <span className="emoji-container">{emoji.symbol}</span>
      
      {isSelected && (
        <>
          {/* Resize handle */}
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border border-gray-400 rounded-full cursor-se-resize z-20"
            onMouseDown={handleResizeStart}
          />
        </>
      )}
    </div>
  );
}
