
import React from 'react';
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const predefinedColors = [
  // Purples
  "#9c27b0", "#673ab7", "#4a148c", "#e1bee7",
  // Blues
  "#2196f3", "#1976d2", "#0d47a1", "#bbdefb", 
  // Reds and pinks
  "#f44336", "#e91e63", "#b71c1c", "#ff80ab",
  // Greens
  "#4caf50", "#2e7d32", "#1b5e20", "#c8e6c9",
  // Yellows and oranges
  "#ffc107", "#ff9800", "#ff6f00", "#fff9c4",
  // Neutral tones
  "#000000", "#ffffff", "#607d8b", "#9e9e9e"
];

interface IconColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function IconColorPicker({ selectedColor, onChange, disabled = false }: IconColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-xs font-medium">Icon Color</h4>
        </div>
        <div
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: selectedColor }}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-8 justify-between text-xs" 
            disabled={disabled}
          >
            <span>Select Color</span>
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <HexColorPicker color={selectedColor} onChange={onChange} />
            
            <div>
              <h4 className="text-xs font-medium mb-2">Presets</h4>
              <div className="grid grid-cols-8 gap-1">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
