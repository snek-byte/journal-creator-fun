
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextBoxComponent } from './TextBoxComponent';
import { StickerContainer } from './StickerContainer';
import { IconContainer } from './IconContainer';
import { DrawingLayer } from './DrawingLayer';
import { X, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import type { Mood, Sticker, Icon, TextBox, AudioTrack } from '@/types/journal';
import { formatJournalText } from '@/utils/formattedTextUtils';

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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Handle audio setup and play/pause when audioTrack changes
  useEffect(() => {
    // Don't try to do anything if we don't have an audio ref
    if (!audioRef.current) return;
    
    console.log("Audio effect triggered with audio:", audio);
    
    // Clean up function to handle component unmount
    const cleanupAudio = () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (err) {
          console.error("Error pausing audio on cleanup:", err);
        }
      }
    };

    // Reset states if no audio URL is provided
    if (!audio?.url) {
      cleanupAudio();
      setAudioLoaded(false);
      setIsAudioPlaying(false);
      setAudioError(null);
      return cleanupAudio;
    }

    const audioElement = audioRef.current;
    
    try {
      // Explicitly create a new Audio element to avoid stale refs
      audioElement.src = audio.url;
      audioElement.volume = (audio.volume || 50) / 100;
      audioElement.muted = audioMuted;
      audioElement.loop = true;
      setAudioError(null);

      console.log("Audio set up with URL:", audio.url, "playing:", audio.playing);
      
      // Handle playback based on the audio.playing property
      if (audio.playing) {
        // Delay playback to ensure the audio element is ready
        const playbackTimer = setTimeout(() => {
          if (!audioRef.current) return;
          
          try {
            console.log("Attempting to play audio...");
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log("Audio playback started successfully");
                  setIsAudioPlaying(true);
                  setAudioLoaded(true);
                  setAudioError(null);
                })
                .catch(error => {
                  console.error("Error playing audio:", error);
                  setIsAudioPlaying(false);
                  // Show more user-friendly error
                  setAudioLoaded(false);
                  setAudioError(`Couldn't play audio: ${error.message || "Unknown error"}. Try clicking the audio button or upload your own file.`);
                });
            }
          } catch (err) {
            console.error("Exception during audio play attempt:", err);
            setIsAudioPlaying(false);
            setAudioError("Playback failed. Try uploading a different audio file.");
          }
        }, 500); // Increased delay to give more time for loading
        
        // Clean up the timer if the component unmounts
        return () => {
          clearTimeout(playbackTimer);
          cleanupAudio();
        };
      } else {
        // Audio should not be playing
        console.log("Audio not set to play");
        try {
          audioElement.pause();
          setIsAudioPlaying(false);
        } catch (err) {
          console.error("Error pausing audio:", err);
        }
      }
    } catch (err) {
      console.error("Error setting up audio:", err);
      setAudioError("Could not set up audio playback");
      setIsAudioPlaying(false);
    }
    
    return cleanupAudio;
  }, [audio, audioMuted]);

  const handleAudioLoaded = () => {
    console.log("Audio loaded successfully:", audio?.name);
    setAudioLoaded(true);
    setAudioError(null);
    
    // Try to play if it should be playing but isn't yet
    if (audio?.playing && !isAudioPlaying && audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsAudioPlaying(true);
            })
            .catch(err => {
              console.error("Failed to play on load:", err);
            });
        }
      } catch (e) {
        console.error("Error playing on load:", e);
      }
    }
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audioElem = e.currentTarget as HTMLAudioElement;
    const errorMessage = audioElem.error?.message || "Unknown error";
    console.error("Audio error:", errorMessage, e, audio);
    
    setAudioLoaded(false);
    setAudioError(`Couldn't play audio: ${errorMessage}. External audio sources may be unavailable. Try uploading your own.`);
    setIsAudioPlaying(false);
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

  const handleDeleteByMovingOffscreen = (id: string, isIcon: boolean) => {
    const offscreenPosition = { 
      x: -1000, 
      y: -1000 
    };
    
    if (isIcon) {
      onIconMove(id, offscreenPosition);
      
      const iconUpdates: Partial<Icon> = {
        size: 0
      };
      onIconUpdate(id, iconUpdates);
    } else {
      onStickerMove(id, offscreenPosition);
    }
  };

  // Render a minimal fallback if showPreview is false
  if (!showPreview) {
    return null;
  }

  return (
    <div className="flex-1 w-full flex flex-col justify-center items-center p-4 overflow-hidden relative bg-gray-100">
      {audio?.url && (
        <>
          <audio 
            ref={audioRef} 
            onLoadedData={handleAudioLoaded} 
            onError={handleAudioError}
            preload="auto"
            className="hidden" 
            controls={false}
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
              disabled={!!audioError}
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
            onUpdate={(updates) => onTextBoxUpdate(textBox.id, updates)}
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
            onMove={(position) => onStickerMove(sticker.id, position)}
            onSelect={() => onStickerSelect(sticker.id)}
          />
        ))}
        
        {icons.map((icon) => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={icon.id === selectedIconId}
            containerRef={containerRef}
            onMove={(position) => onIconMove(icon.id, position)}
            onUpdate={(updates) => onIconUpdate(icon.id, updates)}
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
