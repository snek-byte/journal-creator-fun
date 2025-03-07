
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImagePlus, UploadCloud, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, filename?: string}>>([]);
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
        .select('url, filename')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user images:', error);
        return;
      }
      
      if (data && data.length) {
        console.log("ImageUploader: Loaded", data.length, "user images");
        setUploadedImages(data.map(item => ({ url: item.url, filename: item.filename })));
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
      
      // Create the bucket if it doesn't exist
      const checkStorageBucket = async () => {
        try {
          console.log("ImageUploader: Checking storage buckets");
          
          // First check if the bucket exists
          const { data: buckets, error: bucketsError } = await supabase
            .storage
            .listBuckets();
          
          if (bucketsError) {
            console.error('Error checking buckets:', bucketsError);
            return;
          }
          
          console.log("ImageUploader: Available buckets:", buckets.map(b => b.name).join(', '));
          
          // If journal-images bucket doesn't exist, show a warning
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

      console.log("ImageUploader: Authenticated as user:", user.id);

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      console.log("ImageUploader: Uploading with filename:", fileName);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('journal-images')
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          toast.error('Storage bucket not found. Please contact administrator.');
        } else {
          toast.error(`Upload error: ${error.message}`);
        }
        throw error;
      }

      console.log("ImageUploader: Upload successful, getting public URL");

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('journal-images')
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) throw new Error('Failed to get public URL');

      console.log("ImageUploader: Public URL obtained:", publicUrlData.publicUrl);

      // Store reference in database
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

      // Update local state
      setUploadedImages(prev => [publicUrlData.publicUrl, ...prev]);
      toast.success('Image uploaded successfully!');
      console.log("ImageUploader: Image successfully uploaded and saved");
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
    setOpen(false);
    toast.success('Image selected for your journal');
  };

  const handleDeleteImage = async (url: string, filename?: string) => {
    if (!filename) {
      toast.error('Cannot delete this image - missing filename information');
      return;
    }

    try {
      setIsDeleting(prev => ({ ...prev, [url]: true }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to delete images');
        return;
      }

      console.log("ImageUploader: Deleting image:", filename);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('journal-images')
        .remove([filename]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_images')
        .delete()
        .eq('user_id', user.id)
        .eq('filename', filename);

      if (dbError) {
        console.error("Database delete error:", dbError);
        throw dbError;
      }

      // Update local state
      setUploadedImages(prev => prev.filter(img => img.url !== url));
      toast.success('Image deleted successfully');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
    } finally {
      setIsDeleting(prev => ({ ...prev, [url]: false }));
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
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
              {uploadedImages.map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square overflow-hidden border rounded-md group"
                >
                  <img 
                    src={img.url} 
                    alt={`Uploaded image ${index + 1}`} 
                    className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageSelect(img.url)}
                    loading="lazy"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.url, img.filename);
                    }}
                    disabled={isDeleting[img.url]}
                    title="Delete image"
                  >
                    {isDeleting[img.url] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
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
