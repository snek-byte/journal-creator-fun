
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImagePlus, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const fetchUserImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_images')
        .select('url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length) {
        setUploadedImages(data.map(item => item.url));
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  React.useEffect(() => {
    fetchUserImages();
    
    // Create the bucket if it doesn't exist
    const createBucketIfNeeded = async () => {
      try {
        // First check if the bucket exists
        const { data: buckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();
        
        if (bucketsError) {
          console.error('Error checking buckets:', bucketsError);
          return;
        }
        
        // If journal-images bucket doesn't exist, show a warning
        if (!buckets.some(bucket => bucket.name === 'journal-images')) {
          console.warn('journal-images bucket not found. Please create it in the Supabase dashboard.');
          toast.warning('Image storage not fully configured. Contact administrator.');
        }
      } catch (error) {
        console.error('Error in bucket check:', error);
      }
    };
    
    createBucketIfNeeded();
  }, []);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 5MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload images');
        return;
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Check if the bucket exists before uploading
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets.some(bucket => bucket.name === 'journal-images')) {
        toast.error('Image storage not configured. Please contact administrator.');
        setIsUploading(false);
        return;
      }
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('journal-images')
        .upload(fileName, file);

      if (error) {
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          toast.error('Storage bucket not found. Please contact administrator.');
        } else {
          toast.error(`Upload error: ${error.message}`);
        }
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('journal-images')
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) throw new Error('Failed to get public URL');

      // Store reference in database
      const { error: dbError } = await supabase
        .from('user_images')
        .insert({
          user_id: user.id,
          url: publicUrlData.publicUrl,
          filename: fileName
        });

      if (dbError) throw dbError;

      // Update local state
      setUploadedImages(prev => [publicUrlData.publicUrl, ...prev]);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // More user-friendly error messages
      if (error.message?.includes('bucket') || error.message?.includes('not found')) {
        toast.error('Storage not properly configured. Please contact administrator.');
      } else if (error.message?.includes('permission')) {
        toast.error('You don\'t have permission to upload images.');
      } else {
        toast.error(error.message || 'Failed to upload image');
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = (url: string) => {
    onImageSelect(url);
    toast.success('Image selected for your journal');
  };

  // Helper function to render placeholder images
  const renderPlaceholderImages = () => {
    // Show these nice placeholders if no images are uploaded yet
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
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
          title="Upload or select image"
        >
          <ImagePlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Your Journal Images</DialogTitle>
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
                  Upload Image
                </>
              )}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
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
                  <img 
                    src={url} 
                    alt={`Uploaded image ${index + 1}`} 
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4 text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-2">No uploaded images yet</p>
              </div>
              
              {renderPlaceholderImages()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
