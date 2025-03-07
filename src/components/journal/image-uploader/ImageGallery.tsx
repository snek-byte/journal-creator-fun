
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface ImageGalleryProps {
  images: Array<{url: string, filename?: string}>;
  onImageSelect: (url: string) => void;
  onDeleteImage: (url: string, filename?: string) => void;
  isDeleting: Record<string, boolean>;
}

export function ImageGallery({ 
  images, 
  onImageSelect, 
  onDeleteImage, 
  isDeleting 
}: ImageGalleryProps) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 min-h-[120px]">
      {images.map((img, index) => (
        <div 
          key={index} 
          className="relative aspect-square overflow-hidden border rounded-md group"
        >
          <img 
            src={img.url} 
            alt={`Uploaded image ${index + 1}`} 
            className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageSelect(img.url)}
            loading="lazy"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteImage(img.url, img.filename);
            }}
            disabled={isDeleting[img.url]}
            title="Delete image"
          >
            {isDeleting[img.url] ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
