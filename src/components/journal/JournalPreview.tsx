import React, { useState, useEffect, useRef } from 'react';
import { GripVertical, X, Trash, Image, Check, PenTool, Undo, Redo, Plus, Adjust } from 'lucide-react';
import type { JournalEntry, HistoryEntry, Sticker, Icon, TextBox } from '@/types/journal';
import { StickerContainer } from './StickerContainer';
import { IconContainer } from './IconContainer';
import { TextBoxComponent } from './TextBoxComponent';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DrawingLayer } from './DrawingLayer';
import { unicodeTextStyles } from '@/utils/unicodeTextStyles';
import { useTextBoxPosition } from '@/hooks/useTextBoxPosition';

interface JournalPreviewProps {
  currentEntry: JournalEntry;
  isReadOnly?: boolean;
  onTextPositionChange?: (position: { x: number; y: number }) => void;
  onCurrentStickerChange?: (stickerId: string | null) => void;
  onCurrentIconChange?: (iconId: string | null) => void;
  onRemoveSticker?: (stickerId: string) => void;
  onUpdateStickerPosition?: (stickerId: string, position: { x: number; y: number }) => void;
  onStickerResize?: (stickerId: string, width: number, height: number) => void;
  onRemoveIcon?: (iconId: string) => void;
  onUpdateIconPosition?: (iconId: string, position: { x: number; y: number }) => void;
  onUpdateIconSize?: (iconId: string, size: number) => void;
  onUpdateIconColor?: (iconId: string, color: string) => void;
  onUndoRedoChange?: (undoAvailable: boolean, redoAvailable: boolean) => void;
  isDrawingMode?: boolean;
  onDrawingEnd?: (drawingData: string) => void;
  selectedIconId?: string | null;
  selectedStickerId?: string | null;
  onRemoveTextBox?: (id: string) => void;
  onUpdateTextBox?: (id: string, updates: Partial<TextBox>) => void;
  onSelectTextBox?: (id: string | null) => void;
  selectedTextBoxId?: string | null;
  onTextBoxZIndexChange?: (id: string, change: number) => void;
}

