
import React, { useState, useRef, useEffect } from 'react';
import { TextBox } from '@/types/journal';
import { cn } from "@/lib/utils";
import { TextBoxControls } from './TextBoxControls';
import { TextBoxContent } from './TextBoxContent';
import { getPrintStyles } from '@/utils/textBoxUtils';
import { initializeDraggable } from '@/utils/interactUtils';

interface TextBoxComponentProps {
  textBox: TextBox;
  selected: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TextBox>) => void;
  onRemove: (id: string) => void;
  isDrawingMode: boolean;
  style?: React.CSSProperties;
}

export function TextBoxComponent({
  textBox,
  selected,
  containerRef,
  onSelect,
  onUpdate,
  onRemove,
  isDrawingMode,
  style
}: TextBoxComponentProps) {
  const { id, text, position, width, height, font, fontSize, fontWeight, fontColor, gradient, textStyle, rotation, zIndex } = textBox;
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text || '');
  const [size, setSize] = useState({ width, height });
  const [isPrinting, setIsPrinting] = useState(false);
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const interactableRef = useRef<any>(null);
  
  // Convert percentage position to pixels on mount and when container or position changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    const pixelX = (position.x / 100) * containerWidth;
    const pixelY = (position.y / 100) * containerHeight;
    
    setLocalPosition({ x: pixelX, y: pixelY });
  }, [position, containerRef]);
  
  // Initialize interact.js
  useEffect(() => {
    if (!boxRef.current || isDrawingMode || isPrinting || !window.interact) return;
    
    console.log(`Initializing interact.js for box ${id}`);
    
    interactableRef.current = initializeDraggable(boxRef.current, containerRef, {
      enableResize: selected,
      restrictToParent: true,
      onDragStart: () => {
        if (isDrawingMode || isEditing || isPrinting) return;
        onSelect(id);
      },
      onDragMove: (event, position) => {
        if (isDrawingMode || isEditing || isPrinting) return;
        setLocalPosition(position);
      },
      onDragEnd: (event, percentPosition) => {
        if (isDrawingMode || isEditing || isPrinting) return;
        console.log(`Drag end for box ${id} - position: ${percentPosition.x}%, ${percentPosition.y}%`);
        onUpdate(id, { position: percentPosition });
      },
      onResize: (event, newSize) => {
        if (isDrawingMode || isEditing || isPrinting) return;
        setSize(newSize);
      },
      onResizeEnd: (event, finalSize) => {
        if (isDrawingMode || isEditing || isPrinting) return;
        onUpdate(id, { width: finalSize.width, height: finalSize.height });
        
        // Also update position after resize
        const target = event.target;
        const x = parseFloat(target.getAttribute('data-x') || '0');
        const y = parseFloat(target.getAttribute('data-y') || '0');
        
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;
          
          const xPercent = (x / containerWidth) * 100;
          const yPercent = (y / containerHeight) * 100;
          
          onUpdate(id, { position: { x: xPercent, y: yPercent } });
        }
      }
    });
    
    // Clean up interact instance on unmount
    return () => {
      if (interactableRef.current) {
        try {
          interactableRef.current.unset();
          interactableRef.current = null;
        } catch (e) {
          console.error("Error cleaning up interact instance:", e);
        }
      }
    };
  }, [id, isDrawingMode, isEditing, isPrinting, selected, rotation, onSelect, onUpdate, containerRef]);
  
  // Print detection
  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);
  
  // Sync with prop changes for text
  useEffect(() => {
    setEditValue(text || '');
  }, [text]);
  
  // Sync with prop changes for size
  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);
  
  // Activate edit mode when the component becomes selected
  useEffect(() => {
    if (selected && !isDrawingMode && !isPrinting) {
      // Add small delay before setting edit mode
      const timer = setTimeout(() => {
        setIsEditing(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selected, isDrawingMode, isPrinting]);
  
  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditing]);
  
  // Event handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleSaveText = () => {
    setIsEditing(false);
    onUpdate(id, { text: editValue });
  };
  
  const handleBlur = () => {
    if (editValue !== text) {
      handleSaveText();
    } else {
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveText();
    }
    
    // Cancel on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditValue(text || ''); // Reset to original value
    }
  };
  
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };
  
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = ((rotation || 0) + 15) % 360;
    onUpdate(id, { rotation: newRotation });
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
  };
  
  // Controls visibility
  const showControls = selected && !isEditing && !isPrinting && !isDrawingMode;
  
  // Style with position and rotation
  const boxStyle: React.CSSProperties = {
    ...style,
    width: `${size.width}px`,
    height: `${size.height}px`,
    transform: `translate(${localPosition.x}px, ${localPosition.y}px) rotate(${rotation || 0}deg)`,
    zIndex: selected ? zIndex + 10 : zIndex,
    pointerEvents: isDrawingMode ? 'none' : 'auto',
    opacity: isPrinting && !text ? 0 : 1,
    position: 'absolute',
    touchAction: 'none',
    cursor: isEditing ? 'text' : 'move',
  };
  
  return (
    <>
      <style>{getPrintStyles()}</style>
      <div
        ref={boxRef}
        className={cn(
          "text-box-component",
          isEditing ? "cursor-text" : "cursor-move"
        )}
        style={boxStyle}
        onClick={handleSelectClick}
        data-x={localPosition.x}
        data-y={localPosition.y}
        data-id={id}
        data-rotation={rotation || 0}
        data-draggable="true"
      >
        {/* Add an explicit drag handle overlay when not editing */}
        {!isEditing && !isPrinting && (
          <div 
            className="absolute inset-0 z-10 cursor-move" 
            onMouseDown={(e) => {
              // Prevent default only if not in editing mode
              if (!isEditing) {
                e.preventDefault();
              }
            }}
          />
        )}
        
        <div 
          className={cn(
            "relative h-full w-full",
            selected && !isPrinting && !isDrawingMode ? "ring-2 ring-primary ring-inset" : "ring-0 ring-transparent",
            !selected && !isPrinting && !isDrawingMode ? "hover:ring-1 hover:ring-gray-300" : ""
          )}
        >
          {/* Controls */}
          {showControls && (
            <TextBoxControls onDelete={handleDelete} onRotate={handleRotate} />
          )}
          
          {/* Text content */}
          <TextBoxContent
            isEditing={isEditing}
            editValue={editValue}
            text={text}
            font={font}
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontColor={fontColor}
            gradient={gradient}
            textStyle={textStyle}
            rotation={rotation}
            onTextChange={handleTextChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            textAreaRef={textAreaRef}
            isPrinting={isPrinting}
          />
        </div>
      </div>
    </>
  );
}

// Add this to make TypeScript recognize interact from the CDN
declare global {
  interface Window {
    interact: any;
  }
}
