import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImagePlus } from "lucide-react";
import { useImageUploader } from './useImageUploader';
import { ImageGallery } from './ImageGallery';
import { PlaceholderGallery } from './PlaceholderGallery';
import { NoImagesPlaceholder } from './NoImagesPlaceholder';
import { UploadButton } from './UploadButton';

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [open, setOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isUploading,
    isDeleting,
    uploadedImages,
    fetchUserImages,
    checkStorageBucket,
    uploadImage,
    deleteImage
  } = useImageUploader(setOpen);

  useEffect(() => {
    if (open) {
      fetchUserImages();
      checkStorageBucket();
    }
  }, [open]);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadImage(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageSelect = (url: string) => {
    onImageSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground w-8 h-8 p-0"
          title="Upload or select image"
        >
          <ImagePlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px] p-3">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-sm">Your Images</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          <div>
            <UploadButton
              isUploading={isUploading}
              onClick={handleFileSelect}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {uploadedImages.length > 0 ? (
            <ImageGallery
              images={uploadedImages}
              onImageSelect={handleImageSelect}
              onDeleteImage={deleteImage}
              isDeleting={isDeleting}
            />
          ) : (
            <div className="space-y-2">
              <NoImagesPlaceholder />
              <PlaceholderGallery onImageSelect={handleImageSelect} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