export function JournalPreview({
  currentEntry,
  isReadOnly = false,
  onTextPositionChange,
  onCurrentStickerChange,
  onCurrentIconChange,
  onRemoveSticker,
  onUpdateStickerPosition,
  onStickerResize,
  onRemoveIcon,
  onUpdateIconPosition,
  onUpdateIconSize,
  onUpdateIconColor,
  onUndoRedoChange,
  isDrawingMode = false,
  onDrawingEnd,
  selectedIconId,
  selectedStickerId,
  onRemoveTextBox,
  onUpdateTextBox,
  onSelectTextBox,
  selectedTextBoxId,
  onTextBoxZIndexChange
}: JournalPreviewProps) {
  const [undoAvailable, setUndoAvailable] = useState(false);
  const [redoAvailable, setRedoAvailable] = useState(false);
  const drawingLayerRef = useRef<any>(null);

  useEffect(() => {
    if (onUndoRedoChange) {
      onUndoRedoChange(undoAvailable, redoAvailable);
    }
  }, [undoAvailable, redoAvailable, onUndoRedoChange]);

  // Drag logic for text positioning
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    position,
  } = useTextBoxPosition({
    initialPosition: currentEntry.textPosition || { x: 50, y: 50 },
    isReadOnly,
    onTextPositionChange
  });

  useEffect(() => {
    if (currentEntry.drawing) {
      setUndoAvailable(true);
      setRedoAvailable(false);
    }
  }, [currentEntry.drawing]);

  const handleStickerSelect = (stickerId: string) => {
    if (isReadOnly) return;
    if (onCurrentStickerChange) {
      onCurrentStickerChange(stickerId === selectedStickerId ? null : stickerId);
    }
    if (onCurrentIconChange) {
      onCurrentIconChange(null);
    }
    if (onSelectTextBox) {
      onSelectTextBox(null);
    }
  };

  const handleIconSelect = (iconId: string) => {
    if (isReadOnly) return;
    if (onCurrentIconChange) {
      onCurrentIconChange(iconId === selectedIconId ? null : iconId);
    }
    if (onCurrentStickerChange) {
      onCurrentStickerChange(null);
    }
    if (onSelectTextBox) {
      onSelectTextBox(null);
    }
  };

  const handleRemoveSticker = (stickerId: string) => {
    if (isReadOnly) return;
    if (onRemoveSticker) {
      onRemoveSticker(stickerId);
    }
  };

  const handleRemoveIcon = (iconId: string) => {
    if (isReadOnly) return;
    if (onRemoveIcon) {
      onRemoveIcon(iconId);
    }
  };

  const getTextStyle = () => {
    let textStyle = currentEntry.textStyle || '';

    if (unicodeTextStyles[textStyle]) {
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

    return styleMap[textStyle] || {};
  };

  const renderUnicodeText = (text: string) => {
    const textStyle = currentEntry.textStyle || '';
    if (unicodeTextStyles[textStyle]) {
      return text
        .split('')
        .map(char => {
          const normalChar = char.normalize('NFKD')[0]; // Get base character
          const styleMap = unicodeTextStyles[textStyle];
          return styleMap[normalChar] || char;
        })
        .join('');
    }
    return text;
  };

  const getBackgroundStyling = () => {
    if (currentEntry.backgroundImage) {
      return {
        backgroundImage: `url(${currentEntry.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  const getGradientStyle = () => {
    return {
      backgroundImage: currentEntry.gradient,
    };
  };

  const handleTextBoxSelect = (id: string | null) => {
    if (isReadOnly) return;
    if (onSelectTextBox) {
      onSelectTextBox(id);
    }
    if (onCurrentIconChange) {
      onCurrentIconChange(null);
    }
    if (onCurrentStickerChange) {
      onCurrentStickerChange(null);
    }
  };

  const applyFilter = () => {
    if (currentEntry.filter && currentEntry.filter !== 'none') {
      return `filter ${currentEntry.filter}`;
    }
    return '';
  };

  return (
    <div className="relative h-full overflow-hidden bg-white" id="journal-preview">
      <div 
        className={cn(
          "relative w-full h-full overflow-hidden", 
          applyFilter()
        )}
        style={getBackgroundStyling()}
      >
        {/* Drawing Layer */}
        {onDrawingEnd && (
          <DrawingLayer 
            isActive={isDrawingMode}
            initialDrawing={currentEntry.drawing}
            onDrawingEnd={onDrawingEnd}
          />
        )}
        
        {/* Main Journal Text */}
        {currentEntry.text && !currentEntry.textBoxes?.some(box => box.text === currentEntry.text) && (
          <div
            className={cn(
              "absolute p-4 cursor-move",
              isReadOnly ? "pointer-events-none" : "",
              "transition-opacity duration-300",
              isDrawingMode ? "opacity-50" : "opacity-100",
              "max-w-[60%] break-words"
            )}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: currentEntry.font || 'sans-serif',
              fontSize: currentEntry.fontSize || '16px',
              fontWeight: currentEntry.fontWeight || 'normal',
              color: currentEntry.fontColor || 'black',
              background: currentEntry.gradient ? getGradientStyle() : 'transparent',
              WebkitBackgroundClip: currentEntry.gradient ? 'text' : 'unset',
              WebkitTextFillColor: currentEntry.gradient ? 'transparent' : 'unset',
              ...getTextStyle()
            }}
            onMouseDown={isReadOnly ? undefined : handleMouseDown}
            onMouseMove={isReadOnly ? undefined : handleMouseMove}
            onMouseUp={isReadOnly ? undefined : handleMouseUp}
            dangerouslySetInnerHTML={{ 
              __html: renderUnicodeText(currentEntry.text)
                .replace(/\n/g, '<br>')
                .replace(/(^|\s)(#[^\s#]+)/g, '$1<span style="color:#3b82f6">$2</span>')
            }}
          ></div>
        )}
        
        {/* Stickers Layer */}
        {currentEntry.stickers?.map(sticker => (
          <StickerContainer
            key={sticker.id}
            sticker={sticker}
            isSelected={sticker.id === selectedStickerId}
            isReadOnly={isReadOnly}
            onSelect={() => handleStickerSelect(sticker.id)}
            onRemove={() => handleRemoveSticker(sticker.id)}
            onPositionChange={(position) => {
              if (onUpdateStickerPosition) {
                onUpdateStickerPosition(sticker.id, position);
              }
            }}
            onResize={(width, height) => {
              if (onStickerResize) {
                onStickerResize(sticker.id, width, height);
              }
            }}
          />
        ))}
        
        {/* Icons Layer */}
        {currentEntry.icons?.map(icon => (
          <IconContainer
            key={icon.id}
            icon={icon}
            isSelected={icon.id === selectedIconId}
            isReadOnly={isReadOnly}
            onSelect={() => handleIconSelect(icon.id)}
            onRemove={() => handleRemoveIcon(icon.id)}
            onPositionChange={(position) => {
              if (onUpdateIconPosition) {
                onUpdateIconPosition(icon.id, position);
              }
            }}
            onSizeChange={(size) => {
              if (onUpdateIconSize) {
                onUpdateIconSize(icon.id, size);
              }
            }}
            onColorChange={(color) => {
              if (onUpdateIconColor) {
                onUpdateIconColor(icon.id, color);
              }
            }}
          />
        ))}
        
        {/* Text Boxes Layer */}
        {currentEntry.textBoxes?.map((textBox) => (
          <TextBoxComponent
            key={textBox.id}
            textBox={textBox}
            isSelected={textBox.id === selectedTextBoxId}
            isReadOnly={isReadOnly}
            onSelect={() => handleTextBoxSelect(textBox.id)}
            onRemove={() => {
              if (onRemoveTextBox) {
                onRemoveTextBox(textBox.id);
              }
            }}
            onUpdate={(updates) => {
              if (onUpdateTextBox) {
                onUpdateTextBox(textBox.id, updates);
              }
            }}
            onZIndexChange={(change) => {
              if (onTextBoxZIndexChange) {
                onTextBoxZIndexChange(textBox.id, change);
              }
            }}
          />
        ))}
      </div>
      
      {/* Overlay Controls */}
      {!isReadOnly && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {(!isDrawingMode && (onSelectTextBox || onUpdateTextBox)) && (
            <Button 
              variant="subtle" 
              size="sm" 
              className="rounded-full"
              onClick={() => {
                if (onSelectTextBox) {
                  onSelectTextBox(null); // Deselect any selected text box first
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
              if (onDrawingEnd && typeof isDrawingMode !== 'undefined') {
                onDrawingModeToggle?.(!isDrawingMode);
              }
            }}
          >
            <PenTool className="h-4 w-4 mr-1" />
            Draw
          </Button>
        </div>
      )}
    </div>
  );
}
