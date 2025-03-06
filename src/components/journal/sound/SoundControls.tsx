
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Volume2, Volume1, VolumeX, Play, Pause, Trash2, AlertCircle } from "lucide-react";
import type { AudioTrack } from '@/types/journal';

interface SoundControlsProps {
  audioTrack?: AudioTrack;
  volume: number;
  isPlaying: boolean;
  loadError: string | null;
  trackName: string;
  onVolumeChange: (value: number[]) => void;
  onPlayPause: () => void;
  onRemove: () => void;
}

export function SoundControls({
  audioTrack,
  volume,
  isPlaying,
  loadError,
  trackName,
  onVolumeChange,
  onPlayPause,
  onRemove
}: SoundControlsProps) {
  if (!audioTrack?.url) return null;

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const AudioInfo = () => {
    return (
      <div className="flex items-center">
        <span className="text-xs font-medium">{trackName || 'Untitled Track'}</span>
        {audioTrack.source === 'gdrive' && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
            Drive
          </span>
        )}
        {audioTrack.source === 'wikimedia' && (
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
            Wikimedia
          </span>
        )}
        {loadError && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{loadError}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <AudioInfo />
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onPlayPause}
            disabled={!!loadError}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loadError && (
        <div className="text-xs text-red-500 my-1 p-2 bg-red-50 rounded-md">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          {loadError}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <VolumeIcon />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={onVolumeChange}
        />
      </div>
    </div>
  );
}
