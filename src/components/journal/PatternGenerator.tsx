
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { patterns } from './patterns/patternOptions';
import { PatternParams } from './patterns/types';

interface PatternGeneratorProps {
  onPatternSelect: (gradient: string) => void;
}

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

      const params: PatternParams = {
        color1,
        color2,
        strokeWidth: stroke,
        scale,
        angle,
      };
      
      const patternImage = pattern.generator(params);
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
