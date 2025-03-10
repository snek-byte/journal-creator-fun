
import React, { useRef, useState, useEffect } from 'react';
import { Sticker } from '@/types/journal';
import { X } from 'lucide-react';

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
  const [isTouching, setIsTouching] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const stickerRef = useRef<HTMLDivElement>(null);
  
  const width = sticker.width || 100;
  const height = sticker.height || 100;
  
  // Detect when the page is being printed
  useEffect(() => {
    const handleBeforePrint = () => {
      setIsPrinting(true);
    };
    
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };
    
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);
  
  // Handle keyboard navigation when sticker is selected
  useEffect(() => {
    if (!selected || !stickerRef.current) return;
    
    // Make the sticker focusable when selected
    stickerRef.current.tabIndex = 0;
    stickerRef.current.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      
      const STEP = 1; // movement step in percentage
      const container = containerRef.current;
      if (!container) return;
      
      // Get current position
      const { x, y } = sticker.position;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onMove(sticker.id, { x: x - STEP, y });
          break;
        case 'ArrowRight':
          e.preventDefault();
          onMove(sticker.id, { x: x + STEP, y });
          break;
        case 'ArrowUp':
          e.preventDefault();
          onMove(sticker.id, { x, y: y - STEP });
          break;
        case 'ArrowDown':
          e.preventDefault();
          onMove(sticker.id, { x, y: y + STEP });
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          // Move the sticker far off-screen to trigger deletion
          onMove(sticker.id, { x: -1000, y: -1000 });
          break;
        case '+':
        case '=':
          if (onResize) {
            e.preventDefault();
            onResize(sticker.id, width + 10);
          }
          break;
        case '-':
          if (onResize) {
            e.preventDefault();
            onResize(sticker.id, Math.max(20, width - 10));
          }
          break;
      }
    };
    
    // Add event listener for keyboard navigation
    stickerRef.current.addEventListener('keydown', handleKeyDown);
    
    return () => {
      if (stickerRef.current) {
        stickerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [selected, sticker.id, sticker.position, onMove, onResize, width, containerRef]);
  
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
      e.preventDefault();
      e.stopPropagation();
      
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
    
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    
    onSelect(sticker.id);
    setIsTouching(true);
    
    // Get container dimensions for percentage calculations
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    
    // Initial touch position
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    // Initial sticker position
    const startPositionX = sticker.position.x;
    const startPositionY = sticker.position.y;
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      // Calculate the move delta in pixels
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // Convert to percentage of container
      const deltaXPercent = (deltaX / containerRect.width) * 100;
      const deltaYPercent = (deltaY / containerRect.height) * 100;
      
      // New position
      const newX = startPositionX + deltaXPercent;
      const newY = startPositionY + deltaYPercent;
      
      // Update sticker position
      onMove(sticker.id, { x: newX, y: newY });
    };
    
    const handleTouchEnd = () => {
      setIsTouching(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
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
      e.preventDefault();
      e.stopPropagation();
      
      // Calculate the resize delta
      const deltaX = e.clientX - startX;
      
      // New size (width and height are the same for square stickers)
      const newSize = Math.max(20, startWidth + deltaX);
      
      // Update sticker size if the callback exists
      if (onResize) {
        onResize(sticker.id, newSize);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMove(sticker.id, { x: -1000, y: -1000 });
  };
  
  // CSS for print mode
  const printStyles = `
    @media print {
      .sticker-control {
        display: none !important;
      }
    }
  `;
  
  return (
    <>
      <style>{printStyles}</style>
      <div
        ref={stickerRef}
        className="absolute cursor-move select-none touch-none"
        style={{
          left: `${sticker.position.x}%`,
          top: `${sticker.position.y}%`,
          transform: 'translate(-50%, -50%)',
          width: `${width}px`,
          height: `${height}px`,
          border: 'none',
          zIndex: selected ? 30 : 20,
          ...style
        }}
        onMouseDown={!isPrinting ? handleDragStart : undefined}
        onTouchStart={!isPrinting ? handleTouchStart : undefined}
        onClick={(e) => {
          if (isPrinting) return;
          e.stopPropagation();
          onSelect(sticker.id);
        }}
        role="button"
        aria-label={`Sticker (use arrow keys to move, Delete to remove${onResize ? ', plus/minus to resize' : ''})`}
        tabIndex={selected && !isPrinting ? 0 : -1}
      >
        <img
          src={sticker.url}
          alt="Sticker"
          className="w-full h-full object-contain"
          draggable={false}
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Delete button - shown when selected but not when printing */}
        {selected && !isPrinting && (
          <button
            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg sticker-control"
            onClick={handleDelete}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onMove(sticker.id, { x: -1000, y: -1000 });
            }}
            aria-label="Delete sticker"
          >
            <X size={14} />
          </button>
        )}
        
        {/* Resize handle - not shown when printing */}
        {selected && onResize && !isDragging && !isResizing && !isPrinting && (
          <div
            className="absolute bottom-0 right-0 w-5 h-5 bg-white border border-gray-300 rounded-full cursor-se-resize transform translate-x-1/3 translate-y-1/3 flex items-center justify-center sticker-control"
            onMouseDown={handleResizeStart}
            aria-label="Resize handle"
            role="button"
            tabIndex={-1}
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
    </>
  );
}
