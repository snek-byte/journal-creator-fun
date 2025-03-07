
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useImageUploader(onDialogOpenChange: (open: boolean) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, filename?: string}>>([]);
  
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

  const uploadImage = async (file: File): Promise<string | null> => {
    console.log("ImageUploader: File selected for upload:", file.name, file.type, file.size);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 5MB.');
      return null;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return null;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload images');
        return null;
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
      setUploadedImages(prev => [{url: publicUrlData.publicUrl, filename: fileName}, ...prev]);
      toast.success('Image uploaded successfully!');
      console.log("ImageUploader: Image successfully uploaded and saved");
      
      return publicUrlData.publicUrl;
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
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (url: string, filename?: string) => {
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

  return {
    isUploading,
    isDeleting,
    uploadedImages,
    fetchUserImages,
    checkStorageBucket,
    uploadImage,
    deleteImage
  };
}
