
import React from 'react';
import { ImageIcon } from "lucide-react";

export function NoImagesPlaceholder() {
  return (
    <div className="text-center py-1 text-muted-foreground">
      <ImageIcon className="mx-auto h-6 w-6 opacity-20" />
      <p className="mt-0.5 text-xs">No uploaded images yet</p>
    </div>
  );
}
