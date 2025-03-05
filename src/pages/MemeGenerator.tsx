
import React, { useState, useRef, useEffect } from "react";
import { Meme, MemeTemplate } from "@/types/meme";
import { MemeCanvas } from "@/components/meme/MemeCanvas";
import { MemeControls } from "@/components/meme/MemeControls";
import { TemplateSelector } from "@/components/meme/TemplateSelector";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import html2canvas from "html2canvas";

// Default templates with direct image URLs that allow CORS
const defaultTemplates: MemeTemplate[] = [
  {
    id: "1",
    name: "Drake",
    url: "https://i.imgflip.com/30b1gx.jpg", // Using imgflip direct image URL
    width: 1200,
    height: 1200,
  },
  {
    id: "2",
    name: "Distracted Boyfriend",
    url: "https://i.imgflip.com/1ur9b0.jpg",
    width: 1200,
    height: 800,
  },
  {
    id: "3",
    name: "Two Buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
  },
  {
    id: "4",
    name: "Change My Mind",
    url: "https://i.imgflip.com/24y43o.jpg",
    width: 482,
    height: 361,
  },
  {
    id: "5",
    name: "Expanding Brain",
    url: "https://i.imgflip.com/1jwhww.jpg",
    width: 857,
    height: 1202,
  },
  {
    id: "6",
    name: "Sad Pablo Escobar",
    url: "https://i.imgflip.com/1c1uej.jpg",
    width: 720,
    height: 709,
  },
];

// Default meme state
const getDefaultMeme = (): Meme => ({
  id: uuidv4(),
  template: defaultTemplates[0].url,
  topText: "TOP TEXT",
  bottomText: "BOTTOM TEXT",
  fontSize: 36,
  fontColor: "#ffffff",
  fontFamily: "Impact",
  strokeColor: "#000000",
  strokeWidth: 2,
});

export default function MemeGenerator() {
  const [meme, setMeme] = useState<Meme>(getDefaultMeme());
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 480, height: 480 });
  
  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const width = canvasContainerRef.current.clientWidth;
        // Keep aspect ratio close to 1:1
        setCanvasSize({ width, height: width });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  const handleMemeChange = (updatedMeme: Meme) => {
    setMeme(updatedMeme);
  };
  
  const handleTemplateSelect = (templateUrl: string) => {
    console.log("Template selected:", templateUrl);
    setMeme(prevMeme => ({ ...prevMeme, template: templateUrl }));
    toast.success("Template updated");
  };
  
  const handleReset = () => {
    setMeme(getDefaultMeme());
    toast.info("Meme reset to default");
  };
  
  const handleDownload = async () => {
    if (!canvasContainerRef.current) return;
    
    try {
      const canvas = await html2canvas(canvasContainerRef.current.querySelector('canvas') as HTMLElement);
      const dataUrl = canvas.toDataURL("image/png");
      
      // Create a download link
      const link = document.createElement("a");
      link.download = `meme-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success("Meme downloaded successfully!");
    } catch (error) {
      console.error("Error downloading meme:", error);
      toast.error("Failed to download meme");
    }
  };
  
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meme Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Template selector */}
          <div className="lg:col-span-3">
            <TemplateSelector 
              templates={defaultTemplates}
              selectedTemplate={meme.template}
              onSelectTemplate={handleTemplateSelect}
            />
          </div>
          
          {/* Middle column - Meme canvas */}
          <div className="lg:col-span-5">
            <div
              ref={canvasContainerRef}
              className="rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white"
            >
              <MemeCanvas
                meme={meme}
                width={canvasSize.width}
                height={canvasSize.height}
              />
            </div>
          </div>
          
          {/* Right column - Controls */}
          <div className="lg:col-span-4">
            <MemeControls
              meme={meme}
              onMemeChange={handleMemeChange}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
