
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Rnd } from 'react-rnd';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { X, Trash2, RotateCw, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const [size, setSize] = useState({ width, height });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  
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
  
  // Update container dimensions when the container resizes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
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
  
  // Focus the textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditing]);
  
  // Update local state when props change
  useEffect(() => {
    setEditValue(text);
  }, [text]);
  
  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);
  
  const processText = (text: string) => {
    if (!text) return '';
    
    if (textStyle && textStyle !== 'normal') {
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    return text;
  };
  
  const handleStopResize = (e: any, direction: any, ref: HTMLDivElement, delta: any) => {
    const newWidth = width + delta.width;
    const newHeight = height + delta.height;
    
    setSize({ width: newWidth, height: newHeight });
    onUpdate(id, { width: newWidth, height: newHeight });
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
    onSelect(id); // Make sure the text box is selected when dragging starts
  };
  
  const handleDragStop = (e: any, d: any) => {
    setIsDragging(false);
    
    // Convert pixel position to percentage
    const containerWidth = containerDimensions.width || 1;
    const containerHeight = containerDimensions.height || 1;
    
    // Calculate percentage position, ensuring it's within bounds (5% to 95%)
    const xPercent = Math.min(95, Math.max(5, (d.x / containerWidth) * 100));
    const yPercent = Math.min(95, Math.max(5, (d.y / containerHeight) * 100));
    
    onUpdate(id, { position: { x: xPercent, y: yPercent } });
  };
  
  const calculatePosition = () => {
    if (!containerDimensions.width || !containerDimensions.height) return { x: 0, y: 0 };
    
    // Ensure position is within bounds (5% to 95%)
    const x = Math.min(95, Math.max(5, position.x)) / 100 * containerDimensions.width;
    const y = Math.min(95, Math.max(5, position.y)) / 100 * containerDimensions.height;
    
    return { x, y };
  };
  
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
      transition: 'all 0.2s ease',
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
  
  const handleRotate = () => {
    // Rotate in 15-degree increments
    const newRotation = ((rotation || 0) + 15) % 360;
    onUpdate(id, { rotation: newRotation });
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawingMode) {
      setIsEditing(true);
      onSelect(id);
    }
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(id, { text: editValue });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      onUpdate(id, { text: editValue });
      toast({
        title: "Text saved",
        description: "Your text has been updated."
      });
    }
    
    // Cancel on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditValue(text); // Reset to original value
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
    toast({
      title: "Text box removed",
      description: "Text box has been deleted."
    });
  };
  
  // Create a CSS class for printing that hides UI elements
  const printStyles = `
    @media print {
      .text-box-controls {
        display: none !important;
      }
      .text-box-border {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        ring: none !important;
      }
    }
  `;
  
  // Convert text to a simple string without showing "Double-click to edit" when printing
  const displayText = isPrinting ? (text || '') : (processText(text) || 'Double-click to edit');
  
  // If editing or printing, hide all controls
  const showControls = selected && !isEditing && !isPrinting && !isDrawingMode;
  
  return (
    <>
      <style>{printStyles}</style>
      <Rnd
        style={{
          ...style,
          zIndex: selected ? zIndex + 10 : zIndex,
          pointerEvents: isDrawingMode ? 'none' : 'auto',
          opacity: isPrinting && !text ? 0 : 1, // Hide empty text boxes when printing
          cursor: 'move'
        }}
        size={{ width: size.width, height: size.height }}
        position={calculatePosition()}
        onDragStart={handleDragStart}
        onDrag={() => setIsDragging(true)}
        onDragStop={handleDragStop}
        onResizeStop={handleStopResize}
        bounds="parent"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        enableResizing={selected && !isEditing && !isPrinting && !isDrawingMode}
        disableDragging={isEditing || isPrinting || isDrawingMode}
      >
        <div 
          className={cn(
            "relative h-full w-full text-box-border",
            selected && !isPrinting && !isDrawingMode ? "ring-2 ring-primary ring-inset" : "ring-0 ring-transparent",
            !selected && !isPrinting && !isDrawingMode ? "hover:ring-1 hover:ring-gray-300" : ""
          )}
          onDoubleClick={handleDoubleClick}
        >
          {/* Delete button */}
          {showControls && (
            <button
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10 text-box-controls"
              onClick={handleDelete}
              onTouchEnd={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
              aria-label="Delete text box"
            >
              <X size={14} />
            </button>
          )}
          
          {/* Rotate button */}
          {showControls && (
            <div className="absolute -top-2 -left-2 flex gap-1 text-box-controls">
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full"
                onClick={handleRotate}
                title="Rotate"
              >
                <RotateCw size={12} />
              </button>
            </div>
          )}
          
          {/* Edit button for mobile/touch devices */}
          {showControls && (
            <button
              className="absolute -bottom-3 right-3 bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full shadow-lg z-10 text-box-controls"
              onClick={() => {
                setIsEditing(true);
                onSelect(id);
              }}
              aria-label="Edit text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          )}
          
          {/* Drag handle - not needed since the entire box is now draggable */}
          
          {isEditing ? (
            <Textarea
              ref={textAreaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none border-none focus-visible:ring-0 focus-visible:outline-none p-2"
              style={{ ...getTextStyles(), border: 'none' }}
              autoFocus
            />
          ) : (
            <div
              className="w-full h-full whitespace-pre-wrap overflow-hidden"
              style={getTextStyles()}
            >
              {displayText}
            </div>
          )}
        </div>
      </Rnd>
    </>
  );
}
