
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<string>;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }
        
        const imageUrl = await onImageUpload(file);
        console.log("Image uploaded successfully:", imageUrl.substring(0, 50) + "...");
        toast.success("Image uploaded successfully");
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast.error(error.message || "Failed to upload image");
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
      <p className="text-sm text-gray-500">
        {isDragActive
          ? "Drop the image here..."
          : "Drag and drop an image, or click to browse"}
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Supports JPG, PNG and GIF up to 5MB
      </p>
      <Button 
        variant="outline" 
        className="mt-4" 
        type="button"
        onClick={(e) => e.stopPropagation()}
      >
        Choose File
      </Button>
    </div>
  );
}
