
import React, { useState, useRef, useEffect } from 'react';
import { TextBox } from '@/types/journal';
import { cn } from "@/lib/utils";
import { TextBoxControls } from './TextBoxControls';
import { TextBoxContent } from './TextBoxContent';
import { getPrintStyles } from '@/utils/textBoxUtils';

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
  const [positionPx, setPositionPx] = useState({ x: 0, y: 0 });
  
  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  
  // Convert percentage position to pixels on mount and when container or position changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    const pixelX = (position.x / 100) * containerWidth;
    const pixelY = (position.y / 100) * containerHeight;
    
    console.log(`Converting position for ${id}: 
      percent: (${position.x}%, ${position.y}%), 
      container: ${containerWidth}x${containerHeight}, 
      pixels: (${pixelX}px, ${pixelY}px)`);
    
    setPositionPx({ x: pixelX, y: pixelY });
    
    if (boxRef.current) {
      boxRef.current.style.transform = `translate(${pixelX}px, ${pixelY}px) rotate(${rotation || 0}deg)`;
      boxRef.current.setAttribute('data-x', pixelX.toString());
      boxRef.current.setAttribute('data-y', pixelY.toString());
    }
  }, [id, position.x, position.y, containerRef, rotation]);
  
  // Initialize interact.js for dragging and resizing
  useEffect(() => {
    if (!boxRef.current || isDrawingMode || isPrinting || !window.interact) {
      console.log(`Cannot initialize interact.js for box ${id}:`, {
        boxRefExists: !!boxRef.current,
        isDrawingMode,
        isPrinting,
        interactExists: !!window.interact
      });
      return;
    }
    
    console.log(`Initializing interact.js for TextBox ${id}`);
    
    // Clean up any previous interact instance
    try {
      window.interact(boxRef.current).unset();
    } catch (e) {
      console.log("No previous interact instance to clean up");
    }
    
    const interactable = window.interact(boxRef.current);
    
    // Configure draggable
    interactable.draggable({
      inertia: false,
      modifiers: [],
      listeners: {
        start: (event) => {
          if (isDrawingMode || isEditing || isPrinting) return;
          console.log(`Drag start for box ${id}`);
          onSelect(id);
        },
        move: (event) => {
          if (isDrawingMode || isEditing || isPrinting) return;
          
          const target = event.target;
          
          // Get current position from data attributes
          const x = parseFloat(target.getAttribute('data-x') || '0');
          const y = parseFloat(target.getAttribute('data-y') || '0');
          
          // Calculate new position
          const newX = x + event.dx;
          const newY = y + event.dy;
          
          console.log(`Dragging box ${id}: dx=${event.dx}, dy=${event.dy}, newX=${newX}, newY=${newY}`);
          
          // Update element transform
          target.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotation || 0}deg)`;
          
          // Update data attributes
          target.setAttribute('data-x', newX.toString());
          target.setAttribute('data-y', newY.toString());
          
          // Update state
          setPositionPx({ x: newX, y: newY });
        },
        end: (event) => {
          if (isDrawingMode || isEditing || isPrinting) return;
          
          const target = event.target;
          const x = parseFloat(target.getAttribute('data-x') || '0');
          const y = parseFloat(target.getAttribute('data-y') || '0');
          
          console.log(`Drag end for box ${id}: finalX=${x}, finalY=${y}`);
          
          if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            
            // Convert pixels to percentage
            const xPercent = (x / containerWidth) * 100;
            const yPercent = (y / containerHeight) * 100;
            
            console.log(`Updating position for box ${id}: xPercent=${xPercent}, yPercent=${yPercent}`);
            onUpdate(id, { position: { x: xPercent, y: yPercent } });
          }
        }
      }
    });
    
    // Add resizable if selected
    if (selected) {
      interactable.resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: (event) => {
            if (isDrawingMode || isEditing || isPrinting) return;
            
            const target = event.target;
            let x = parseFloat(target.getAttribute('data-x') || '0');
            let y = parseFloat(target.getAttribute('data-y') || '0');
            
            // Update position to account for resize
            x += event.deltaRect.left;
            y += event.deltaRect.top;
            
            console.log(`Resize move for box ${id}: width=${event.rect.width}, height=${event.rect.height}, x=${x}, y=${y}`);
            
            // Update element size
            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;
            
            // Update transform
            target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation || 0}deg)`;
            
            // Update attributes
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
            
            // Update state
            setSize({ width: event.rect.width, height: event.rect.height });
            setPositionPx({ x, y });
          },
          end: (event) => {
            if (isDrawingMode || isEditing || isPrinting) return;
            
            console.log(`Resize end for box ${id}: final width=${event.rect.width}, height=${event.rect.height}`);
            
            // Update size in parent
            onUpdate(id, { 
              width: event.rect.width, 
              height: event.rect.height 
            });
            
            // Update position
            const target = event.target;
            const x = parseFloat(target.getAttribute('data-x') || '0');
            const y = parseFloat(target.getAttribute('data-y') || '0');
            
            if (containerRef.current) {
              const containerWidth = containerRef.current.offsetWidth;
              const containerHeight = containerRef.current.offsetHeight;
              
              const xPercent = (x / containerWidth) * 100;
              const yPercent = (y / containerHeight) * 100;
              
              console.log(`Updating position for box ${id} after resize: xPercent=${xPercent}, yPercent=${yPercent}`);
              onUpdate(id, { position: { x: xPercent, y: yPercent } });
            }
          }
        },
        modifiers: [
          window.interact.modifiers.restrictSize({
            min: { width: 50, height: 50 }
          })
        ]
      });
    }
    
    return () => {
      try {
        if (interactable) {
          interactable.unset();
          console.log(`Cleaned up interact for box ${id}`);
        }
      } catch (e) {
        console.error(`Error cleaning up interact for box ${id}:`, e);
      }
    };
  }, [
    id, 
    isDrawingMode, 
    isEditing, 
    isPrinting, 
    selected, 
    rotation, 
    onSelect, 
    onUpdate, 
    containerRef
  ]);
  
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
    if (!isEditing) {
      console.log(`Box ${id} clicked, selecting`);
      onSelect(id);
    }
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
    transform: `translate(${positionPx.x}px, ${positionPx.y}px) rotate(${rotation || 0}deg)`,
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
        data-x={positionPx.x}
        data-y={positionPx.y}
        data-id={id}
        data-rotation={rotation || 0}
      >
        {/* Drag handle overlay when not editing */}
        {!isEditing && !isPrinting && (
          <div 
            className="absolute inset-0 z-10 cursor-move"
            onMouseDown={(e) => {
              if (!isEditing) {
                e.stopPropagation();
                console.log(`Overlay mousedown for box ${id}, selecting`);
                onSelect(id);
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
