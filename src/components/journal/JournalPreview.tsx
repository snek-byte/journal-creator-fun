
import React, { useState, useEffect, useRef } from 'react';
import { GripVertical, X, Trash, Image, Check, PenTool, Undo, Redo, Plus } from 'lucide-react';
import type { JournalEntry, HistoryEntry, Sticker, Icon, TextBox } from '@/types/journal';
import { StickerContainer } from './StickerContainer';
import { IconContainer } from './IconContainer';
import { TextBoxComponent } from './TextBoxComponent';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DrawingLayer } from './DrawingLayer';
import { useTextBoxPosition } from '@/hooks/useTextBoxPosition';

// Import unicodeTextStyles correctly
import { unicodeTextStyleMap as unicodeTextStyles } from '@/utils/unicodeTextStyles';

interface JournalPreviewProps {
  // Using currentEntry directly conflicts with properties we're passing individually
  // We'll use individual props instead
  text: string;
  mood?: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle: string;
  stickers: Sticker[];
  icons: Icon[];
  textBoxes: TextBox[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  audio?: any;
  onStickerAdd?: (sticker: Sticker) => void;
  onIconAdd?: (icon: Icon) => void;
  onStickerMove?: (id: string, position: { x: number; y: number }) => void;
  onIconMove?: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate?: (id: string, updates: Partial<Icon>) => void;
  onIconSelect?: (id: string | null) => void;
  onTextBoxAdd?: (textBox: TextBox) => void;
  onTextBoxUpdate?: (id: string, updates: Partial<TextBox>) => void;
  onTextBoxRemove?: (id: string) => void;
  onTextBoxSelect?: (id: string | null) => void;
  onTextMove?: (position: { x: number; y: number }) => void;
  onTextDragStart?: () => void;
  onTextDragEnd?: () => void;
  onBackgroundSelect?: (url: string) => void;
  onDrawingChange?: (drawing: string) => void;
  onFilterChange?: (filter: string) => void;
  onTogglePreview?: () => void;
  drawingTool?: string;
  drawingColor?: string;
  brushSize?: number;
  isDrawingMode?: boolean;
  onDrawingModeToggle?: (enabled: boolean) => void;
  onStickerSelect?: (id: string | null) => void;
  selectedStickerId?: string | null;
  selectedIconId?: string | null;
  selectedTextBoxId?: string | null;
}

export function JournalPreview({
  text,
  mood,
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  textStyle,
  stickers,
  icons,
  textBoxes,
  textPosition,
  backgroundImage,
  drawing,
  filter,
  audio,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onIconUpdate,
  onIconSelect,
  onTextBoxAdd,
  onTextBoxUpdate,
  onTextBoxRemove,
  onTextBoxSelect,
  onTextMove,
  onTextDragStart,
  onTextDragEnd,
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview,
  drawingTool,
  drawingColor,
  brushSize,
  isDrawingMode = false,
  onDrawingModeToggle,
  onStickerSelect,
  selectedStickerId,
  selectedIconId,
  selectedTextBoxId
}: JournalPreviewProps) {
  const [undoAvailable, setUndoAvailable] = useState(false);
  const [redoAvailable, setRedoAvailable] = useState(false);
  const drawingLayerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fix the useTextBoxPosition hook usage
  const textPositionHook = useTextBoxPosition({
    initialPosition: textPosition || { x: 50, y: 50 },
    containerRef: containerRef
  });

  // Expose the correct methods from the hook
  const handleMouseDown = (e: React.MouseEvent) => {
    if (onTextDragStart) onTextDragStart();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Implementation for text movement
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (onTextDragEnd) onTextDragEnd();
  };

  useEffect(() => {
    if (drawing) {
      setUndoAvailable(true);
      setRedoAvailable(false);
    }
  }, [drawing]);

  const handleStickerSelect = (stickerId: string) => {
    if (onStickerSelect) {
      onStickerSelect(stickerId === selectedStickerId ? null : stickerId);
    }
    if (onIconSelect) {
      onIconSelect(null);
    }
    if (onTextBoxSelect) {
      onTextBoxSelect(null);
    }
  };

  const handleIconSelect = (iconId: string) => {
    if (onIconSelect) {
      onIconSelect(iconId === selectedIconId ? null : iconId);
    }
    if (onStickerSelect) {
      onStickerSelect(null);
    }
    if (onTextBoxSelect) {
      onTextBoxSelect(null);
    }
  };

  const handleRemoveSticker = (stickerId: string) => {
    if (onStickerMove) {
      onStickerMove(stickerId, { x: -1000, y: -1000 });
    }
  };

  const handleRemoveIcon = (iconId: string) => {
    if (onIconMove) {
      onIconMove(iconId, { x: -1000, y: -1000 });
    }
  };

  const getTextStyle = () => {
    let currentTextStyle = textStyle || '';

    if (unicodeTextStyles[currentTextStyle]) {
      return {}; // Unicode styling is applied in renderUnicodeText
    }

    const styleMap: any = {
      shadow: {
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      },
      outline: {
        WebkitTextStroke: '1px black',
        textShadow: 'none'
      },
      embossed: {
        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.6), -1px -1px 1px rgba(255, 255, 255, 0.5)'
      },
      glow: {
        textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)'
      }
    };

