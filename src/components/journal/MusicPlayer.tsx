
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
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import type { AudioTrack } from '@/types/journal';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MusicPlayerProps {
  audioTrack?: AudioTrack;
  onAudioChange?: (audio: AudioTrack) => void;
}

export function MusicPlayer({ audioTrack, onAudioChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackName, setTrackName] = useState<string>('No track selected');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);
  
  // Update local state from audioTrack prop only on mount or when audioTrack changes
  useEffect(() => {
    if (audioTrack) {
      setVolume(audioTrack.volume || 50);
      setTrackName(audioTrack.name || 'Untitled Track');
      
      // Initialize audio source when component mounts or audioTrack changes
      if (audioTrack.url && audioRef.current) {
        console.log("Setting audio source from prop:", audioTrack.url);
        audioRef.current.src = audioTrack.url;
        audioRef.current.volume = (audioTrack.volume || 50) / 100;
        audioRef.current.muted = isMuted;
        setAudioInitialized(true);
        
        // Set playing state from prop but don't auto-play yet
        setIsPlaying(audioTrack.isPlaying || false);
      }
    } else {
      setTrackName('No track selected');
      setIsPlaying(false);
    }
  }, [audioTrack?.id]); // Only depend on audioTrack.id to prevent excessive re-renders

  // Handle play/pause state changes separately
  useEffect(() => {
    if (!audioRef.current || !audioTrack?.url) return;
    
    if (isPlaying) {
      setIsLoading(true);
      console.log("Attempting to play audio:", audioTrack.name);
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            setIsLoading(false);
            setAudioError(null);
            
            // Only update the parent if this was a local state change
            if (onAudioChange && audioTrack && audioTrack.isPlaying !== isPlaying) {
              onAudioChange({
                ...audioTrack,
                isPlaying: true
              });
            }
          })
          .catch(error => {
            console.error("Play error:", error);
            setIsPlaying(false);
            setIsLoading(false);
            setAudioError(`Couldn't play audio: ${error.message}`);
            
            if (onAudioChange && audioTrack) {
              onAudioChange({
                ...audioTrack,
                isPlaying: false
              });
            }
          });
      }
    } else {
      try {
        audioRef.current.pause();
        
        // Only update the parent if this was a local state change
        if (onAudioChange && audioTrack && audioTrack.isPlaying !== isPlaying) {
          onAudioChange({
            ...audioTrack,
            isPlaying: false
          });
        }
      } catch (err) {
        console.error("Error pausing audio:", err);
      }
    }
    
    // Clean up function
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (err) {
          console.error("Error in cleanup:", err);
        }
      }
    };
  }, [isPlaying, audioTrack?.url]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      
      if (onAudioChange && audioTrack && audioTrack.volume !== volume) {
        onAudioChange({
          ...audioTrack,
          volume
        });
      }
    }
  }, [volume]);

  // Handle mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded:", audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
      setAudioError(null);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onAudioChange && audioTrack) {
        onAudioChange({
          ...audioTrack,
          isPlaying: false
        });
      }
    };
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError("Error playing audio file");
      
      if (onAudioChange && audioTrack) {
        onAudioChange({
          ...audioTrack,
          isPlaying: false
        });
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioTrack, onAudioChange]);

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
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
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
    
    setAudioError(null);
    setIsLoading(true);
    
    try {
      const url = URL.createObjectURL(file);
      const name = file.name.replace(/\.[^/.]+$/, "");
      
      const newAudioTrack: AudioTrack = {
        id: uuidv4(),
        url,
        name,
        volume,
        isPlaying: false,
        category: 'custom'
      };
      
      setTrackName(name);
      setIsPlaying(false);
      setAudioInitialized(false);
      
      if (onAudioChange) {
        onAudioChange(newAudioTrack);
        
        // Wait for the audio to be loaded before playing
        setTimeout(() => {
          setIsPlaying(true);
        }, 1000);
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
        </div>
        
        {audioError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Audio Error</AlertTitle>
            <AlertDescription className="text-xs">
              {audioError}. Try uploading your own audio file.
            </AlertDescription>
          </Alert>
        )}
        
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
