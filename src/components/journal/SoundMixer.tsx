
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Volume2, Volume1, VolumeX, Play, Pause, Upload, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import type { AudioTrack } from '@/types/journal';
import { publicDomainSounds, soundCategories } from '@/data/publicDomainSounds';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface SoundMixerProps {
  audioTrack?: AudioTrack;
  onAudioChange: (audio: AudioTrack) => void;
}

export function SoundMixer({ audioTrack, onAudioChange }: SoundMixerProps) {
  const [volume, setVolume] = useState<number>(audioTrack?.volume || 50);
  const [isPlaying, setIsPlaying] = useState<boolean>(audioTrack?.playing || false);
  const [trackName, setTrackName] = useState<string>(audioTrack?.name || '');
  const [selectedCategory, setSelectedCategory] = useState<string>("ambient");
  const [previewSound, setPreviewSound] = useState<AudioTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle current active track
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

  // Handle preview sound
  useEffect(() => {
    if (previewAudioRef.current && previewSound) {
      previewAudioRef.current.volume = 0.5; // Set preview volume to 50%
      previewAudioRef.current.play().catch(error => {
        console.error("Error playing preview audio:", error);
      });

      return () => {
        if (previewAudioRef.current) {
          previewAudioRef.current.pause();
        }
      };
    }
  }, [previewSound]);

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
      id: uuidv4(),
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

  const handleSoundSelect = (sound: AudioTrack) => {
    onAudioChange({
      ...sound,
      playing: true,
      volume: volume
    });
    setIsPlaying(true);
    setTrackName(sound.name);
    toast.success(`${sound.name} selected`);
  };

  const handlePreviewStart = (sound: AudioTrack) => {
    setPreviewSound(sound);
  };

  const handlePreviewEnd = () => {
    setPreviewSound(null);
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const categoryOptions = soundCategories.map(category => (
    <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
  ));

  const soundOptions = publicDomainSounds
    .filter(sound => sound.category === selectedCategory)
    .map(sound => (
      <div key={sound.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
        <div className="flex-1 text-sm">{sound.name}</div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onMouseDown={() => handlePreviewStart(sound)}
                  onMouseUp={handlePreviewEnd}
                  onMouseLeave={handlePreviewEnd}
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
                  onClick={() => handleSoundSelect(sound)}
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
      </div>
    ));

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
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => {
                    onAudioChange({
                      id: uuidv4(),
                      url: '',
                      name: '',
                      volume: 50,
                      playing: false
                    });
                    setIsPlaying(false);
                    setTrackName('');
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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

          <Separator className="my-2" />
        </>
      ) : null}
      
      <Tabs defaultValue="ambient" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 mb-2">
          {categoryOptions}
        </TabsList>
        
        <ScrollArea className="h-36 border rounded-md p-1">
          {previewSound && <audio ref={previewAudioRef} src={previewSound.url} />}
          {soundOptions}
        </ScrollArea>
      </Tabs>
      
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-xs text-muted-foreground">Or upload your own audio file</p>
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
    </div>
  );
}
