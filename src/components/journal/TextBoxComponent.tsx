
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Rnd } from 'react-rnd';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { X, RotateCw } from "lucide-react";
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
  const [editValue, setEditValue] = useState(text || '');
  const [size, setSize] = useState({ width, height });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isPrinting, setIsPrinting] = useState(false);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { toast } = useToast();
  
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
  
  useEffect(() => {
    setEditValue(text || '');
  }, [text]);
  
  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);
  
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
  
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 10);
    }
  }, [isEditing]);
  
  const calculatePosition = () => {
    if (!containerDimensions.width || !containerDimensions.height) return { x: 0, y: 0 };
    
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
  
  const processText = (text: string) => {
    if (!text) return '';
    
    if (textStyle && textStyle !== 'normal') {
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    return text;
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleSaveText = () => {
    console.log(`TextBox ${id}: Saving text:`, editValue);
    setIsEditing(false);
    onUpdate(id, { text: editValue });
    
    // Removed toast notification
  };
  
  const handleBlur = () => {
    if (editValue !== text) {
      handleSaveText();
    } else {
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveText();
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditValue(text || '');
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selected && !isEditing) {
      setIsEditing(true);
      return;
    }
    
    onSelect(id);
    
    if (!isDrawingMode) {
      setIsEditing(true);
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
    if (!isEditing) {
      onSelect(id);
    }
  };
  
  const handleDragStop = (e: any, d: any) => {
    if (isEditing) return;
    
    const containerWidth = containerDimensions.width || 1;
    const containerHeight = containerDimensions.height || 1;
    
    const xPercent = Math.min(95, Math.max(5, (d.x / containerWidth) * 100));
    const yPercent = Math.min(95, Math.max(5, (d.y / containerHeight) * 100));
    
    onUpdate(id, { position: { x: xPercent, y: yPercent } });
  };
  
  const handleStopResize = (e: any, direction: any, ref: HTMLDivElement, delta: any) => {
    const newWidth = width + delta.width;
    const newHeight = height + delta.height;
    
    setSize({ width: newWidth, height: newHeight });
    onUpdate(id, { width: newWidth, height: newHeight });
  };
  
  const displayText = isPrinting ? (text || '') : (processText(text || '') || 'Tap to edit');
  
  const showControls = selected && !isEditing && !isPrinting && !isDrawingMode;
  
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
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        <div 
          className={cn(
            "relative h-full w-full text-box-border",
            selected && !isPrinting && !isDrawingMode ? "ring-2 ring-primary ring-inset" : "ring-0 ring-transparent",
            !selected && !isPrinting && !isDrawingMode ? "hover:ring-1 hover:ring-gray-300" : ""
          )}
        >
          {showControls && (
            <>
              <button
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10 text-box-controls"
                onClick={handleDelete}
                aria-label="Delete text box"
              >
                <X size={14} />
              </button>
              
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
          
          {isEditing ? (
            <Textarea
              ref={textAreaRef}
              value={editValue}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none border-none focus-visible:ring-0 focus-visible:outline-none p-2"
              style={{ ...getTextStyles(), border: 'none' }}
              autoFocus
            />
          ) : (
            <div
              className="w-full h-full whitespace-pre-wrap overflow-hidden flex items-center justify-center"
            >
              <div style={getTextStyles()}>
                {displayText}
              </div>
            </div>
          )}
        </div>
      </Rnd>
    </>
  );
}
