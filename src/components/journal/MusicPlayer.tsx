
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music, 
  UploadCloud,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import type { AudioTrack } from '@/types/journal';

interface MusicPlayerProps {
  audioTrack?: AudioTrack;
  onAudioChange?: (audio: AudioTrack) => void;
}

export function MusicPlayer({ audioTrack, onAudioChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(audioTrack?.playing || false);
  const [volume, setVolume] = useState<number>(audioTrack?.volume || 50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackName, setTrackName] = useState<string>(audioTrack?.name || 'No track selected');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Update component state when audioTrack prop changes
  useEffect(() => {
    if (audioTrack) {
      setVolume(audioTrack.volume || 50);
      setIsPlaying(audioTrack.playing || false);
      setTrackName(audioTrack.name || 'Untitled Track');
    }
  }, [audioTrack]);

  // Handle audio element events and state
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Set up audio source and parameters if URL exists
    if (audioTrack?.url) {
      console.log("Setting up audio source:", audioTrack.url);
      audio.src = audioTrack.url;
      audio.volume = volume / 100;
      audio.muted = isMuted;
    } else {
      // Clear audio source if no URL
      audio.src = '';
      return;
    }
    
    // Set up event listeners
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded:", audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
      setAudioError(null);
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => {
      console.log("Audio playing:", audioTrack.name);
      setAudioError(null);
    };
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError("Error playing audio file");
      
      if (onAudioChange && audioTrack) {
        onAudioChange({
          ...audioTrack,
          playing: false
        });
      }
      
      toast.error("Error playing audio file. Try uploading a different format.");
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('error', handleError as EventListener);
    
    // Play or pause based on isPlaying state
    if (isPlaying) {
      setIsLoading(true);
      
      // Small delay to ensure the audio element is properly set up
      setTimeout(() => {
        if (!audioRef.current) return;
        
        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Audio playback started successfully");
                setIsLoading(false);
              })
              .catch(error => {
                console.error("Play error:", error);
                setIsPlaying(false);
                setIsLoading(false);
                setAudioError(`Couldn't play audio: ${error.message}`);
                
                if (onAudioChange && audioTrack) {
                  onAudioChange({
                    ...audioTrack,
                    playing: false
                  });
                }
                
                toast.error("Couldn't play audio. Try uploading your own audio file.");
              });
          }
        } catch (err) {
          console.error("Error in play attempt:", err);
          setIsPlaying(false);
          setIsLoading(false);
          
          if (onAudioChange && audioTrack) {
            onAudioChange({
              ...audioTrack,
              playing: false
            });
          }
        }
      }, 300);
    } else {
      try {
        audio.pause();
      } catch (err) {
        console.error("Error pausing audio:", err);
      }
    }
    
    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('error', handleError as EventListener);
      
      // Always pause audio when component unmounts
      try {
        audio.pause();
      } catch (err) {
        console.error("Error pausing audio on cleanup:", err);
      }
    };
  }, [audioTrack?.url, isPlaying, volume, isMuted, audioTrack, onAudioChange]);

  // Update the audioTrack when play state changes
  useEffect(() => {
    if (audioTrack && onAudioChange && !audioError) {
      onAudioChange({
        ...audioTrack,
        playing: isPlaying,
        volume: volume
      });
    }
  }, [isPlaying, volume, audioTrack, onAudioChange, audioError]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset any previous errors
    setAudioError(null);
    setIsLoading(true);
    
    try {
      const url = URL.createObjectURL(file);
      const name = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
      
      const newAudioTrack: AudioTrack = {
        id: uuidv4(),
        url,
        name,
        volume,
        playing: false // Start paused to avoid immediate playback issues
      };
      
      setTrackName(name);
      // Set playing to false initially 
      setIsPlaying(false);
      
      if (onAudioChange) {
        onAudioChange(newAudioTrack);
        
        // Wait a short period for the audio to load before attempting playback
        setTimeout(() => {
          if (onAudioChange) {
            onAudioChange({
              ...newAudioTrack,
              playing: true
            });
            setIsPlaying(true);
          }
        }, 500);
      }
      
      toast.success(`${name} loaded successfully`);
    } catch (error) {
      console.error("Error loading audio file:", error);
      toast.error("Error loading audio file");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 mr-2 text-primary" />
            <h3 className="text-sm font-medium">Music Player</h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileUpload}
            className="h-8"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Audio
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="text-sm font-medium truncate">
          {trackName || 'No track selected'}
          {audioError && (
            <span className="text-xs text-red-500 ml-2">
              (Error: {audioError})
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            disabled={!audioTrack?.url || isLoading || !!audioError}
            className="flex-1"
          />
          <span className="text-xs">{formatTime(duration || 0)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={!audioTrack?.url || isLoading || !!audioError}
              className="h-8 w-8"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                }
              }}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              disabled={!audioTrack?.url || !!audioError}
              className="h-10 w-10 rounded-full"
              onClick={handlePlayPause}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              disabled={!audioTrack?.url || isLoading || !!audioError}
              className="h-8 w-8"
              onClick={() => {
                if (audioRef.current && duration) {
                  audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
                }
              }}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleMuteToggle}
              disabled={!audioTrack?.url || isLoading || !!audioError}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              disabled={!audioTrack?.url || isLoading || !!audioError}
              className="w-24"
            />
          </div>
        </div>
        
        <audio ref={audioRef} preload="metadata" />
      </CardContent>
    </Card>
  );
}
