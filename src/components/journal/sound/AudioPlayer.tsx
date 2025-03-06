
import React, { useRef, useEffect, useState } from 'react';
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
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  useEffect(() => {
    if (audioRef.current && audioTrack?.url) {
      console.log("AudioPlayer: Setting audio source to", audioTrack.url);
      
      // Set crossOrigin attribute to allow playing from external domains
      audioRef.current.crossOrigin = "anonymous";
      
      // Set other properties
      audioRef.current.src = audioTrack.url;
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = true;
      
      // Reset the load attempted flag
      setLoadAttempted(false);
    }
  }, [audioTrack?.url]);
  
  useEffect(() => {
    if (!audioRef.current || !audioTrack?.url || !isPlaying || loadAttempted) return;
    
    // Mark that we've attempted to load/play this audio
    setLoadAttempted(true);
    
    console.log("AudioPlayer: Attempting to play audio:", audioTrack.url);
    
    // Add a small delay to allow the audio to be properly initialized
    const playTimer = setTimeout(() => {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("AudioPlayer: Audio playing successfully:", audioTrack.name);
            onLoadSuccess();
          }).catch(error => {
            console.error("AudioPlayer: Error playing audio:", error);
            
            // Provide more specific error messages based on the error type
            let errorMessage = `Couldn't play audio (${error.message}).`;
            
            if (error.name === "NotSupportedError") {
              errorMessage = "Audio format not supported by your browser.";
            } else if (error.name === "NotAllowedError") {
              errorMessage = "Browser blocked audio playback. Try interacting with the page first.";
            } else if (error.name === "AbortError") {
              errorMessage = "Audio playback was aborted.";
            } else if (error.message.includes("CORS")) {
              errorMessage = "Audio source doesn't allow playback from this website (CORS error).";
            }
            
            onLoadError(errorMessage);
            
            toast.error("Audio couldn't be played", {
              description: "Try uploading your own audio file or using Wikimedia Commons sources",
              duration: 5000
            });
          });
        }
      }
    }, 1000);
    
    return () => clearTimeout(playTimer);
  }, [isPlaying, audioTrack, loadAttempted, onLoadError, onLoadSuccess]);
  
  useEffect(() => {
    if (!audioRef.current || !audioTrack?.url) return;
    
    // Handle volume changes
    audioRef.current.volume = volume / 100;
    
    // Handle play/pause
    if (isPlaying) {
      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Error resuming audio:", err);
          });
        }
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, audioTrack]);

  const handleAudioLoaded = () => {
    console.log("Audio loaded successfully:", audioTrack?.name);
    onLoadSuccess();
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const errorElement = e.currentTarget as HTMLAudioElement;
    const errorMessage = errorElement.error 
      ? errorElement.error.message 
      : 'The element has no supported sources';
      
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
