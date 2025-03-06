
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImagePlus, UploadCloud, Image as ImageIcon, Loader2, File, Music } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const fetchUserImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("ImageUploader: No authenticated user found");
        return;
      }

      console.log("ImageUploader: Fetching images for user:", user.id);
      
      const { data, error } = await supabase
        .from('user_images')
        .select('url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user images:', error);
        return;
      }
      
      if (data && data.length) {
        console.log("ImageUploader: Loaded", data.length, "user images");
        setUploadedImages(data.map(item => item.url));
      } else {
        console.log("ImageUploader: No user images found");
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserImages();
      
      const checkStorageBucket = async () => {
        try {
          console.log("ImageUploader: Checking storage buckets");
          
          const { data: buckets, error: bucketsError } = await supabase
            .storage
            .listBuckets();
          
          if (bucketsError) {
            console.error('Error checking buckets:', bucketsError);
            return;
          }
          
          console.log("ImageUploader: Available buckets:", buckets.map(b => b.name).join(', '));
          
          if (!buckets.some(bucket => bucket.name === 'journal-images')) {
            console.warn('journal-images bucket not found. Please create it in the Supabase dashboard.');
            toast.warning('Image storage not fully configured. Contact administrator.');
          }
        } catch (error) {
          console.error('Error in bucket check:', error);
        }
      };
      
      checkStorageBucket();
    }
  }, [open]);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("ImageUploader: File selected for upload:", file.name, file.type, file.size);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxFileSize) {
      toast.error('File too large. Maximum size is 20MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload files');
        return;
      }

      console.log("ImageUploader: Authenticated as user:", user.id);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      console.log("ImageUploader: Uploading with filename:", fileName);
      
      const { data, error } = await supabase.storage
        .from('journal-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          toast.error('Storage bucket not found. Please contact administrator.');
        } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
          toast.error('Upload timed out. Please try with a smaller file or check your connection.');
        } else {
          toast.error(`Upload error: ${error.message}`);
        }
        throw error;
      }

      console.log("ImageUploader: Upload successful, getting public URL");

      const { data: publicUrlData } = supabase.storage
        .from('journal-images')
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) throw new Error('Failed to get public URL');

      console.log("ImageUploader: Public URL obtained:", publicUrlData.publicUrl);

      const { error: dbError } = await supabase
        .from('user_images')
        .insert({
          user_id: user.id,
          url: publicUrlData.publicUrl,
          filename: fileName
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      setUploadedImages(prev => [publicUrlData.publicUrl, ...prev]);
      toast.success('File uploaded successfully!');
      console.log("ImageUploader: File successfully uploaded and saved");
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      if (error.message?.includes('bucket') || error.message?.includes('not found')) {
        toast.error('Storage not properly configured. Please contact administrator.');
      } else if (error.message?.includes('permission')) {
        toast.error('You don\'t have permission to upload files.');
      } else if (error.message?.includes('size') || error.message?.includes('large')) {
        toast.error('This file is too large to upload. Please try a smaller file.');
      } else {
        toast.error(error.message || 'Failed to upload file');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = (url: string) => {
    onImageSelect(url);
    setOpen(false);
    toast.success('File selected for your journal');
  };

  const renderPlaceholderImages = () => {
    const placeholders = [
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&auto=format',
      'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=500&auto=format',
      'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=500&auto=format',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format',
      'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=500&auto=format',
      'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=500&auto=format',
    ];
    
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Sample Backgrounds</p>
        <div className="grid grid-cols-3 gap-2">
          {placeholders.map((url, index) => (
            <div 
              key={index} 
              className="relative aspect-square overflow-hidden border rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleImageSelect(url)}
            >
              <img 
                src={url} 
                alt={`Sample background ${index + 1}`} 
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
          title="Upload or select file"
        >
          <ImagePlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Your Journal Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button 
              onClick={handleFileSelect} 
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
                  Upload File (Max 20MB)
                </>
              )}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {uploadedImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {uploadedImages.map((url, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square overflow-hidden border rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageSelect(url)}
                >
                  {url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                    <img 
                      src={url} 
                      alt={`Uploaded file ${index + 1}`} 
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : url.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i) ? (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                      <Music className="h-10 w-10 text-gray-400" />
                      <span className="text-xs mt-2 text-gray-500 text-center px-2 truncate w-full">
                        {url.split('/').pop()?.split('-').slice(1).join('-')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                      <File className="h-10 w-10 text-gray-400" />
                      <span className="text-xs mt-2 text-gray-500 text-center px-2 truncate w-full">
                        {url.split('/').pop()?.split('-').slice(1).join('-')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4 text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-2">No uploaded files yet</p>
              </div>
              
              {renderPlaceholderImages()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