    return styleMap[currentTextStyle] || {};
  };

  const renderUnicodeText = (textContent: string) => {
    const currentTextStyle = textStyle || '';
    if (unicodeTextStyles[currentTextStyle]) {
      return textContent
        .split('')
        .map(char => {
          const normalChar = char.normalize('NFKD')[0]; // Get base character
          const styleMap = unicodeTextStyles[currentTextStyle];
          return styleMap[normalChar] || char;
        })
        .join('');
    }
    return textContent;
  };

  const getBackgroundStyling = () => {
    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  const getGradientStyle = () => {
    return {
      backgroundImage: gradient,
    };
  };

  const handleTextBoxSelect = (id: string | null) => {
    if (onTextBoxSelect) {
      onTextBoxSelect(id);
    }
    if (onIconSelect) {
      onIconSelect(null);
    }
    if (onStickerSelect) {
      onStickerSelect(null);
    }
  };

  const applyFilter = () => {
    if (filter && filter !== 'none') {
      return `filter ${filter}`;
    }
    return '';
  };

  return (
    <div className="relative h-full overflow-hidden bg-white" id="journal-preview" ref={containerRef}>
      <div 
        className={cn(
          "relative w-full h-full overflow-hidden", 
          applyFilter()
        )}
        style={getBackgroundStyling()}
      >
        {/* Drawing Layer */}
        {onDrawingChange && (
          <DrawingLayer 
            isDrawingMode={isDrawingMode}
            initialDrawing={drawing}
            onDrawingChange={onDrawingChange}
            tool={drawingTool}
            color={drawingColor}
            brushSize={brushSize}
          />
        )}
        
        {/* Main Journal Text */}
        {text && !textBoxes?.some(box => box.text === text) && (
          <div
            className={cn(
              "absolute p-4 cursor-move",
              "transition-opacity duration-300",
              isDrawingMode ? "opacity-50" : "opacity-100",
              "max-w-[60%] break-words"
            )}
            style={{
              left: `${textPosition.x}%`,
              top: `${textPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: font || 'sans-serif',
              fontSize: fontSize || '16px',
              fontWeight: fontWeight || 'normal',
              color: fontColor || 'black',
              background: gradient ? getGradientStyle() : 'transparent',
              WebkitBackgroundClip: gradient ? 'text' : 'unset',
              WebkitTextFillColor: gradient ? 'transparent' : 'unset',
              ...getTextStyle()
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            dangerouslySetInnerHTML={{ 
              __html: renderUnicodeText(text)
                .replace(/\n/g, '<br>')
                .replace(/(^|\s)(#[^\s#]+)/g, '$1<span style="color:#3b82f6">$2</span>')
            }}
          ></div>
        )}
        
        {/* Stickers Layer */}
        {stickers?.map(sticker => (
          <StickerContainer
            key={sticker.id}
            sticker={sticker}
            selected={sticker.id === selectedStickerId}
            onSelect={() => handleStickerSelect(sticker.id)}
            onRemove={() => handleRemoveSticker(sticker.id)}
            onPositionChange={(position) => {
              if (onStickerMove) {
                onStickerMove(sticker.id, position);
              }
            }}
            onResize={(width, height) => {
              // Fix for width parameter type
              if (typeof width === 'string') {
                width = parseInt(width, 10);
              }
              // Pass to parent
            }}
            containerRef={containerRef}
          />
        ))}
        
        {/* Icons Layer */}
        {icons?.map(icon => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={icon.id === selectedIconId}
            onSelect={() => handleIconSelect(icon.id)}
            onRemove={() => handleRemoveIcon(icon.id)}
            onMove={(id, position) => {
              if (onIconMove) {
                onIconMove(id, position);
              }
            }}
            onUpdate={(id, updates) => {
              if (onIconUpdate) {
                onIconUpdate(id, updates);
              }
            }}
            containerRef={containerRef}
          />
        ))}
        
        {/* Text Boxes Layer */}
        {textBoxes?.map((textBox) => (
          <TextBoxComponent
            key={textBox.id}
            textBox={textBox}
            selected={textBox.id === selectedTextBoxId}
            onSelect={() => handleTextBoxSelect(textBox.id)}
            onRemove={() => {
              if (onTextBoxRemove) {
                onTextBoxRemove(textBox.id);
              }
            }}
            onUpdate={(updates) => {
              if (onTextBoxUpdate) {
                onTextBoxUpdate(textBox.id, updates);
              }
            }}
            onZIndexChange={(change) => {
              // Handle z-index change
            }}
          />
        ))}
      </div>
      
      {/* Overlay Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {(!isDrawingMode && (onTextBoxSelect || onTextBoxUpdate)) && (
          <Button 
            variant="subtle" 
            size="sm" 
            className="rounded-full"
            onClick={() => {
              if (onTextBoxSelect) {
                onTextBoxSelect(null); // Deselect any selected text box first
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Text
          </Button>
        )}
        
        <Button
          variant="subtle"
          size="sm"
          className={cn(
            "rounded-full",
            isDrawingMode ? "bg-blue-100 border-blue-300" : ""
          )}
          onClick={() => {
            if (onDrawingChange && typeof isDrawingMode !== 'undefined' && onDrawingModeToggle) {
              onDrawingModeToggle(!isDrawingMode);
            }
          }}
        >
          <PenTool className="h-4 w-4 mr-1" />
          Draw
        </Button>
      </div>
    </div>
  );
}
