
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isUploading,
    isDeleting,
    uploadedImages,
    fetchUserImages,
    checkStorageBucket,
    uploadImage,
    deleteImage
  } = useImageUploader(null);

  useEffect(() => {
    fetchUserImages();
    checkStorageBucket();
  }, []);

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
  };

  return (
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
        <div className="space-y-1">
          <NoImagesPlaceholder />
          <PlaceholderGallery onImageSelect={handleImageSelect} />
        </div>
      )}
    </div>
  );
}
