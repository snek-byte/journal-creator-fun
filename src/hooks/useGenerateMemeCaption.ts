
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneratedCaption {
  topText: string;
  bottomText: string;
}

export function useGenerateMemeCaption() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateCaption = async (
    imageContext: string, 
    tone?: string
  ): Promise<GeneratedCaption | null> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-meme-generator', {
        body: { 
          imageContext,
          tone,
          model: 'gpt-4o-mini' 
        }
      });

      if (error) {
        console.error('Error generating caption:', error);
        toast.error('Failed to generate caption');
        return null;
      }
      
      return data.caption as GeneratedCaption;
    } catch (error) {
      console.error('Error in generateCaption:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCaption,
    isGenerating
  };
}
