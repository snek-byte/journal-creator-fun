
import { useJournalStore } from '@/store/journalStore';

export function useJournalStyling({ selectedIconId, handleIconUpdate }: { 
  selectedIconId: string | null;
  handleIconUpdate: (iconId: string, updates: Partial<any>) => void;
}) {
  const {
    setBackgroundImage,
    setDrawing,
    setFilter,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setTextStyle,
  } = useJournalStore((state: any) => state);

  const handleBackgroundSelect = (imageUrl: string) => {
    try {
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error("Error selecting background:", error);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    try {
      setDrawing(dataUrl);
    } catch (error) {
      console.error("Error updating drawing:", error);
    }
  };

  const handleFilterChange = (filterId: string) => {
    try {
      setFilter(filterId);
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  // Handler for font size that adjusts icon size when needed
  const handleFontSizeChange = (size: string) => {
    if (selectedIconId) {
      console.log("Setting size for icon:", selectedIconId, "to:", size);
      // Get the numeric value from the font size
      const sizeValue = parseInt(size);
      if (!isNaN(sizeValue)) {
        // Make icon size directly proportional to the font size
        const iconSize = sizeValue * 3; // Make icon 3x the font size
        
        // Update the icon with the new size
        handleIconUpdate(selectedIconId, { size: iconSize });
      }
    } else {
      // Normal text size change
      setFontSize(size);
    }
  };

  const handleFontWeightChange = (weight: string) => {
    if (!selectedIconId) {
      setFontWeight(weight);
    }
  };

  const handleFontChange = (font: string) => {
    if (!selectedIconId) {
      setFont(font);
    }
  };

  const handleFontColorChange = (color: string) => {
    if (selectedIconId) {
      // If an icon is selected, update its color directly
      console.log("Setting color for icon:", selectedIconId, "to:", color);
      handleIconUpdate(selectedIconId, { color });
    } else {
      setFontColor(color);
    }
  };

  const handleGradientChange = (gradient: string) => {
    if (!selectedIconId) {
      setGradient(gradient);
    }
  };

  const handleTextStyleChange = (style: string) => {
    if (!selectedIconId) {
      setTextStyle(style);
    }
  };

  return {
    handleBackgroundSelect,
    handleDrawingChange,
    handleFilterChange,
    handleFontSizeChange,
    handleFontWeightChange,
    handleFontChange,
    handleFontColorChange,
    handleGradientChange,
    handleTextStyleChange
  };
}
