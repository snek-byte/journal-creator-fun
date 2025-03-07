
import React from 'react';

interface PlaceholderGalleryProps {
  onImageSelect: (url: string) => void;
}

export function PlaceholderGallery({ onImageSelect }: PlaceholderGalleryProps) {
  // Sample backgrounds if no images are uploaded yet
  const placeholders = [
    // Original 6 images
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&auto=format',
    'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=500&auto=format',
    'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=500&auto=format',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format',
    'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=500&auto=format',
    'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=500&auto=format',
    
    // 20 more unique images
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=500&auto=format', // Alps mountains
    'https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=500&auto=format', // Cherry blossoms
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format', // Sunlight through forest
    'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&auto=format', // Purple mountain sunset
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format', // Foggy hills
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format', // Blue mountain lake
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=500&auto=format', // Winter mountain
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&auto=format', // Forest waterfall
    'https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?w=500&auto=format', // Snowy mountains
    'https://images.unsplash.com/photo-1489619243109-4e0ea59cfe10?w=500&auto=format', // Calm lake
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format', // Northern lights
    'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=500&auto=format', // Starry sky
    'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=500&auto=format', // Sunrise over ocean
    'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=500&auto=format', // Beach sunset
    'https://images.unsplash.com/photo-1437435409766-a478cc6da4a8?w=500&auto=format', // Field of tulips
    'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?w=500&auto=format', // Lavender field
    'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=500&auto=format', // Colorful buildings
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=500&auto=format', // Mountain lake
    'https://images.unsplash.com/photo-1520962922320-2038eebab146?w=500&auto=format', // Desert landscape
    'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=500&auto=format', // Marble cave
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
