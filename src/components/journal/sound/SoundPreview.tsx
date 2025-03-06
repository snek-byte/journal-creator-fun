
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Check, Plus, AlertCircle } from "lucide-react";
import type { AudioTrack } from '@/types/journal';
import { toast } from 'sonner';

interface SoundPreviewProps {
  sound: AudioTrack;
  onSelect: (sound: AudioTrack) => void;
}

export function SoundPreview({ sound, onSelect }: SoundPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create audio element only when component mounts
    if (typeof window !== 'undefined') {
      const newAudio = new Audio();
      
      // Set crossOrigin attribute for external resources
      newAudio.crossOrigin = "anonymous";
      
      // Only set the source after we've configured the audio element
      newAudio.src = sound.url;
      
      setAudio(newAudio);
    }
    
    return () => {
      // Clean up audio when component unmounts
      if (audio) {
        audio.pause();
        audio.src = "";
        setAudio(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (audio) {
        audio.currentTime = 0;
      }
    };
    
    const handleTimeUpdate = () => {
      if (audio) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const errorMessage = target.error 
        ? `Error: ${target.error.message}` 
        : "Couldn't play preview. Audio sources may be unavailable.";
      
      console.error("Audio preview error:", errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
    };
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      
      audio.pause();
    };
  }, [audio]);
  
  const togglePlayback = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      // Pause all other playing audio elements
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audio) {
          el.pause();
        }
      });
      
      // Play this audio
      setError(null); // Clear previous errors
      
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        const errorMessage = err.message || "Playback failed due to CORS restrictions or unavailable source";
        setError(errorMessage);
        
        // Show a toast to explain the issue
        if (err.name === "NotSupportedError" || err.name === "NotAllowedError") {
          toast.error("Audio source is not supported or blocked by your browser", {
            description: "Try sources from Wikimedia Commons instead",
            duration: 5000
          });
        }
      });
    }
  };
  
  const handleSelect = () => {
    if (error) return;
    
    setIsSelected(!isSelected);
    
    const selectedTrack: AudioTrack = {
      ...sound,
      playing: false,
      volume: 100
    };
    
    onSelect(selectedTrack);
  };
  
  return (
    <div 
      className={`flex items-center justify-between p-2 border-b hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={togglePlayback}
          disabled={!!error}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div>
          <div className="text-sm font-medium">{sound.name}</div>
          <div className="text-xs text-gray-500">{sound.category}</div>
          {error && (
            <div className="text-xs text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[150px]">Audio unavailable</span>
            </div>
          )}
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="ml-auto h-7"
        onClick={handleSelect}
        disabled={!!error}
      >
        {isSelected ? (
          <><Check className="h-4 w-4 mr-1" /> Added</>
        ) : (
          <><Plus className="h-4 w-4 mr-1" /> Add</>
        )}
      </Button>
      
      {isPlaying && (
        <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: `${progress}%` }}></div>
      )}
    </div>
  );
}
