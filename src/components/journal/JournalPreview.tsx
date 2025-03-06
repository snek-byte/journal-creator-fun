
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextBoxComponent } from './TextBoxComponent';
import { StickerContainer } from './StickerContainer';
import { IconContainer } from './IconContainer';
import { DrawingLayer } from './DrawingLayer';
import { X, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import type { Mood, Sticker, Icon, TextBox, AudioTrack } from '@/types/journal';

interface JournalPreviewProps {
  showPreview: boolean;
  text: string;
  mood?: Mood;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  stickers: Sticker[];
  icons: Icon[];
  textBoxes: TextBox[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  audio?: AudioTrack;
  onStickerAdd: (sticker: Sticker) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (id: string, position: { x: number; y: number }) => void;
  onIconMove: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate: (id: string, updates: Partial<Icon>) => void;
  onIconSelect: (id: string | null) => void;
  onStickerSelect: (id: string | null) => void;
  onTextBoxAdd: (textBox: TextBox) => void;
  onTextBoxUpdate: (id: string, updates: Partial<TextBox>) => void;
  onTextBoxRemove: (id: string) => void;
  onTextBoxSelect: (id: string | null) => void;
  onTextMove: (position: { x: number; y: number }) => void;
  onTextDragStart: () => void;
  onTextDragEnd: () => void;
  onBackgroundSelect: (url: string) => void;
  onDrawingChange: (drawing: string) => void;
  onFilterChange: (filter: string) => void;
  onTogglePreview: () => void;
  drawingTool: string;
  drawingColor: string;
  brushSize: number;
  isDrawingMode: boolean;
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
  onStickerSelect,
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
  isDrawingMode
}: JournalPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTextBeingDragged, setIsTextBeingDragged] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (audio?.url) {
      console.log("Setting up audio:", audio);
      audioRef.current.src = audio.url;
      audioRef.current.volume = (audio.volume || 50) / 100;
      audioRef.current.muted = audioMuted;
      audioRef.current.loop = true;
      
      if (audio.playing) {
        console.log("Attempting to play audio:", audio.url);
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log("Audio started playing successfully:", audio.name);
                setAudioLoaded(true);
                setAudioError(null);
              }).catch(error => {
                console.error("Error playing audio:", error, audio);
                setAudioLoaded(false);
                setAudioError(`Couldn't play audio: ${error.message}. Try uploading your own audio file.`);
              });
            }
          }
        }, 2000);
      } else {
        console.log("Audio not set to playing, pausing");
        audioRef.current.pause();
      }
    } else {
      console.log("No audio URL provided");
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [audio, audioMuted]);

  const handleAudioLoaded = () => {
    console.log("Audio loaded successfully:", audio?.name);
    setAudioLoaded(true);
    setAudioError(null);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const errorMessage = (e.currentTarget as HTMLAudioElement).error?.message || "Unknown error";
    console.error("Audio error:", errorMessage, e, audio);
    setAudioLoaded(false);
    setAudioError(`Couldn't play audio: ${errorMessage}. External audio sources may be unavailable. Try uploading your own.`);
  };

  const toggleMute = () => {
    console.log("Toggling mute from", audioMuted, "to", !audioMuted);
    setAudioMuted(!audioMuted);
    if (audioRef.current) {
      audioRef.current.muted = !audioMuted;
    }
  };

  const calculateTextStyle = () => {
    switch (textStyle) {
      case 'bold':
        return 'font-bold';
      case 'italic':
        return 'italic';
      case 'underline':
        return 'underline';
      default:
        return 'normal';
    }
  };

  const handleTextPointerDown = () => {
    setIsTextBeingDragged(true);
    onTextDragStart();
  };

  const handleTextPointerUp = () => {
    setIsTextBeingDragged(false);
    onTextDragEnd();
  };

  const handleTextPointerMove = (e: React.PointerEvent) => {
    if (!isTextBeingDragged || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const newX = Math.max(0, Math.min(x, containerRect.width));
    const newY = Math.max(0, Math.min(y, containerRect.height));

    onTextMove({ x: newX, y: newY });
  };

  const calculateFilterStyle = () => {
    switch (filter) {
      case 'sepia':
        return 'sepia(100%)';
      case 'grayscale':
        return 'grayscale(100%)';
      case 'blur':
        return 'blur(3px)';
      case 'brightness':
        return 'brightness(150%)';
      case 'contrast':
        return 'contrast(200%)';
      case 'hue-rotate':
        return 'hue-rotate(90deg)';
      case 'invert':
        return 'invert(80%)';
      case 'saturate':
        return 'saturate(200%)';
      default:
        return 'none';
    }
  };

  const handleTextBoxUpdateFix = (id: string, updates: Partial<TextBox>) => {
    onTextBoxUpdate(id, updates);
  };

  const handleIconMoveFix = (id: string, position: { x: number; y: number }) => {
    onIconMove(id, position);
  };

  const handleIconUpdateFix = (id: string, updates: Partial<Icon>) => {
    onIconUpdate(id, updates);
  };

  const handleStickerMoveFix = (id: string, position: { x: number; y: number }) => {
    onStickerMove(id, position);
  };

  // Completely rewrite this function to fix TypeScript errors
  const handleDeleteByMovingOffscreen = (id: string, isIcon: boolean) => {
    // Define position object with the correct type
    const offscreenPosition: { x: number; y: number } = { x: -1000, y: -1000 };
    
    if (isIcon) {
      // Call the move function with the properly typed position object
      handleIconMoveFix(id, offscreenPosition);
      
      // Create a proper Partial<Icon> object with the correct type
      const iconUpdates: Partial<Icon> = {
        size: 0
      };
      // Pass the properly typed updates object
      handleIconUpdateFix(id, iconUpdates);
    } else {
      // Call the sticker move function with the properly typed position object
      handleStickerMoveFix(id, offscreenPosition);
    }
  };

  return (
    <div
      className={`flex-1 w-full ${showPreview ? 'flex' : 'hidden'} flex-col justify-center items-center p-4 overflow-hidden relative bg-gray-100`}
    >
      {audio?.url && (
        <>
          <audio 
            ref={audioRef} 
            src={audio.url} 
            loop 
            onLoadedData={handleAudioLoaded} 
            onError={handleAudioError}
            preload="auto"
            className="absolute top-0 left-0 w-full z-20" 
            controls
            style={{ opacity: 0.8 }}
          />
          <div className="absolute top-4 right-16 z-30 flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-md ${audioError ? 'bg-red-100 text-red-700' : 'bg-white/80'}`}>
              {audioError ? audioError : (audioLoaded ? audio.name : "Loading audio...")}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white"
              onClick={toggleMute}
            >
              {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </>
      )}
      
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl aspect-[3/4] mx-auto rounded-md overflow-hidden shadow-lg"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !backgroundImage ? '#ffffff' : 'transparent',
          filter: calculateFilterStyle()
        }}
      >
        <DrawingLayer 
          onDrawingChange={onDrawingChange}
          initialDrawing={drawing}
          tool={drawingTool}
          color={drawingColor}
          brushSize={brushSize}
          isDrawingMode={isDrawingMode}
        />
        
        {textBoxes.map((textBox) => (
          <TextBoxComponent
            key={textBox.id}
            textBox={textBox}
            selected={textBox.id === selectedTextBoxId}
            containerRef={containerRef}
            onUpdate={(updates) => handleTextBoxUpdateFix(textBox.id, updates)}
            onRemove={() => onTextBoxRemove(textBox.id)}
            onSelect={() => onTextBoxSelect(textBox.id)}
            isDrawingMode={isDrawingMode}
          />
        ))}
        
        {stickers.map((sticker) => (
          <StickerContainer
            key={sticker.id}
            sticker={sticker}
            selected={sticker.id === selectedStickerId}
            containerRef={containerRef}
            onMove={(position) => handleStickerMoveFix(sticker.id, position)}
            onSelect={() => onStickerSelect(sticker.id)}
          />
        ))}
        
        {icons.map((icon) => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={icon.id === selectedIconId}
            containerRef={containerRef}
            onMove={(position) => handleIconMoveFix(icon.id, position)}
            onUpdate={(updates) => handleIconUpdateFix(icon.id, updates)}
            onSelect={() => onIconSelect(icon.id)}
          />
        ))}
        
        <div
          className="absolute"
          style={{
            top: `${textPosition.y}px`,
            left: `${textPosition.x}px`,
            fontFamily: font,
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: fontColor,
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'grab',
            userSelect: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.4',
            maxWidth: '80%',
            textAlign: 'center',
            ...(textStyle ? { fontStyle: textStyle.includes('italic') ? 'italic' : 'normal' } : {}),
            ...(textStyle ? { textDecoration: textStyle.includes('underline') ? 'underline' : 'none' } : {})
          }}
          draggable
          onPointerDown={handleTextPointerDown}
          onPointerUp={handleTextPointerUp}
          onPointerMove={handleTextPointerMove}
        >
          {text}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 left-2 h-8 w-8 bg-white"
          onClick={onTogglePreview}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {audioError && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700 max-w-md mx-auto">
          <p className="font-medium">Audio Troubleshooting:</p>
          <ul className="list-disc pl-5 text-xs mt-1 space-y-1">
            <li>External sound sources may be blocked by your browser</li>
            <li>Try uploading your own audio file for better results</li>
            <li>Check your system volume and browser permissions</li>
          </ul>
        </div>
      )}
    </div>
  );
}
