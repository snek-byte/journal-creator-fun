
import React, { useState, useRef } from 'react';
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { BackgroundImageSelector } from './BackgroundImageSelector';
import { DrawingLayer } from './DrawingLayer';
import { ImageFilterSelector } from './ImageFilterSelector';
import { Sticker, Icon } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/button';

interface JournalPreviewProps {
  showPreview: boolean;
  text: string;
  mood?: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  stickers: Sticker[];
  icons: Icon[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  onStickerAdd: (sticker: Sticker) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (id: string, position: { x: number; y: number }) => void;
  onIconMove: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate: (id: string, updates: Partial<Icon>) => void;
  onIconSelect: (id: string | null) => void;
  onTextMove: (position: { x: number; y: number }) => void;
  onTextDragStart: () => void;
  onTextDragEnd: () => void;
  onBackgroundSelect: (url: string) => void;
  onDrawingChange: (dataUrl: string) => void;
  onFilterChange: (filter: string) => void;
  onTogglePreview: () => void;
}

export function JournalPreview({
  showPreview,
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
  textPosition,
  backgroundImage,
  drawing,
  filter,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onIconUpdate,
  onIconSelect,
  onTextMove,
  onTextDragStart,
  onTextDragEnd,
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview,
}: JournalPreviewProps) {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<'stickers' | 'icons' | 'backgrounds' | 'drawing' | 'filters' | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [startTextPosition, setStartTextPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Process text to ensure emojis are properly displayed
  const processText = (input: string) => {
    if (!textStyle || textStyle === 'normal') {
      return input;
    }
    
    // Process each character, skipping emojis
    let result = '';
    let i = 0;
    while (i < input.length) {
      const codePoint = input.codePointAt(i);
      
      // Check if this is an emoji (emoji range or multi-code sequence)
      const isEmoji = 
        (codePoint && codePoint >= 0x1F000 && codePoint <= 0x1FFFF) || // Emoji range
        (codePoint && codePoint >= 0x1F1E6 && codePoint <= 0x1F1FF) || // Regional indicator symbols for flags
        (codePoint && codePoint >= 0x1F3FB && codePoint <= 0x1F3FF); // Skin tone modifiers
     
      if (isEmoji) {
        // For emoji, wrap in a span with the emoji class and skip the surrogate pair or sequence
        // Flag emojis consist of two regional indicator symbols
        const nextCodePoint = input.codePointAt(i + 2);
        const isFlagEmoji = 
          codePoint && codePoint >= 0x1F1E6 && codePoint <= 0x1F1FF && 
          nextCodePoint && nextCodePoint >= 0x1F1E6 && nextCodePoint <= 0x1F1FF;
          
        if (isFlagEmoji) {
          // Handle flag emoji (2 code points, each taking 2 UTF-16 code units)
          const flag = input.substring(i, i + 4);
          result += `<span class="emoji emoji-flags">${flag}</span>`;
          i += 4; // Move past both regional indicator symbols
        } else {
          // Handle regular emoji (1 code point, may take 1 or 2 UTF-16 code units)
          const charLength = codePoint! > 0xFFFF ? 2 : 1; // Surrogate pair check
          const emoji = input.substring(i, i + charLength);
          result += `<span class="emoji">${emoji}</span>`;
          i += charLength;
        }
      } else {
        // For normal characters, apply text styling transformation
        const char = input[i];
        const transformed = applyTextStyle(char, textStyle);
        result += transformed;
        i += 1;
      }
    }
    
    return result;
  };
  
  // Apply text styling to a single character
  const applyTextStyle = (char: string, style: string): string => {
    // Skip non-alphabet characters
    if (!/[a-zA-Z]/.test(char)) {
      return char;
    }
    
    // Different transformations based on style
    switch (style) {
      case 'bold':
        return transformToUnicode(char, 0x1D400, 0x1D41A);
      case 'italic':
        return transformToUnicode(char, 0x1D434, 0x1D44E);
      case 'script':
        return transformToUnicode(char, 0x1D49C, 0x1D4B6);
      case 'fraktur':
        return transformToUnicode(char, 0x1D504, 0x1D51E);
      case 'monospace':
        return transformToUnicode(char, 0x1D670, 0x1D68A);
      default:
        return char;
    }
  };
  
  // Helper to transform characters to Unicode
  const transformToUnicode = (char: string, upperStart: number, lowerStart: number): string => {
    const code = char.charCodeAt(0);
    
    if (code >= 65 && code <= 90) { // A-Z
      return String.fromCodePoint(upperStart + (code - 65));
    }
    
    if (code >= 97 && code <= 122) { // a-z
      return String.fromCodePoint(lowerStart + (code - 97));
    }
    
    return char;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingText(true);
    onTextDragStart();
    setMousePosition({ x: e.clientX, y: e.clientY });
    setStartDragPosition({ x: e.clientX, y: e.clientY });
    setStartTextPosition({ ...textPosition });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingText) {
      const dx = e.clientX - startDragPosition.x;
      const dy = e.clientY - startDragPosition.y;
      const newPosition = {
        x: startTextPosition.x + dx,
        y: startTextPosition.y + dy
      };
      onTextMove(newPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDraggingText) {
      setIsDraggingText(false);
      onTextDragEnd();
    }
  };

  // Process the journal text with our enhanced emoji handler
  const processedText = processText(text);

  return (
    <div className="flex-grow relative flex items-center justify-center overflow-hidden">
      {/* Sidebar tools */}
      <div className="absolute left-0 top-0 h-full z-10 flex">
        <div className="bg-white border-r h-full flex flex-col p-2 space-y-2 shadow-md">
          <Button
            variant={selectedSidebarItem === 'stickers' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => selectedSidebarItem === 'stickers' ? setSelectedSidebarItem(null) : setSelectedSidebarItem('stickers')}
          >
            <span className="emoji">📷</span>
          </Button>
          <Button
            variant={selectedSidebarItem === 'icons' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => selectedSidebarItem === 'icons' ? setSelectedSidebarItem(null) : setSelectedSidebarItem('icons')}
          >
            <span className="emoji">🎨</span>
          </Button>
          <Button
            variant={selectedSidebarItem === 'backgrounds' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => selectedSidebarItem === 'backgrounds' ? setSelectedSidebarItem(null) : setSelectedSidebarItem('backgrounds')}
          >
            <span className="emoji">🖼️</span>
          </Button>
          <Button
            variant={selectedSidebarItem === 'drawing' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => selectedSidebarItem === 'drawing' ? setSelectedSidebarItem(null) : setSelectedSidebarItem('drawing')}
          >
            <span className="emoji">✏️</span>
          </Button>
          <Button
            variant={selectedSidebarItem === 'filters' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => selectedSidebarItem === 'filters' ? setSelectedSidebarItem(null) : setSelectedSidebarItem('filters')}
          >
            <span className="emoji">🔍</span>
          </Button>
        </div>

        {selectedSidebarItem && (
          <div className="bg-white border-r h-full w-64 overflow-y-auto shadow-md">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="text-sm font-medium">
                {selectedSidebarItem === 'stickers' ? 'Stickers' :
                 selectedSidebarItem === 'icons' ? 'Icons' :
                 selectedSidebarItem === 'backgrounds' ? 'Backgrounds' :
                 selectedSidebarItem === 'drawing' ? 'Drawing Tool' :
                 selectedSidebarItem === 'filters' ? 'Image Filters' : 'Tools'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedSidebarItem(null)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-2">
              {selectedSidebarItem === 'stickers' && (
                <StickerSelector onStickerSelect={onStickerAdd} />
              )}
              {selectedSidebarItem === 'icons' && (
                <IconSelector onIconSelect={onIconAdd} />
              )}
              {selectedSidebarItem === 'backgrounds' && (
                <BackgroundImageSelector onImageSelect={onBackgroundSelect} />
              )}
              {selectedSidebarItem === 'drawing' && (
                <DrawingLayer 
                  width={800} 
                  height={600} 
                  onDrawingChange={onDrawingChange} 
                  initialDrawing={drawing}
                />
              )}
              {selectedSidebarItem === 'filters' && (
                <ImageFilterSelector 
                  onFilterSelect={onFilterChange} 
                  currentFilter={filter || 'none'}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Journal Page */}
      <div 
        ref={containerRef}
        className="w-full max-w-3xl h-[800px] bg-white shadow-lg rounded-lg overflow-hidden relative"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : gradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => onIconSelect(null)}
      >
        {/* Filter overlay */}
        {filter && filter !== 'none' && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: filter === 'grayscale' ? 'grayscale(1)' : 
                     filter === 'sepia' ? 'sepia(0.8)' : 
                     filter === 'blur' ? 'blur(2px)' :
                     filter === 'brightness' ? 'brightness(1.2)' :
                     filter === 'contrast' ? 'contrast(1.5)' : 'none'
            }}
          ></div>
        )}

        {/* Drawing layer */}
        {drawing && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${drawing})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.8
            }}
          ></div>
        )}

        {/* Stickers */}
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="absolute cursor-move"
            style={{
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              zIndex: 5,
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const startX = e.clientX - sticker.position.x;
              const startY = e.clientY - sticker.position.y;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newPosition = {
                  x: moveEvent.clientX - startX,
                  y: moveEvent.clientY - startY
                };
                onStickerMove(sticker.id, newPosition);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <img 
              src={sticker.url} 
              alt="Sticker" 
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              draggable={false}
            />
          </div>
        ))}

        {/* Icons */}
        {icons.map((icon) => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={false}
            onSelect={onIconSelect}
            onMove={onIconMove}
            containerRef={containerRef}
          />
        ))}

        {/* Text */}
        <div
          className={`absolute p-4 ${isDraggingText ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            left: `${textPosition.x}px`,
            top: `${textPosition.y}px`,
            fontFamily: font,
            fontSize,
            fontWeight,
            color: fontColor,
            maxWidth: '80%',
            textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
            zIndex: isDraggingText ? 20 : 1,
            userSelect: 'none',
            borderRadius: '5px',
            background: isDraggingText ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            border: isDraggingText ? '1px dashed rgba(0, 0, 0, 0.2)' : 'none',
            whiteSpace: 'pre-wrap',
          }}
          onMouseDown={handleMouseDown}
          dangerouslySetInnerHTML={{ __html: processedText }}
        >
        </div>

        {/* Mood indicator */}
        {mood && (
          <div className="absolute top-4 right-4 text-4xl emoji" title={`Mood: ${mood}`}>
            {mood === 'happy' ? '😊' :
             mood === 'sad' ? '😢' :
             mood === 'angry' ? '😠' :
             mood === 'excited' ? '🤩' :
             mood === 'relaxed' ? '😌' :
             mood === 'anxious' ? '😰' :
             mood === 'grateful' ? '🙏' :
             mood === 'confused' ? '😕' :
             mood === 'stressed' ? '😫' :
             mood === 'calm' ? '😇' : '😐'}
          </div>
        )}
      </div>

      {/* Toggle preview button */}
      <Button
        variant="ghost"
        className="absolute bottom-4 right-4"
        onClick={onTogglePreview}
      >
        {showPreview ? <ChevronRight /> : <ChevronLeft />}
      </Button>
    </div>
  );
}
