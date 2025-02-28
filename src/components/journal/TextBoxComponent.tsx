
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Rnd } from 'react-rnd';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { X, RotateCw, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Types
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

interface TextBoxControlsProps {
  id: string;
  showControls: boolean;
  onDelete: (e: React.MouseEvent) => void;
  onRotate: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

// Helper functions
const processText = (text: string, textStyle?: string): string => {
  if (!text) return '';
  
  if (textStyle && textStyle !== 'normal') {
    return applyTextStyle(text, textStyle as TextStyle);
  }
  
  return text;
};

const getTextStyles = (
  font: string, 
  fontSize: string, 
  fontWeight: string, 
  fontColor: string, 
  gradient: string, 
  textStyle: string, 
  rotation: number
): React.CSSProperties => {
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

// Sub-components
const TextBoxControls: React.FC<TextBoxControlsProps> = ({ 
  id, 
  showControls, 
  onDelete, 
  onRotate, 
  onEdit 
}) => {
  if (!showControls) return null;
  
  return (
    <>
      {/* Delete button */}
      <button
        className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10 text-box-controls"
        onClick={onDelete}
        aria-label="Delete text box"
      >
        <X size={14} />
      </button>
      
      {/* Rotate button */}
      <div className="absolute -top-2 -left-2 flex gap-1 text-box-controls">
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full"
          onClick={onRotate}
          title="Rotate"
        >
          <RotateCw size={12} />
        </button>
      </div>
      
      {/* Edit button */}
      <button
        className="absolute -bottom-3 right-3 bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full shadow-lg z-10 text-box-controls"
        onClick={onEdit}
        aria-label="Edit text"
      >
        <Edit size={14} />
      </button>
    </>
  );
};

// View mode component
const ViewMode: React.FC<{
  id: string;
  displayText: string;
  textStyles: React.CSSProperties;
  onSelect: (id: string) => void;
  setIsEditing: (value: boolean) => void;
}> = ({ id, displayText, textStyles, onSelect, setIsEditing }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
    setIsEditing(true);
  };
  
  return (
    <div
      className="w-full h-full whitespace-pre-wrap overflow-hidden flex items-center justify-center"
      onClick={handleClick}
    >
      <div style={textStyles}>
        {displayText}
      </div>
    </div>
  );
};

// Edit mode component
const EditMode: React.FC<{
  editValue: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  textStyles: React.CSSProperties;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}> = ({ editValue, textAreaRef, textStyles, onChange, onBlur, onKeyDown }) => {
  return (
    <Textarea
      ref={textAreaRef}
      value={editValue}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="w-full h-full resize-none border-none focus-visible:ring-0 focus-visible:outline-none p-2"
      style={{ ...textStyles, border: 'none' }}
      autoFocus
    />
  );
};

// Main component
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
  
  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Hooks
  const { toast } = useToast();
  
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
  
  // Container dimension updates
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
  
  // Focus textarea when editing
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditing]);
  
  // Sync props to state
  useEffect(() => {
    setEditValue(text || '');
  }, [text]);
  
  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);
  
  // Event handlers
  const handleStopResize = (e: any, direction: any, ref: HTMLDivElement, delta: any) => {
    const newWidth = width + delta.width;
    const newHeight = height + delta.height;
    
    setSize({ width: newWidth, height: newHeight });
    onUpdate(id, { width: newWidth, height: newHeight });
  };
  
  const handleDragStart = () => {
    if (isEditing) return;
    onSelect(id);
  };
  
  const handleDragStop = (e: any, d: any) => {
    if (isEditing) return;
    
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
  
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Rotate in 15-degree increments
    const newRotation = ((rotation || 0) + 15) % 360;
    onUpdate(id, { rotation: newRotation });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleBlur = () => {
    console.log(`TextBox ${id}: Blur event - saving text:`, editValue);
    setIsEditing(false);
    onUpdate(id, { text: editValue });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      console.log(`TextBox ${id}: Saving text with Ctrl+Enter:`, editValue);
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
      setEditValue(text || ''); // Reset to original value
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
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  // Computed values
  const textStyles = getTextStyles(font, fontSize, fontWeight, fontColor, gradient, textStyle || '', rotation || 0);
  const displayText = isPrinting ? (text || '') : (processText(text || '', textStyle) || 'Tap to edit');
  const showControls = selected && !isEditing && !isPrinting && !isDrawingMode;
  
  // CSS for print mode
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
  
  return (
    <>
      <style>{printStyles}</style>
      <Rnd
        style={{
          ...style,
          zIndex: selected ? zIndex + 10 : zIndex,
          pointerEvents: isDrawingMode ? 'none' : 'auto',
          opacity: isPrinting && !text ? 0 : 1, // Hide empty text boxes when printing
          cursor: isEditing ? 'text' : 'pointer'
        }}
        size={{ width: size.width, height: size.height }}
        position={calculatePosition()}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStop={handleStopResize}
        bounds="parent"
        enableResizing={selected && !isEditing && !isPrinting && !isDrawingMode}
        disableDragging={isEditing || isPrinting || isDrawingMode}
      >
        <div 
          className={cn(
            "relative h-full w-full text-box-border",
            selected && !isPrinting && !isDrawingMode ? "ring-2 ring-primary ring-inset" : "ring-0 ring-transparent",
            !selected && !isPrinting && !isDrawingMode ? "hover:ring-1 hover:ring-gray-300" : ""
          )}
        >
          <TextBoxControls
            id={id}
            showControls={showControls}
            onDelete={handleDelete}
            onRotate={handleRotate}
            onEdit={handleEdit}
          />
          
          {isEditing ? (
            <EditMode
              editValue={editValue}
              textAreaRef={textAreaRef}
              textStyles={textStyles}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <ViewMode
              id={id}
              displayText={displayText}
              textStyles={textStyles}
              onSelect={onSelect}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </Rnd>
    </>
  );
}
