import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Volume2, Volume1, VolumeX, Play, Pause, Upload, Plus, Trash2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [previewLoadError, setPreviewLoadError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioTrack) {
      setVolume(audioTrack.volume || 50);
      setIsPlaying(audioTrack.playing || false);
      setTrackName(audioTrack.name || '');
      setLoadError(null);
    }
  }, [audioTrack]);

  useEffect(() => {
    if (audioRef.current && audioTrack?.url) {
      console.log("SoundMixer: Setting audio source to", audioTrack.url);
      audioRef.current.src = audioTrack.url;
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = true;
      
      if (isPlaying) {
        console.log("SoundMixer: Attempting to play audio:", audioTrack.url);
        // Use a longer timeout to ensure the audio has time to load
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log("SoundMixer: Audio playing successfully:", audioTrack.name);
              }).catch(error => {
                console.error("SoundMixer: Error playing audio:", error);
                setIsPlaying(false);
                setLoadError(`Couldn't play audio (${error.message}). External audio sources may be unavailable.`);
                
                onAudioChange({
                  ...audioTrack,
                  playing: false
                });
                
                toast.error("Audio couldn't be played. Try uploading your own audio file.", {
                  duration: 5000
                });
              });
            }
          }
        }, 2000); // Increased timeout for better loading chance
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, audioTrack?.url, audioTrack, onAudioChange]);

  useEffect(() => {
    if (previewAudioRef.current && previewSound) {
      console.log("Setting up preview for:", previewSound.url);
      previewAudioRef.current.src = previewSound.url;
      previewAudioRef.current.volume = 0.5; // Set preview volume to 50%
      setPreviewLoadError(null);
      
      console.log("Attempting to play preview sound:", previewSound.url);
      // Add a delay before playing to allow audio to load
      setTimeout(() => {
        if (previewAudioRef.current) {
          const playPromise = previewAudioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Preview started successfully");
            }).catch(error => {
              const errorElement = e.currentTarget as HTMLAudioElement;
              const errorMessage = errorElement.error ? errorElement.error.message : 'The element has no supported sources';
              console.error("Error playing preview audio:", errorMessage, e);
              setPreviewLoadError(`Couldn't play preview (${errorMessage}). Audio sources may be unavailable.`);
              toast.error("Couldn't play preview. Try uploading your own audio file.", {
                duration: 5000
              });
            });
          }
        }
      }, 1000);

      return () => {
        if (previewAudioRef.current) {
          previewAudioRef.current.pause();
        }
      };
    }
  }, [previewSound]);

  const handleAudioLoaded = () => {
    console.log("Audio loaded successfully in mixer:", audioTrack?.name);
    setLoadError(null);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const errorElement = e.currentTarget as HTMLAudioElement;
    const errorMessage = errorElement.error ? errorElement.error.message : 'The element has no supported sources';
    console.error("Audio error in mixer:", errorMessage, e);
    setLoadError(`Error loading audio: ${errorMessage}. The source may be unavailable or blocked by your browser.`);
    setIsPlaying(false);
    
    if (audioTrack) {
      onAudioChange({
        ...audioTrack,
        playing: false
      });
    }
  };

  const handlePreviewAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const errorElement = e.currentTarget as HTMLAudioElement;
    const errorMessage = errorElement.error ? errorElement.error.message : 'The element has no supported sources';
    console.error("Preview audio error:", errorMessage, e);
    setPreviewLoadError(`Error loading preview: ${errorMessage}. The source may be unavailable or blocked by your browser.`);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
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
    setLoadError(null);
    
    const newAudioTrack: AudioTrack = {
      id: uuidv4(),
      url,
      name,
      volume,
      playing: true // Start playing immediately
    };
    
    setIsPlaying(true);
    onAudioChange(newAudioTrack);
    toast.success(`${name} uploaded and playing`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSoundSelect = (sound: AudioTrack) => {
    console.log("Selected sound:", sound);
    setLoadError(null);
    const newAudioTrack: AudioTrack = {
      ...sound,
      id: sound.id || uuidv4(),
      playing: true,
      volume: volume
    };
    onAudioChange(newAudioTrack);
    setIsPlaying(true);
    setTrackName(sound.name);
    toast.success(`${sound.name} selected and playing`);
  };

  const handlePreviewStart = (sound: AudioTrack) => {
    console.log("Previewing sound:", sound);
    setPreviewSound(sound);
  };

  const handlePreviewEnd = () => {
    setPreviewSound(null);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
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
          External audio sources (like freesound.org) may be blocked by your browser or CORS policies. 
          <strong className="block mt-1">We strongly recommend uploading your own audio files for the best experience.</strong>
        </AlertDescription>
      </Alert>
      
      {previewLoadError && (
        <div className="text-xs text-red-500 mt-1 p-2 bg-red-50 rounded-md">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          {previewLoadError}
        </div>
      )}
      
      {audioTrack?.url ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xs font-medium">{trackName || 'Untitled Track'}</span>
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
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handlePlayPause}
                disabled={!!loadError}
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
                  setLoadError(null);
                }}
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
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      ) : null}

      <Separator className="my-2" />
      
      <div className="text-xs p-3 bg-red-50 text-red-700 rounded-md mb-3 border border-red-200">
        <AlertCircle className="h-3 w-3 inline mr-1" />
        <strong>Known Issue:</strong> External audio sources from freesound.org are likely blocked by CORS policies.
        <strong className="block mt-1">Solution:</strong> Please upload your own audio files below for the best experience.
      </div>
      
      <Tabs defaultValue="ambient" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 mb-2">
          {soundCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
          ))}
        </TabsList>
        
        <ScrollArea className="h-36 border rounded-md p-1">
          <audio 
            ref={previewAudioRef} 
            controls
            className="hidden"
            onError={handlePreviewAudioError} 
          />
          
          {publicDomainSounds
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
            ))}
        </ScrollArea>
      </Tabs>
      
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-xs text-muted-foreground font-medium">Upload your own audio file (recommended)</p>
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
