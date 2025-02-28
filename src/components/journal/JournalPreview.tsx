
import React, { useState } from 'react';
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { BackgroundImageSelector } from './BackgroundImageSelector';
import { DrawingLayer } from './DrawingLayer';
import { ImageFilterSelector } from './ImageFilterSelector';
import { Sticker, Icon, Emoji } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { EmojiContainer } from './EmojiContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  emojis: Emoji[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  onStickerAdd: (sticker: Sticker) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (id: string, position: { x: number; y: number }) => void;
  onIconMove: (id: string, position: { x: number; y: number }) => void;
  onEmojiMove: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate: (id: string, updates: Partial<Icon>) => void;
  onEmojiUpdate: (id: string, updates: Partial<Emoji>) => void;
  onIconSelect: (id: string | null) => void;
  onEmojiSelect: (id: string | null) => void;
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
  emojis,
  textPosition,
  backgroundImage,
  drawing,
  filter,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onEmojiMove,
  onIconUpdate,
  onEmojiUpdate,
  onIconSelect,
  onEmojiSelect,
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
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);

  // Calculate transformed text based on textStyle
  let transformedText = text;
  if (textStyle && textStyle !== 'normal') {
    transformedText = text.split('').map(char => {
      // Skip already complex characters like emojis
      if (char.codePointAt(0) && char.codePointAt(0)! > 0xFFFF) {
        return char;
      }
      
      const styleMap: Record<string, (c: string) => string> = {
        'bold': c => '𝗮'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0)) > 0 ? String.fromCodePoint('𝗮'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0))) : c,
        'italic': c => '𝘢'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0)) > 0 ? String.fromCodePoint('𝘢'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0))) : c,
        'script': c => '𝓪'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0)) > 0 ? String.fromCodePoint('𝓪'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0))) : c,
        'fraktur': c => '𝔞'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0)) > 0 ? String.fromCodePoint('𝔞'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0))) : c,
        'monospace': c => '𝚊'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0)) > 0 ? String.fromCodePoint('𝚊'.codePointAt(0)! + (c.charCodeAt(0) - 'a'.charCodeAt(0))) : c,
      };
      
      // If we have a mapping for this style, use it; otherwise, return the original character
      return styleMap[textStyle] ? styleMap[textStyle](char) : char;
    }).join('');
  }

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

  const handleEmojiMove = (id: string, position: { x: number, y: number }) => {
    onEmojiMove(id, position);
  };

  const handleEmojiSelect = (id: string | null) => {
    setSelectedEmojiId(id);
    onEmojiSelect(id);
  };

  return (
    <div className="flex-grow relative flex items-center justify-center overflow-hidden">
      {/* Sidebar tools */}
      <div className="absolute left-0 top-0 h-full z-10 flex">
        <div className="bg-white border-r h-full flex flex-col p-2 space-y-2 shadow-md">
          <Button
            variant={selectedSidebarItem === 'stickers' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedSidebarItem(selectedSidebarItem === 'stickers' ? null : 'stickers')}
          >
            📷
          </Button>
          <Button
            variant={selectedSidebarItem === 'icons' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedSidebarItem(selectedSidebarItem === 'icons' ? null : 'icons')}
          >
            🎨
          </Button>
          <Button
            variant={selectedSidebarItem === 'backgrounds' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedSidebarItem(selectedSidebarItem === 'backgrounds' ? null : 'backgrounds')}
          >
            🖼️
          </Button>
          <Button
            variant={selectedSidebarItem === 'drawing' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedSidebarItem(selectedSidebarItem === 'drawing' ? null : 'drawing')}
          >
            ✏️
          </Button>
          <Button
            variant={selectedSidebarItem === 'filters' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedSidebarItem(selectedSidebarItem === 'filters' ? null : 'filters')}
          >
            🔍
          </Button>
        </div>

        {selectedSidebarItem && (
          <div className="bg-white border-r h-full w-64 overflow-y-auto shadow-md">
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
        )}
      </div>

      {/* Journal Page */}
      <div 
        className="w-full max-w-3xl h-[800px] bg-white shadow-lg rounded-lg overflow-hidden relative"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : gradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => { 
          onIconSelect(null);
          handleEmojiSelect(null);
        }}
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
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              zIndex: 5,
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
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
          <div
            key={icon.id}
            className="absolute cursor-move"
            style={{
              left: `${icon.position.x}px`,
              top: `${icon.position.y}px`,
              color: icon.color || 'currentColor',
              fontSize: `${icon.size || 24}px`,
              zIndex: 5,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onIconSelect(icon.id);
              const startX = e.clientX - icon.position.x;
              const startY = e.clientY - icon.position.y;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newPosition = {
                  x: moveEvent.clientX - startX,
                  y: moveEvent.clientY - startY
                };
                onIconMove(icon.id, newPosition);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <svg 
              width="1em" 
              height="1em" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d={icon.url} />
            </svg>
          </div>
        ))}

        {/* Emojis */}
        {emojis.map((emoji) => (
          <EmojiContainer
            key={emoji.id}
            emoji={emoji}
            onMove={handleEmojiMove}
            onSelect={handleEmojiSelect}
            onUpdate={onEmojiUpdate}
            isSelected={emoji.id === selectedEmojiId}
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
        >
          {transformedText}
        </div>

        {/* Mood indicator */}
        {mood && (
          <div className="absolute top-4 right-4 text-4xl" title={`Mood: ${mood}`}>
            {mood === 'happy' ? '😊' :
             mood === 'sad' ? '😢' :
             mood === 'angry' ? '😠' :
             mood === 'excited' ? '🤩' :
             mood === 'relaxed' ? '😌' :
             mood === 'anxious' ? '😰' :
             mood === 'grateful' ? '🙏' :
             mood === 'confused' ? '😕' :
             mood === 'calm' ? '😊' : '😐'}
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
