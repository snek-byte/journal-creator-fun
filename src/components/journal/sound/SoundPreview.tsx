
import React, { useRef, useState, useEffect } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from 'sonner';
import type { AudioTrack } from '@/types/journal';

interface SoundPreviewProps {
  sound: AudioTrack;
  onSelect: (sound: AudioTrack) => void;
}

export function SoundPreview({ sound, onSelect }: SoundPreviewProps) {
  const [previewLoadError, setPreviewLoadError] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const handlePreviewStart = () => {
    console.log("Previewing sound:", sound);
    setPreviewLoadError(null);
    setIsPlaying(true);
    
    if (previewAudioRef.current) {
      previewAudioRef.current.src = sound.url;
      previewAudioRef.current.volume = 0.5; // Set preview volume to 50%
      
      console.log("Attempting to play preview sound:", sound.url);
      setTimeout(() => {
        if (previewAudioRef.current) {
          const playPromise = previewAudioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Preview started successfully");
            }).catch(error => {
              console.error("Error playing preview audio:", error);
              setPreviewLoadError(`Couldn't play preview (${error.message}). Audio sources may be unavailable.`);
              toast.error("Couldn't play preview. Try uploading your own audio file.", {
                duration: 5000
              });
              setIsPlaying(false);
            });
          }
        }
      }, 500);
    }
  };

  const handlePreviewEnd = () => {
    setIsPlaying(false);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
  };

  const handlePreviewAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const errorElement = e.currentTarget as HTMLAudioElement;
    const errorMessage = errorElement.error ? errorElement.error.message : 'The element has no supported sources';
    console.error("Preview audio error:", errorMessage, e);
    setPreviewLoadError(`Error loading preview: ${errorMessage}. The source may be unavailable or blocked by your browser.`);
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
      <audio 
        ref={previewAudioRef}
        className="hidden"
        onError={handlePreviewAudioError}
      />
      
      <div className="flex-1 text-sm">{sound.name}</div>
      
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onMouseDown={handlePreviewStart}
                onMouseUp={handlePreviewEnd}
                onMouseLeave={handlePreviewEnd}
                disabled={isPlaying}
              >
                <Play className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview sound</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onSelect(sound)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Use this sound</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {previewLoadError && (
        <div className="text-xs text-red-500 mt-1">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          {previewLoadError}
        </div>
      )}
    </div>
  );
}
