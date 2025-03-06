
import React, { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { AudioTrack } from '@/types/journal';
import { toast } from 'sonner';

interface AudioPlayerProps {
  audioTrack?: AudioTrack;
  isPlaying: boolean;
  volume: number;
  onLoadError: (error: string) => void;
  onLoadSuccess: () => void;
}

export function AudioPlayer({
  audioTrack,
  isPlaying,
  volume,
  onLoadError,
  onLoadSuccess
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current && audioTrack?.url) {
      console.log("AudioPlayer: Setting audio source to", audioTrack.url);
      audioRef.current.src = audioTrack.url;
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = true;
      
      if (isPlaying) {
        console.log("AudioPlayer: Attempting to play audio:", audioTrack.url);
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log("AudioPlayer: Audio playing successfully:", audioTrack.name);
              }).catch(error => {
                console.error("AudioPlayer: Error playing audio:", error);
                onLoadError(`Couldn't play audio (${error.message}). External audio sources may be unavailable.`);
                toast.error("Audio couldn't be played. Try uploading your own audio file.", {
                  duration: 5000
                });
              });
            }
          }
        }, 2000);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, audioTrack, onLoadError]);

  const handleAudioLoaded = () => {
    console.log("Audio loaded successfully:", audioTrack?.name);
    onLoadSuccess();
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const errorElement = e.currentTarget as HTMLAudioElement;
    const errorMessage = errorElement.error ? errorElement.error.message : 'The element has no supported sources';
    console.error("Audio error:", errorMessage, e);
    onLoadError(`Error loading audio: ${errorMessage}. The source may be unavailable or blocked by your browser.`);
  };

  return (
    <div>
      <audio 
        ref={audioRef} 
        onLoadedData={handleAudioLoaded} 
        onError={handleAudioError}
        preload="auto"
        className="w-full"
        controls
      />
      
      <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm font-medium">Audio Source Issues</AlertTitle>
        <AlertDescription className="text-xs">
          External audio sources may be blocked by your browser or CORS policies. 
          <strong className="block mt-1">We recommend using Wikimedia Commons or uploading your own audio files for the best experience.</strong>
        </AlertDescription>
      </Alert>
    </div>
  );
}
