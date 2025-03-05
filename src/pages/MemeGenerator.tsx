
import { useState, useRef } from 'react';
import { MemeCanvas, downloadMeme } from '@/components/meme/MemeCanvas';
import { MemeControls } from '@/components/meme/MemeControls';
import { TemplateSelector } from '@/components/meme/TemplateSelector';

export default function MemeGenerator() {
  // Meme text states
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  
  // Meme style states
  const [font, setFont] = useState('Impact');
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [selectedTemplate, setSelectedTemplate] = useState('https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg');
  const [fontWeight, setFontWeight] = useState('bold');
  const [textStyle, setTextStyle] = useState('normal');
  const [gradient, setGradient] = useState('');
  
  // Handle template selection
  const handleTemplateSelect = (template: string) => {
    console.log("Template selected:", template);
    setSelectedTemplate(template);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Meme Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <MemeCanvas 
            template={selectedTemplate}
            topText={topText}
            bottomText={bottomText}
            font={font}
            fontSize={fontSize}
            fontColor={fontColor}
            strokeColor={strokeColor}
            fontWeight={fontWeight}
            textStyle={textStyle}
            gradient={gradient}
          />
          
          <TemplateSelector onSelect={handleTemplateSelect} />
        </div>
        
        <div>
          <MemeControls 
            topText={topText}
            bottomText={bottomText}
            setTopText={setTopText}
            setBottomText={setBottomText}
            font={font}
            setFont={setFont}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontColor={fontColor}
            setFontColor={setFontColor}
            strokeColor={strokeColor}
            setStrokeColor={setStrokeColor}
            onDownload={downloadMeme}
            fontWeight={fontWeight}
            setFontWeight={setFontWeight}
            textStyle={textStyle}
            setTextStyle={setTextStyle}
            gradient={gradient}
            setGradient={setGradient}
          />
        </div>
      </div>
    </div>
  );
}
