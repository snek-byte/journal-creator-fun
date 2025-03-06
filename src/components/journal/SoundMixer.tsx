
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Volume2, Volume1, VolumeX, Play, Pause, Upload } from "lucide-react";
import type { AudioTrack } from '@/types/journal';

interface SoundMixerProps {
  audioTrack?: AudioTrack;
  onAudioChange: (audio: AudioTrack) => void;
}

export function SoundMixer({ audioTrack, onAudioChange }: SoundMixerProps) {
  const [volume, setVolume] = useState<number>(audioTrack?.volume || 50);
  const [isPlaying, setIsPlaying] = useState<boolean>(audioTrack?.playing || false);
  const [trackName, setTrackName] = useState<string>(audioTrack?.name || '');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, audioTrack?.url]);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioTrack) {
      onAudioChange({
        ...audioTrack,
        volume: newVolume
      });
    }
  };

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    if (audioTrack) {
      onAudioChange({
        ...audioTrack,
        playing: newPlayingState
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    
    setTrackName(name);
    
    const newAudioTrack: AudioTrack = {
      url,
      name,
      volume,
      playing: false
    };
    
    onAudioChange(newAudioTrack);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Music className="h-4 w-4 mr-2" />
          Sound Mixer
        </h3>
      </div>
      
      {audioTrack?.url ? (
        <>
          <audio ref={audioRef} src={audioTrack.url} loop />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{trackName || 'Untitled Track'}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <VolumeIcon />
              <Slider
                defaultValue={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Upload an audio file to add music to your journal</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleUploadClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Music
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
