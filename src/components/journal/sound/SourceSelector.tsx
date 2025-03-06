
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link } from "lucide-react";
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import type { AudioTrack } from '@/types/journal';

interface SourceSelectorProps {
  onAudioChange: (audio: AudioTrack) => void;
  volume: number;
}

export function SourceSelector({ onAudioChange, volume }: SourceSelectorProps) {
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [driveLink, setDriveLink] = useState<string>('');
  const [isProcessingLink, setIsProcessingLink] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    
    const newAudioTrack: AudioTrack = {
      id: uuidv4(),
      url,
      name,
      volume,
      playing: true, // Start playing immediately
      source: 'upload'
    };
    
    onAudioChange(newAudioTrack);
    toast.success(`${name} uploaded and playing`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const extractGDriveFileId = (url: string): string | null => {
    let fileId = null;
    
    // Try different Google Drive URL patterns
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
    
    setIsProcessingLink(true);
    
    const fileId = extractGDriveFileId(driveLink);
    
    if (!fileId) {
      toast.error('Could not extract file ID from the Google Drive link');
      setIsProcessingLink(false);
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
    onAudioChange(newAudioTrack);
    setShowLinkInput(false);
    setDriveLink('');
    setIsProcessingLink(false);
    toast.success(`${name} added from Google Drive and playing`);
  };

  const handleWikimediaLinkSubmit = () => {
    if (!driveLink) {
      toast.error('Please enter a Wikimedia Commons link');
      return;
    }
    
    setIsProcessingLink(true);
    
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
    onAudioChange(newAudioTrack);
    setShowLinkInput(false);
    setDriveLink('');
    setIsProcessingLink(false);
    toast.success(`${newAudioTrack.name} added from Wikimedia Commons and playing`);
  };

  return (
    <div className="space-y-4">
      {showLinkInput && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <Label htmlFor="audio-link" className="text-xs font-medium mb-1 block">
            Audio Link:
          </Label>
          <div className="flex gap-2">
            <Input
              id="audio-link"
              placeholder="https://commons.wikimedia.org/wiki/File:... or Google Drive link"
              value={driveLink}
              onChange={handleDriveLinkChange}
              className="text-xs h-8"
              disabled={isProcessingLink}
            />
            <Button 
              size="sm" 
              className="h-8"
              onClick={driveLink.includes('wikimedia.org') ? handleWikimediaLinkSubmit : handleDriveLinkSubmit}
              disabled={isProcessingLink}
            >
              {isProcessingLink ? "Processing..." : "Add"}
            </Button>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            {driveLink.includes('wikimedia.org') ? 
              "Using Wikimedia Commons audio" : 
              "Make sure your Google Drive link is set to \"Anyone with the link can view\""}
          </p>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
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
            onClick={() => setShowLinkInput(!showLinkInput)}
          >
            <Link className="h-4 w-4 mr-2" />
            {showLinkInput ? 'Hide Link Form' : 'Add from Link'}
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
