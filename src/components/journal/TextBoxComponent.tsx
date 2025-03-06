import React, { useState, useRef, useEffect } from 'react';
import { TextBox } from '@/types/journal';
import { cn } from "@/lib/utils";
import { TextBoxControls } from './TextBoxControls';
import { TextBoxContent } from './TextBoxContent';
import { getPrintStyles, setTransform, percentToPixels, pixelsToPercent } from '@/utils/textBoxUtils';
import { GripHorizontal } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  // Convert percentage position to pixels on mount and when container or position changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    const pixelPos = percentToPixels(position, containerWidth, containerHeight);
    
    console.log(`Converting position for ${id}: 
      percent: (${position.x}%, ${position.y}%), 
      container: ${containerWidth}x${containerHeight}, 
      pixels: (${pixelPos.x}px, ${pixelPos.y}px)`);
    
    setPositionPx(pixelPos);
    
    if (boxRef.current) {
      setTransform(boxRef.current, pixelPos.x, pixelPos.y, rotation || 0);
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
    
    // Clean up any previous interact instance for the box
    try {
      window.interact(boxRef.current).unset();
    } catch (e) {
      console.log("No previous interact instance to clean up for box");
    }
    
    // Set up interact for the whole box
    const boxInteractable = window.interact(boxRef.current);
    
    // Handle drag using the entire box area when it's NOT in edit mode
    boxInteractable.draggable({
      inertia: false,
      autoScroll: true,
      modifiers: [
        window.interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      listeners: {
        start: (event) => {
          if (isDrawingMode || isEditing || isPrinting) return;
          
          // Only start dragging if not clicking on controls or handle
          const target = event.target;
          if (target.classList.contains('no-drag') || 
              target.closest('.text-box-controls') || 
              target.closest('.drag-handle') ||
              (handleRef.current && handleRef.current.contains(event.target))) {
            event.interaction.stop();
            return;
          }
          
          console.log(`Drag start for box ${id}`);
          setIsDragging(true);
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
          setTransform(target, newX, newY, rotation || 0);
          
          // Update state
          setPositionPx({ x: newX, y: newY });
        },
        end: (event) => {
          if (isDrawingMode || isEditing || isPrinting) return;
          
          setIsDragging(false);
          
          const target = event.target;
          const x = parseFloat(target.getAttribute('data-x') || '0');
          const y = parseFloat(target.getAttribute('data-y') || '0');
          
          console.log(`Drag end for box ${id}: finalX=${x}, finalY=${y}`);
          
          if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            
            // Convert pixels to percentage
            const percentPos = pixelsToPercent({ x, y }, containerWidth, containerHeight);
            
            console.log(`Updating position for box ${id}: xPercent=${percentPos.x}, yPercent=${percentPos.y}`);
            onUpdate(id, { position: { x: percentPos.x, y: percentPos.y } });
          }
        }
      }
    });
    
    // Setup the drag handle separately if it exists
    if (handleRef.current) {
      // Clean up any previous interact instance for the handle
      try {
        window.interact(handleRef.current).unset();
      } catch (e) {
        console.log("No previous interact instance to clean up for handle");
      }
      
      // Configure handle-specific dragging
      window.interact(handleRef.current).draggable({
        inertia: false,
        autoScroll: true,
        modifiers: [
          window.interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        listeners: {
          start: (event) => {
            if (isDrawingMode || isEditing || isPrinting) return;
            
            console.log(`Handle drag start for box ${id}`);
            setIsDragging(true);
            onSelect(id);
          },
          move: (event) => {
            if (isDrawingMode || isEditing || isPrinting) return;
            
            const box = boxRef.current;
            if (!box) return;
            
            // Get current position from data attributes
            const x = parseFloat(box.getAttribute('data-x') || '0');
            const y = parseFloat(box.getAttribute('data-y') || '0');
            
            // Calculate new position
            const newX = x + event.dx;
            const newY = y + event.dy;
            
            console.log(`Handle dragging box ${id}: dx=${event.dx}, dy=${event.dy}, newX=${newX}, newY=${newY}`);
            
            // Update element transform
            setTransform(box, newX, newY, rotation || 0);
            
            // Update state
            setPositionPx({ x: newX, y: newY });
          },
          end: (event) => {
            if (isDrawingMode || isEditing || isPrinting) return;
            
            setIsDragging(false);
            
            if (!boxRef.current || !containerRef.current) return;
            
            const box = boxRef.current;
            const x = parseFloat(box.getAttribute('data-x') || '0');
            const y = parseFloat(box.getAttribute('data-y') || '0');
            
            console.log(`Handle drag end for box ${id}: finalX=${x}, finalY=${y}`);
            
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            
            // Convert pixels to percentage
            const percentPos = pixelsToPercent({ x, y }, containerWidth, containerHeight);
            
            console.log(`Updating position for box ${id}: xPercent=${percentPos.x}, yPercent=${percentPos.y}`);
            onUpdate(id, { position: { x: percentPos.x, y: percentPos.y } });
          }
        }
      });
    }
    
    // Add resizable if selected
    if (selected) {
      boxInteractable.resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        invert: 'reposition',
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
            setTransform(target, x, y, rotation || 0);
            
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
              
              const percentPos = pixelsToPercent({ x, y }, containerWidth, containerHeight);
              
              console.log(`Updating position for box ${id} after resize: xPercent=${percentPos.x}, yPercent=${percentPos.y}`);
              onUpdate(id, { position: { x: percentPos.x, y: percentPos.y } });
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
        if (boxInteractable) {
          boxInteractable.unset();
          console.log(`Cleaned up interact for box ${id}`);
        }
        
        if (handleRef.current) {
          window.interact(handleRef.current).unset();
          console.log(`Cleaned up interact for handle of box ${id}`);
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
    cursor: isEditing ? 'text' : isDragging ? 'grabbing' : 'grab',
  };
  
  // Setup event handlers for HTML5 draggable
  const handleDragStart = (e: React.DragEvent) => {
    if (isDrawingMode || isEditing || isPrinting) return;
    
    console.log(`Drag start for box ${id}`);
    setIsDragging(true);
    onSelect(id);
    
    // Set the data that will be dragged
    e.dataTransfer.setData('text/plain', id);
    
    // Set the drag image to the current element
    if (boxRef.current) {
      // Use the offset to center the drag image
      const rect = boxRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setDragImage(boxRef.current, offsetX, offsetY);
    }
    
    // Track starting position
    if (boxRef.current) {
      const x = parseFloat(boxRef.current.getAttribute('data-x') || '0');
      const y = parseFloat(boxRef.current.getAttribute('data-y') || '0');
      boxRef.current.setAttribute('data-start-x', x.toString());
      boxRef.current.setAttribute('data-start-y', y.toString());
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    if (isDrawingMode || isEditing || isPrinting || !e.clientX) return;
    
    if (boxRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const boxRect = boxRef.current.getBoundingClientRect();
      
      // Calculate new position relative to container
      const offsetX = e.clientX - containerRect.left;
      const offsetY = e.clientY - containerRect.top;
      
      // Account for box dimensions and cursor position within box
      const startX = parseFloat(boxRef.current.getAttribute('data-start-x') || '0');
      const startY = parseFloat(boxRef.current.getAttribute('data-start-y') || '0');
      
      const newX = offsetX - (boxRect.width / 2);
      const newY = offsetY - (boxRect.height / 2);
      
      // Update element transform
      setTransform(boxRef.current, newX, newY, rotation || 0);
      
      // Update state
      setPositionPx({ x: newX, y: newY });
    }
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    if (isDrawingMode || isEditing || isPrinting) return;
    
    setIsDragging(false);
    
    if (boxRef.current && containerRef.current) {
      const x = parseFloat(boxRef.current.getAttribute('data-x') || '0');
      const y = parseFloat(boxRef.current.getAttribute('data-y') || '0');
      
      console.log(`Drag end for box ${id}: finalX=${x}, finalY=${y}`);
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Convert pixels to percentage
      const percentPos = pixelsToPercent({ x, y }, containerWidth, containerHeight);
      
      console.log(`Updating position for box ${id}: xPercent=${percentPos.x}, yPercent=${percentPos.y}`);
      onUpdate(id, { position: { x: percentPos.x, y: percentPos.y } });
    }
  };
  
  return (
    <>
      <style>{getPrintStyles()}</style>
      <div
        ref={boxRef}
        className={cn(
          "text-box-component",
          isEditing ? "cursor-text" : isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={boxStyle}
        onClick={handleSelectClick}
        data-x={positionPx.x}
        data-y={positionPx.y}
        data-id={id}
        data-rotation={rotation || 0}
        draggable={!isEditing && !isPrinting && !isDrawingMode}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {/* Drag handle bar */}
        {!isPrinting && !isDrawingMode && (
          <div 
            ref={handleRef}
            className="drag-handle absolute top-0 left-0 right-0 h-6 bg-primary/20 hover:bg-primary/40 flex items-center justify-center rounded-t-sm cursor-grab active:cursor-grabbing z-20"
            onMouseDown={(e) => {
              if (!isEditing) {
                e.stopPropagation();
                console.log(`Drag handle mousedown for box ${id}, selecting`);
                onSelect(id);
              }
            }}
          >
            <GripHorizontal size={16} className="text-primary-foreground" />
          </div>
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
            style={{ paddingTop: '8px' }} // Add padding for the drag handle
          />
        </div>
      </div>
    </>
  );
}
