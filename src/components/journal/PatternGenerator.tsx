
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PatternGeneratorProps {
  onPatternSelect: (gradient: string) => void;
}

interface PatternOption {
  id: string;
  label: string;
  generator: (params: PatternParams) => string;
}

interface PatternParams {
  color1: string;
  color2: string;
  strokeWidth: number;
  scale: number;
  angle: number;
}

const generateWaves = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const path = `
    M 0 ${size / 2} 
    C ${size / 4} ${size / 2 - 20} ${size * 3 / 4} ${size / 2 + 20} ${size} ${size / 2}
    M -${size} ${size / 2} 
    C -${size * 3 / 4} ${size / 2 - 20} -${size / 4} ${size / 2 + 20} 0 ${size / 2}
    M ${size} ${size / 2} 
    C ${size * 5 / 4} ${size / 2 - 20} ${size * 7 / 4} ${size / 2 + 20} ${size * 2} ${size / 2}
  `;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" stroke="${color2}" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#waves)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

const generateZigZag = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const path = `
    M 0 ${size / 2} 
    L ${size / 4} ${size / 4} 
    L ${size / 2} ${size / 2} 
    L ${size * 3 / 4} ${size / 4} 
    L ${size} ${size / 2}
    M -${size} ${size / 2} 
    L -${size * 3 / 4} ${size / 4} 
    L -${size / 2} ${size / 2} 
    L -${size / 4} ${size / 4} 
    L 0 ${size / 2}
  `;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="zigzag" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" stroke="${color2}" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zigzag)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

const generateDots = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const radius = strokeWidth * 2;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <circle cx="${size/4}" cy="${size/4}" r="${radius}" fill="${color2}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

const patterns: PatternOption[] = [
  { id: 'waves', label: 'Waves', generator: generateWaves },
  { id: 'zigzag', label: 'Zigzag', generator: generateZigZag },
  { id: 'dots', label: 'Dots', generator: generateDots },
];

export function PatternGenerator({ onPatternSelect }: PatternGeneratorProps) {
  const [selectedPattern, setSelectedPattern] = useState(patterns[0].id);
  const [color1, setColor1] = useState('#E11D48');
  const [color2, setColor2] = useState('#EAB308');
  const [stroke, setStroke] = useState(3);
  const [scale, setScale] = useState(2);
  const [angle, setAngle] = useState(100);

  const generatePattern = () => {
    try {
      const pattern = patterns.find(p => p.id === selectedPattern);
      if (!pattern) return;

      const patternImage = pattern.generator({
        color1,
        color2,
        strokeWidth: stroke,
        scale,
        angle,
      });
      
      onPatternSelect(patternImage);
      toast.success('Pattern generated successfully!');
    } catch (error) {
      console.error('Error generating pattern:', error);
      toast.error('Failed to generate pattern');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pattern Type</Label>
        <Select value={selectedPattern} onValueChange={setSelectedPattern}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {patterns.map((pattern) => (
              <SelectItem key={pattern.id} value={pattern.id}>
                {pattern.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Primary Color</Label>
        <Input
          type="color"
          value={color1}
          onChange={(e) => setColor1(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Secondary Color</Label>
        <Input
          type="color"
          value={color2}
          onChange={(e) => setColor2(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Stroke Width: {stroke}</Label>
        <Slider
          value={[stroke]}
          onValueChange={(values) => setStroke(values[0])}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Scale: {scale}</Label>
        <Slider
          value={[scale]}
          onValueChange={(values) => setScale(values[0])}
          min={1}
          max={5}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <Label>Angle: {angle}°</Label>
        <Slider
          value={[angle]}
          onValueChange={(values) => setAngle(values[0])}
          min={0}
          max={360}
          step={1}
        />
      </div>

      <Button 
        onClick={generatePattern} 
        className="w-full"
      >
        Generate Pattern
      </Button>
    </div>
  );
}
