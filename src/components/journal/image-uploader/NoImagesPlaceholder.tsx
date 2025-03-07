
import React from 'react';
import { ImageIcon } from "lucide-react";

export function NoImagesPlaceholder() {
  return (
    <div className="text-center py-2 text-muted-foreground">
      <ImageIcon className="mx-auto h-8 w-8 opacity-20" />
      <p className="mt-1 text-xs">No uploaded images yet</p>
    </div>
  );
}
