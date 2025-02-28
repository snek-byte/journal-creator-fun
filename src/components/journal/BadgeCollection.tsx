
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { LockIcon, CheckCircle2Icon } from "lucide-react";

interface BadgeCollectionProps {
  badges: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    achieved: boolean;
  }>;
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {badges.map((badge) => (
        <HoverCard key={badge.id}>
          <HoverCardTrigger asChild>
            <Card className={`cursor-pointer transition-all hover:shadow-md ${!badge.achieved ? 'opacity-60 grayscale' : ''}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="relative w-12 h-12 mb-2 flex items-center justify-center">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/100x100?text=Badge';
                    }}
                  />
                  {!badge.achieved && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <LockIcon className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {badge.achieved && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                      <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-center font-medium mt-1">{badge.name}</p>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={badge.image} 
                  alt={badge.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback for missing images
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/100x100?text=Badge';
                  }}
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <Badge 
                  variant={badge.achieved ? "default" : "outline"} 
                  className="mt-2"
                >
                  {badge.achieved ? 'Achieved' : 'Locked'}
                </Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
