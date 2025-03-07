
import React from 'react';

interface PlaceholderGalleryProps {
  onImageSelect: (url: string) => void;
}

export function PlaceholderGallery({ onImageSelect }: PlaceholderGalleryProps) {
  // Sample backgrounds if no images are uploaded yet
  const placeholders = [
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&auto=format',
    'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=500&auto=format',
    'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=500&auto=format',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format',
    'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=500&auto=format',
    'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=500&auto=format',
  ];
    
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Sample Backgrounds</p>
      <div className="grid grid-cols-3 gap-2">
        {placeholders.map((url, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden border rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageSelect(url)}
          >
            <img 
              src={url} 
              alt={`Sample background ${index + 1}`} 
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
