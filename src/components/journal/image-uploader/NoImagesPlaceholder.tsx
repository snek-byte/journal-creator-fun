
import React from 'react';
import { ImageIcon } from "lucide-react";

export function NoImagesPlaceholder() {
  return (
    <div className="text-center py-4 text-muted-foreground">
      <ImageIcon className="mx-auto h-12 w-12 opacity-20" />
      <p className="mt-2">No uploaded images yet</p>
    </div>
  );
}
