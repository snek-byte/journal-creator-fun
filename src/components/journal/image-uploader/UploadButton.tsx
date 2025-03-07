
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
      className="w-full"
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Image
        </>
      )}
    </Button>
  );
}
