import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Volume2, Volume1, VolumeX, Play, Pause, Upload, Plus, Trash2, AlertCircle, Link } from "lucide-react";
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
  const [driveLink, setDriveLink] = useState<string>('');
  const [showDriveLinkInput, setShowDriveLinkInput] = useState<boolean>(false);
  const [isProcessingDriveLink, setIsProcessingDriveLink] = useState<boolean>(false);

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
        }, 2000);
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
      setTimeout(() => {
        if (previewAudioRef.current) {
          const playPromise = previewAudioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Preview started successfully");
            }).catch(error => {
              console.error("Error playing preview audio:", error);
              setPreviewLoadError(`Couldn't play preview (${error.message}). Audio sources may be unavailable.`);
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
      playing: true, // Start playing immediately
      source: 'upload'
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
      volume: volume,
      source: 'library'
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

  const extractGDriveFileId = (url: string): string | null => {
    let fileId = null;
    
    let match = url.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      return match[1];
    }
    
    match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
      return match[1];
    }
    
    match = url.match(/\/open\?id=([^&]+)/);
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  };

  const handleDriveLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriveLink(e.target.value);
  };

  const handleDriveLinkSubmit = () => {
    if (!driveLink) {
      toast.error('Please enter a Google Drive link');
      return;
    }
    
    if (!driveLink.includes('drive.google.com')) {
      toast.error('Please enter a valid Google Drive link');
      return;
    }
    
    setIsProcessingDriveLink(true);
    
    const fileId = extractGDriveFileId(driveLink);
    
    if (!fileId) {
      toast.error('Could not extract file ID from the Google Drive link');
      setIsProcessingDriveLink(false);
      return;
    }
    
    const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    let name = 'Google Drive Audio';
    const urlParts = driveLink.split('/');
    if (urlParts.length > 3) {
      name = urlParts[urlParts.length - 2] || name;
    }
    
    const newAudioTrack: AudioTrack = {
      id: uuidv4(),
      url: directLink,
      name,
      volume,
      playing: true,
      source: 'gdrive',
      originalUrl: driveLink
    };
    
    console.log("Creating audio track from Google Drive:", newAudioTrack);
    
    setLoadError(null);
    setIsPlaying(true);
    setTrackName(name);
    onAudioChange(newAudioTrack);
    
    setShowDriveLinkInput(false);
    setDriveLink('');
    setIsProcessingDriveLink(false);
    
    toast.success(`${name} added from Google Drive and playing`);
  };

  const handleWikimediaLinkSubmit = () => {
    if (!driveLink) {
      toast.error('Please enter a Wikimedia Commons link');
      return;
    }
    
    setIsProcessingDriveLink(true);
    
    const urlParts = driveLink.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'Wikimedia Audio';
    
    let directUrl = driveLink;
    
    if (driveLink.includes('commons.wikimedia.org/wiki/File:')) {
      const fileNameEncoded = encodeURIComponent(fileName);
      directUrl = `https://upload.wikimedia.org/wikipedia/commons/${fileNameEncoded}`;
      
      toast.info('For best results, use direct media links from Wikimedia Commons');
    }
    
    const newAudioTrack: AudioTrack = {
      id: uuidv4(),
      url: directUrl,
      name: fileName.replace(/_/g, ' ').replace(/\.[^/.]+$/, ""), // Remove file extension and replace underscores
      volume: volume,
      playing: true,
      source: 'wikimedia',
      originalUrl: driveLink,
      attribution: 'Wikimedia Commons'
    };
    
    console.log("Creating audio track from Wikimedia:", newAudioTrack);
    
    setLoadError(null);
    setIsPlaying(true);
    setTrackName(newAudioTrack.name);
    onAudioChange(newAudioTrack);
    
    setShowDriveLinkInput(false);
    setDriveLink('');
    setIsProcessingDriveLink(false);
    
    toast.success(`${newAudioTrack.name} added from Wikimedia Commons and playing`);
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const AudioInfo = () => {
    if (!audioTrack?.url) return null;
    
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
          External audio sources may be blocked by your browser or CORS policies. 
          <strong className="block mt-1">We recommend using Wikimedia Commons or uploading your own audio files for the best experience.</strong>
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
            <AudioInfo />
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
      
      <div className="text-xs p-3 bg-blue-50 text-blue-700 rounded-md mb-3 border border-blue-200">
        <AlertCircle className="h-3 w-3 inline mr-1" />
        <strong>Recommendation:</strong> For best results, use Wikimedia Commons, upload your own audio files, or use Google Drive links.
      </div>
      
      {showDriveLinkInput && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <Label htmlFor="drive-link" className="text-xs font-medium mb-1 block">
            Audio Link:
          </Label>
          <div className="flex gap-2">
            <Input
              id="drive-link"
              placeholder="https://commons.wikimedia.org/wiki/File:... or Google Drive link"
              value={driveLink}
              onChange={handleDriveLinkChange}
              className="text-xs h-8"
              disabled={isProcessingDriveLink}
            />
            <Button 
              size="sm" 
              className="h-8"
              onClick={driveLink.includes('wikimedia.org') ? handleWikimediaLinkSubmit : handleDriveLinkSubmit}
              disabled={isProcessingDriveLink}
            >
              {isProcessingDriveLink ? "Processing..." : "Add"}
            </Button>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            {driveLink.includes('wikimedia.org') ? 
              "Using Wikimedia Commons audio" : 
              "Make sure your Google Drive link is set to \"Anyone with the link can view\""}
          </p>
        </div>
      )}
      
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
        <p className="text-xs text-muted-foreground font-medium">Add your own audio</p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleUploadClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Audio
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setShowDriveLinkInput(!showDriveLinkInput)}
          >
            <Link className="h-4 w-4 mr-2" />
            {showDriveLinkInput ? 'Hide Link Form' : 'Add from Link'}
          </Button>
        </div>
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
