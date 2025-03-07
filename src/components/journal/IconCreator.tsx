
import { v4 as uuidv4 } from 'uuid';
import type { Icon } from '@/types/journal';

interface IconCreatorProps {
  onIconAdd: (icon: Icon) => void;
}

export function IconCreator({
  onIconAdd
}: IconCreatorProps) {
  const handleIconAddWithId = (iconData: { url: string, style: 'outline' | 'color' }) => {
    console.log("Adding icon with style:", iconData.style);
    const newIcon: Icon = {
      id: uuidv4(),
      url: iconData.url,
      position: { x: 50, y: 50 },
      color: iconData.style === 'color' ? '#ff5555' : '#000000',
      size: 48,
      style: iconData.style
    };
    console.log("New icon created:", newIcon);
    onIconAdd(newIcon);
  };
  
  return {
    handleIconAddWithId
  };
}
