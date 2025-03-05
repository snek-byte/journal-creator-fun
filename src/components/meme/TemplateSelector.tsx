
import React from "react";
import { MemeTemplate } from "@/types/meme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface TemplateSelectorProps {
  templates: MemeTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateUrl: string) => void;
}

export function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}: TemplateSelectorProps) {
  
  const handleTemplateSelect = (templateUrl: string) => {
    try {
      onSelectTemplate(templateUrl);
    } catch (error) {
      console.error("Error selecting template:", error);
      toast.error("Failed to select template");
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <h3 className="text-lg font-medium mb-3">Select Template</h3>
        <ScrollArea className="h-[300px] border rounded-md p-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`
                  aspect-square overflow-hidden rounded-md border cursor-pointer transition-all
                  ${selectedTemplate === template.url ? 'ring-2 ring-primary' : 'hover:opacity-80'}
                `}
                onClick={() => handleTemplateSelect(template.url)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${template.name} template`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTemplateSelect(template.url);
                  }
                }}
              >
                <img
                  src={template.url}
                  alt={template.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.warn(`Failed to load template image: ${template.url}`);
                    // Replace with placeholder
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error";
                  }}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
