
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TextStyleControlsProps {
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontColor: string;
  setFontColor: (color: string) => void;
  fontWeight: string;
  setFontWeight: (weight: string) => void;
  textStyle: string;
  setTextStyle: (style: string) => void;
  gradient: string;
  setGradient: (gradient: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const fontOptions = [
  { value: 'Impact', label: 'Impact' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Comic Sans MS', label: 'Comic Sans' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Palatino', label: 'Palatino' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Bookman', label: 'Bookman' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Arial Black', label: 'Arial Black' },
];

const fontWeightOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
];

const textStyleOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' },
  { value: 'italic underline', label: 'Italic & Underline' },
];

const gradientOptions = [
  { value: '', label: 'None' },
  { value: 'linear-gradient(to right, #ee9ca7, #ffdde1)', label: 'Piggy Pink' },
  { value: 'linear-gradient(to right, #d7d2cc 0%, #304352 100%)', label: 'Moonlit Asteroid' },
  { value: 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)', label: 'Juicy Peach' },
  { value: 'linear-gradient(to right, #243949 0%, #517fa4 100%)', label: 'Deep Blue' },
  { value: 'linear-gradient(to top, #e6b980 0%, #eacda3 100%)', label: 'Sand Strike' },
  { value: 'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)', label: 'Sweet Dessert' },
  { value: 'linear-gradient(108deg, rgba(242,245,139,1) 17.7%, rgba(148,197,20,0.68) 91.2%)', label: 'Spring Lime' },
  { value: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)', label: 'Fresh Mint' },
];

export function TextStyleControls({
  font,
  setFont,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  fontWeight,
  setFontWeight,
  textStyle,
  setTextStyle,
  gradient,
  setGradient,
  backgroundColor,
  setBackgroundColor,
}: TextStyleControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Font</Label>
        <Select value={font} onValueChange={setFont}>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Font Size: {fontSize}px</Label>
        <Slider
          min={12}
          max={100}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Font Weight</Label>
        <Select value={fontWeight} onValueChange={setFontWeight}>
          <SelectTrigger>
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {fontWeightOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Text Style</Label>
        <Select value={textStyle} onValueChange={setTextStyle}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {textStyleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Colors</Label>
        <Tabs defaultValue="text">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="stroke">Stroke</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="pt-4">
            <HexColorPicker color={fontColor} onChange={setFontColor} />
            <div className="flex mt-2">
              <Input 
                type="text" 
                value={fontColor} 
                onChange={(e) => setFontColor(e.target.value)}
                className="flex-1"
              />
              <div 
                className="w-10 h-10 ml-2 border border-gray-300 rounded" 
                style={{ backgroundColor: fontColor }}
              />
            </div>
          </TabsContent>
          <TabsContent value="stroke" className="pt-4">
            <HexColorPicker color={strokeColor} onChange={setStrokeColor} />
            <div className="flex mt-2">
              <Input 
                type="text" 
                value={strokeColor} 
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1"
              />
              <div 
                className="w-10 h-10 ml-2 border border-gray-300 rounded" 
                style={{ backgroundColor: strokeColor }}
              />
            </div>
          </TabsContent>
          <TabsContent value="background" className="pt-4">
            <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
            <div className="flex mt-2">
              <Input 
                type="text" 
                value={backgroundColor} 
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1"
              />
              <div 
                className="w-10 h-10 ml-2 border border-gray-300 rounded" 
                style={{ backgroundColor: backgroundColor }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Text Gradient</Label>
        <Select value={gradient} onValueChange={setGradient}>
          <SelectTrigger>
            <SelectValue placeholder="Select gradient" />
          </SelectTrigger>
          <SelectContent>
            {gradientOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {gradient && (
          <div className="h-10 rounded" style={{ background: gradient }} />
        )}
      </div>
    </div>
  );
}
