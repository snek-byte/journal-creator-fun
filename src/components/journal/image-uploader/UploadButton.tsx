
import React from 'react';
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2 } from "lucide-react";

interface UploadButtonProps {
  isUploading: boolean;
  onClick: () => void;
}

export function UploadButton({ isUploading, onClick }: UploadButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={isUploading}
      className="w-full h-7 text-xs py-0"
      size="sm"
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud className="mr-1 h-3 w-3" />
          Upload Image
        </>
      )}
    </Button>
  );
}
