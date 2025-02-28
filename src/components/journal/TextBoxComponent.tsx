
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Rnd } from 'react-rnd';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { X, Trash2, RotateCw, GripVertical } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const [size, setSize] = useState({ width, height });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
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
  
  const handleDragStop = (e: any, d: any) => {
    // Convert pixel position to percentage
    const xPercent = (d.x / containerDimensions.width) * 100;
    const yPercent = (d.y / containerDimensions.height) * 100;
    
    onUpdate(id, { position: { x: xPercent, y: yPercent } });
  };
  
  const calculatePosition = () => {
    if (!containerDimensions.width || !containerDimensions.height) return { x: 0, y: 0 };
    
    // Convert percentage position to pixels
    const x = (position.x / 100) * containerDimensions.width;
    const y = (position.y / 100) * containerDimensions.height;
    
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
  
  const handleDoubleClick = () => {
    if (!isDrawingMode) {
      setIsEditing(true);
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
    }
    
    // Cancel on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditValue(text); // Reset to original value
    }
  };
  
  return (
    <Rnd
      style={{
        ...style,
        zIndex: selected ? zIndex + 10 : zIndex,
        pointerEvents: isDrawingMode ? 'none' : 'auto',
      }}
      size={{ width: size.width, height: size.height }}
      position={calculatePosition()}
      onDragStop={handleDragStop}
      onResizeStop={handleStopResize}
      dragHandleClassName="textbox-drag-handle"
      bounds="parent"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      enableResizing={selected && !isEditing}
      disableDragging={isEditing}
    >
      <div 
        className={cn(
          "relative h-full w-full",
          selected ? "ring-2 ring-primary ring-inset" : "ring-1 ring-transparent hover:ring-gray-300"
        )}
        onDoubleClick={handleDoubleClick}
      >
        {selected && !isEditing && (
          <div className="absolute -top-2 -right-2 flex gap-1">
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full"
              onClick={handleRotate}
              title="Rotate"
            >
              <RotateCw size={12} />
            </button>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 p-1 rounded-full"
              onClick={() => onRemove(id)}
              title="Remove"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
        
        {selected && !isEditing && (
          <div className="textbox-drag-handle absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 p-1 bg-primary/70 text-primary-foreground rounded-l-sm cursor-move">
            <GripVertical size={14} />
          </div>
        )}
        
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
            {processText(text) || 'Double-click to edit'}
          </div>
        )}
      </div>
    </Rnd>
  );
}
