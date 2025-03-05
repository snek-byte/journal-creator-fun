
import { useState, useRef } from 'react';
import { MemeCanvas, downloadMeme } from '@/components/meme/MemeCanvas';
import { MemeControls } from '@/components/meme/MemeControls';
import { TemplateSelector } from '@/components/meme/TemplateSelector';
import { MemeTemplate } from '@/types/meme';

export default function MemeGenerator() {
  // Meme text states
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  
  // Meme style states
  const [font, setFont] = useState('Impact');
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState('bold');
  const [textStyle, setTextStyle] = useState('normal');
  const [gradient, setGradient] = useState('');
  
  // Template states
  const [selectedTemplate, setSelectedTemplate] = useState('https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg');
  
  // Default meme templates
  const defaultTemplates: MemeTemplate[] = [
    { id: '1', name: 'Drake Hotline Bling', url: 'https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg', width: 640, height: 640 },
    { id: '2', name: 'Two Buttons', url: 'https://imgflip.com/s/meme/Two-Buttons.jpg', width: 600, height: 908 },
    { id: '3', name: 'Distracted Boyfriend', url: 'https://imgflip.com/s/meme/Distracted-Boyfriend.jpg', width: 640, height: 454 },
    { id: '4', name: 'Expanding Brain', url: 'https://imgflip.com/s/meme/Expanding-Brain.jpg', width: 640, height: 1200 },
    { id: '5', name: 'Change My Mind', url: 'https://imgflip.com/s/meme/Change-My-Mind.jpg', width: 640, height: 602 },
    { id: '6', name: 'Surprised Pikachu', url: 'https://imgflip.com/s/meme/Surprised-Pikachu.jpg', width: 640, height: 640 },
  ];
  
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
          
          <TemplateSelector 
            templates={defaultTemplates} 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={handleTemplateSelect} 
          />
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
