
import { useState, useEffect } from 'react';
import { Music } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from 'uuid';
import type { AudioTrack } from '@/types/journal';
import { AudioPlayer } from './AudioPlayer';
import { SoundControls } from './SoundControls';
import { SoundLibrary } from './SoundLibrary';
import { SourceSelector } from './SourceSelector';

interface SoundMixerProps {
  audioTrack?: AudioTrack;
  onAudioChange: (audio: AudioTrack) => void;
}

export function SoundMixer({ audioTrack, onAudioChange }: SoundMixerProps) {
  const [volume, setVolume] = useState<number>(audioTrack?.volume || 50);
  const [isPlaying, setIsPlaying] = useState<boolean>(audioTrack?.playing || false);
  const [trackName, setTrackName] = useState<string>(audioTrack?.name || '');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (audioTrack) {
      setVolume(audioTrack.volume || 50);
      setIsPlaying(audioTrack.playing || false);
      setTrackName(audioTrack.name || '');
      setLoadError(null);
    }
  }, [audioTrack]);

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

  const handleSoundSelect = (sound: AudioTrack) => {
    console.log("Selected sound:", sound);
    setLoadError(null);
    const newAudioTrack: AudioTrack = {
      ...sound,
      id: sound.id || uuidv4(),
      playing: true,
      volume: volume,
      source: 'library'
    };
    onAudioChange(newAudioTrack);
    setIsPlaying(true);
    setTrackName(sound.name);
  };

  const handleLoadError = (error: string) => {
    setLoadError(error);
    setIsPlaying(false);
    
    if (audioTrack) {
      onAudioChange({
        ...audioTrack,
        playing: false
      });
    }
  };

  const handleLoadSuccess = () => {
    setLoadError(null);
  };

  const handleRemoveAudio = () => {
    onAudioChange({
      id: uuidv4(),
      url: '',
      name: '',
      volume: 50,
      playing: false
    });
    setIsPlaying(false);
    setTrackName('');
    setLoadError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Music className="h-4 w-4 mr-2" />
          Sound Mixer
        </h3>
      </div>
      
      <AudioPlayer 
        audioTrack={audioTrack}
        isPlaying={isPlaying}
        volume={volume}
        onLoadError={handleLoadError}
        onLoadSuccess={handleLoadSuccess}
      />
      
      {audioTrack?.url ? (
        <SoundControls 
          audioTrack={audioTrack}
          volume={volume}
          isPlaying={isPlaying}
          loadError={loadError}
          trackName={trackName}
          onVolumeChange={handleVolumeChange}
          onPlayPause={handlePlayPause}
          onRemove={handleRemoveAudio}
        />
      ) : null}

      <Separator className="my-2" />
      
      <div className="text-xs p-3 bg-blue-50 text-blue-700 rounded-md mb-3 border border-blue-200">
        <strong>Recommendation:</strong> For best results, use Wikimedia Commons, upload your own audio files, or use Google Drive links.
      </div>
      
      <SourceSelector 
        onAudioChange={onAudioChange}
        volume={volume}
      />
      
      <SoundLibrary onSoundSelect={handleSoundSelect} />
    </div>
  );
}
