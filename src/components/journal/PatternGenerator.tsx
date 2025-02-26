
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatternGeneratorProps {
  onPatternSelect: (gradient: string) => void;
}

export function PatternGenerator({ onPatternSelect }: PatternGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [color1, setColor1] = useState('#E11D48');
  const [color2, setColor2] = useState('#EAB308');
  const [stroke, setStroke] = useState(3);
  const [scale, setScale] = useState(2);
  const [angle, setAngle] = useState(100);

  const generatePattern = async () => {
    setIsLoading(true);
    try {
      // Get the API key from Supabase
      const { data: { value: apiKey }, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'PATTERN_MONSTER_API_KEY')
        .single();

      if (secretError || !apiKey) {
        throw new Error('API key not found');
      }

      // Format colors for the URL
      const color1Encoded = encodeURIComponent(color1.replace('#', ''));
      const color2Encoded = encodeURIComponent(color2);

      const response = await fetch(
        `https://pattern-monster.p.rapidapi.com/api/v1/vector?name=waves-1&colors=${color1Encoded}%7C${color2Encoded}&stroke=${stroke}&scale=${scale}&spacing=0%7C0&angle=${angle}&strokeJoin=round&moveLeft=0&moveTop=0`,
        {
          headers: {
            'x-rapidapi-host': 'pattern-monster.p.rapidapi.com',
            'x-rapidapi-key': apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate pattern');
      }

      const data = await response.json();
      
      // Convert SVG to data URL and create background image
      const svgBase64 = btoa(data.svg);
      const backgroundImage = `url("data:image/svg+xml;base64,${svgBase64}")`;
      
      onPatternSelect(backgroundImage);
      toast.success('Pattern generated successfully!');
    } catch (error) {
      console.error('Error generating pattern:', error);
      toast.error('Failed to generate pattern');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Pattern'}
      </Button>
    </div>
  );
}
