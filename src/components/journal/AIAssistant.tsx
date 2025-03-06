
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Brain, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIAssistantProps {
  onSuggestionApply: (text: string) => void;
}

export function AIAssistant({ onSuggestionApply }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-language-model', {
        body: { prompt, model: 'gpt-4o-mini' }
      });

      if (error) throw error;
      
      setResult(data.response);
      toast.success('AI suggestion generated');
    } catch (error) {
      console.error('Error calling AI model:', error);
      toast.error('Failed to generate AI suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = () => {
    if (result) {
      onSuggestionApply(result);
      toast.success('AI suggestion applied to journal');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-2 absolute right-4 top-4 z-10"
        onClick={() => setIsOpen(true)}
      >
        <Brain className="h-4 w-4" />
        <span>AI Assistant</span>
      </Button>
    );
  }

  return (
    <Card className="shadow-lg w-full max-w-md absolute right-4 top-4 z-10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <span>AI Writing Assistant</span>
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Input
              placeholder="Ask for writing suggestions, ideas, or help..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !prompt.trim()} 
            className="w-full"
          >
            {isLoading ? 'Generating...' : 'Generate Suggestion'}
            {isLoading ? (
              <div className="ml-1 animate-spin">
                <Sparkles className="h-4 w-4" />
              </div>
            ) : (
              <Send className="ml-1 h-4 w-4" />
            )}
          </Button>
        </form>
        
        {result && (
          <div className="mt-4">
            <Textarea
              readOnly
              value={result}
              rows={5}
              className="resize-none bg-muted/30"
            />
            <Button
              onClick={applySuggestion}
              className="mt-2 w-full"
              variant="secondary"
            >
              Apply to Journal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
