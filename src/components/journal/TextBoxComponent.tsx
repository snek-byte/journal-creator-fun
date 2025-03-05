
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Rnd } from 'react-rnd';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { X, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isPrinting, setIsPrinting] = useState(false);
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const boxRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);
  
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
  
  // Container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        };
        setContainerDimensions(newDimensions);
      }
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);
  
  // Initialize and update position based on percentage values
  useEffect(() => {
    if (containerDimensions.width && containerDimensions.height && position) {
      console.log(`Converting position ${position.x}%, ${position.y}% to pixels in container ${containerDimensions.width}x${containerDimensions.height}`);
      const pixelX = (position.x / 100) * containerDimensions.width;
      const pixelY = (position.y / 100) * containerDimensions.height;
      console.log(`Setting local position to ${pixelX}, ${pixelY}`);
      setLocalPosition({ x: pixelX, y: pixelY });
      initializedRef.current = true;
    }
  }, [position, containerDimensions]);
  
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
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [selected, isDrawingMode, isPrinting]);
  
  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      const timer = setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);
  
  // Text styling
  const getTextStyles = (): React.CSSProperties => {
    const usingGradient = gradient && gradient !== '';
    
    const styles: React.CSSProperties = {
      fontFamily: font || 'sans-serif',
      fontSize: fontSize || '16px',
      fontWeight: fontWeight as any || 'normal',
      padding: '0.5rem',
      width: '100%',
      height: '100%',
      border: 'none',
      resize: 'none',
      backgroundColor: 'transparent',
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      overflow: 'hidden',
      boxSizing: 'border-box',
      wordBreak: 'break-word',
    };
    
    if (textStyle) {
      if (textStyle.includes('italic')) {
        styles.fontStyle = 'italic';
      }
      
      if (textStyle.includes('underline')) {
        styles.textDecoration = 'underline';
      }
    }
    
    if (usingGradient) {
      styles.background = gradient;
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.backgroundClip = 'text';
      styles.color = 'transparent';
    } else {
      styles.color = fontColor || 'inherit';
    }
    
    return styles;
  };
  
  // Apply text style
  const processText = (text: string) => {
    if (!text) return '';
    
    if (textStyle && textStyle !== 'normal') {
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    return text;
  };
  
  // Event handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleSaveText = () => {
    console.log(`TextBox ${id}: Saving text:`, editValue);
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
  
  const handleSelect = () => {
    if (!selected) {
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
  
  const handleDragStart = () => {
    console.log(`Starting drag for textbox ${id}`);
    setIsDragging(true);
    handleSelect();
  };
  
  const handleDragStop = (e: any, d: any) => {
    console.log(`Drag stop at position: x=${d.x}, y=${d.y}`);
    
    // First update the local position for immediate UI feedback
    setLocalPosition({ x: d.x, y: d.y });
    
    // Get the container dimensions
    const containerWidth = containerDimensions.width || 1;
    const containerHeight = containerDimensions.height || 1;
    
    // Calculate percentage position based on container dimensions
    const xPercent = Math.max(0, Math.min(100, (d.x / containerWidth) * 100));
    const yPercent = Math.max(0, Math.min(100, (d.y / containerHeight) * 100));
    
    console.log(`Converting to percentage: x=${xPercent}%, y=${yPercent}%`);
    
    // Update the text box position through parent component
    onUpdate(id, { position: { x: xPercent, y: yPercent } });
    
    // End dragging state after a short delay
    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };
  
  const handleStopResize = (e: any, direction: any, ref: HTMLDivElement, delta: any) => {
    const newWidth = width + delta.width;
    const newHeight = height + delta.height;
    
    setSize({ width: newWidth, height: newHeight });
    onUpdate(id, { width: newWidth, height: newHeight });
  };
  
  // Display empty text for new boxes
  const displayText = isPrinting ? (text || '') : (processText(text || ''));
  
  // Controls visibility
  const showControls = selected && !isEditing && !isPrinting && !isDrawingMode;
  
  // Print styles
  const printStyles = `
    @media print {
      .text-box-controls { display: none !important; }
      .text-box-border { border: none !important; }
    }
  `;
  
  return (
    <>
      <style>{printStyles}</style>
      <Rnd
        style={{
          ...style,
          zIndex: selected ? zIndex + 10 : zIndex,
          pointerEvents: isDrawingMode ? 'none' : 'auto',
          opacity: isPrinting && !text ? 0 : 1,
          cursor: isEditing ? 'text' : 'move'
        }}
        size={{ width: size.width, height: size.height }}
        position={localPosition}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStop={handleStopResize}
        bounds="parent"
        enableResizing={selected && !isEditing && !isPrinting && !isDrawingMode}
        disableDragging={isEditing || isPrinting || isDrawingMode}
        onMouseDown={handleSelect}
        onTouchStart={handleSelect}
        dragHandleClassName={isEditing ? undefined : "drag-handle"}
      >
        <div 
          className={cn(
            "relative h-full w-full text-box-border drag-handle",
            selected && !isPrinting && !isDrawingMode ? "ring-2 ring-primary ring-inset" : "ring-0 ring-transparent",
            !selected && !isPrinting && !isDrawingMode ? "hover:ring-1 hover:ring-gray-300" : ""
          )}
        >
          {/* Controls - only shown when selected and not editing */}
          {showControls && (
            <>
              {/* Delete button */}
              <button
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10 text-box-controls"
                onClick={handleDelete}
                aria-label="Delete text box"
              >
                <X size={14} />
              </button>
              
              {/* Rotate button */}
              <div className="absolute -top-2 -left-2 flex gap-1 text-box-controls">
                <button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full"
                  onClick={handleRotate}
                  title="Rotate"
                >
                  <RotateCw size={12} />
                </button>
              </div>
            </>
          )}
          
          {/* Text content - either editing or display mode */}
          {isEditing ? (
            // Edit mode - textarea
            <Textarea
              ref={textAreaRef}
              value={editValue}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none border-none focus-visible:ring-0 focus-visible:outline-none p-2"
              style={{ ...getTextStyles(), border: 'none' }}
              autoFocus
              placeholder="Type here..."
            />
          ) : (
            // View mode - display text
            <div
              className="w-full h-full whitespace-pre-wrap overflow-hidden flex items-center justify-center"
            >
              <div style={getTextStyles()}>
                {displayText || 'Click to edit'}
              </div>
            </div>
          )}
        </div>
      </Rnd>
    </>
  );
}
