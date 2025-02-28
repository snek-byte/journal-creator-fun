
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface JournalGridProps {
  entries: any[];
}

export function JournalGrid({ entries }: JournalGridProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-gray-500">You haven't created any journal entries yet.</p>
        <p className="text-gray-500 mt-1">Start writing to see your entries here!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardHeader className="pb-2 relative" style={{ 
            background: entry.gradient || 'linear-gradient(to right, #f6d365 0%, #fda085 100%)',
            color: '#fff'
          }}>
            <div className="absolute top-3 right-3">
              {entry.is_public ? (
                <Badge variant="outline" className="bg-white/20 backdrop-blur-sm">
                  <Eye className="w-3 h-3 mr-1" /> Public
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/20 backdrop-blur-sm">
                  <EyeOff className="w-3 h-3 mr-1" /> Private
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg font-bold">
              {entry.text.substring(0, 50)}{entry.text.length > 50 ? '...' : ''}
            </CardTitle>
            <CardDescription className="text-white/80 flex items-center gap-1 mt-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {entry.text.substring(0, 150)}{entry.text.length > 150 ? '...' : ''}
            </p>
          </CardContent>
          
          <CardFooter className="border-t pt-3 flex justify-between">
            <div className="flex items-center gap-2">
              {entry.mood && (
                <Badge variant="secondary">
                  {entry.mood}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {entry.text.trim().split(/\s+/).length} words
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
