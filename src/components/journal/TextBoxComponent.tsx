
import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { TextBox } from '@/types/journal';
import { cn } from "@/lib/utils";
import { useTextBoxPosition } from '@/hooks/useTextBoxPosition';
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
  
  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);
  
  // Custom hooks
  const { 
    localPosition, 
    isDragging, 
    handleDragStart, 
    handleDragStop 
  } = useTextBoxPosition(position, containerRef);
  
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
  
  const handleSelect = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
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
  
  const handleDragStartInternal = () => {
    handleDragStart(handleSelect as any);
  };
  
  const handleDragStopInternal = (e: any, d: any) => {
    handleDragStop(d, (updates) => onUpdate(id, updates));
  };
  
  const handleStopResize = (e: any, direction: any, ref: HTMLDivElement, delta: any) => {
    const newWidth = width + delta.width;
    const newHeight = height + delta.height;
    
    setSize({ width: newWidth, height: newHeight });
    onUpdate(id, { width: newWidth, height: newHeight });
  };
  
  // Controls visibility
  const showControls = selected && !isEditing && !isPrinting && !isDrawingMode;
  
  return (
    <>
      <style>{getPrintStyles()}</style>
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
        onDragStart={handleDragStartInternal}
        onDragStop={handleDragStopInternal}
        onResizeStop={handleStopResize}
        bounds="parent"
        enableResizing={selected && !isEditing && !isPrinting && !isDrawingMode}
        disableDragging={isEditing || isPrinting || isDrawingMode}
        onMouseDown={handleSelect}
        onTouchStart={handleSelect}
        dragHandleClassName="drag-handle"
      >
        <div 
          className={cn(
            "relative h-full w-full text-box-border drag-handle",
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
      </Rnd>
    </>
  );
}
