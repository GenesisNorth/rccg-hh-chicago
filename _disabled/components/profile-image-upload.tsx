"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";

interface ProfileImageUploadProps {
  initialImage?: string;
  onChange: (url: string, publicId: string) => void;
  onError?: (error: string) => void;
}

export function ProfileImageUpload({ 
  initialImage, 
  onChange,
  onError
}: ProfileImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file
    if (!file.type.startsWith('image/')) {
      const error = "Please upload an image file";
      setUploadError(error);
      if (onError) onError(error);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      const error = "Image must be less than 5MB";
      setUploadError(error);
      if (onError) onError(error);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {      // Create form data for upload
      const formData = new FormData();
      formData.append("image", file);

      // Upload to backend endpoint
      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      
      // Set image state and call onChange
      setImage(data.url);
      onChange(data.url, data.publicId);
      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated",
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to upload image";
      setUploadError(error);
      if (onError) onError(error);
      toast({
        title: "Upload failed",
        description: error,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const removeImage = () => {
    setImage(null);
    onChange("", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={image || ""} />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-1 flex-1">
          <h3 className="font-medium text-sm">Profile Picture</h3>
          <p className="text-xs text-muted-foreground">
            Upload a profile picture to personalize your account
          </p>
        </div>
      </div>

      {!image && (
        <Card 
          {...getRootProps()}
          className={`border-dashed cursor-pointer ${isDragActive ? 'border-primary' : ''}`}
        >
          <CardContent className="py-6 flex flex-col items-center justify-center text-center">
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop the image here" : "Drag an image here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports JPG, PNG and GIF up to 5MB
            </p>
            {isUploading && (
              <div className="mt-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
            {uploadError && (
              <div className="mt-2 text-sm text-destructive">
                {uploadError}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {image && (
        <div className="relative rounded-md overflow-hidden aspect-square w-full max-w-xs">
          <Image
            src={image}
            alt="Profile"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  const inputEl = document.createElement('input');
                  inputEl.type = 'file';
                  inputEl.accept = 'image/*';
                  inputEl.click();
                  inputEl.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files.length > 0) {
                      onDrop([target.files[0]]);
                    }
                  };
                }}
              >
                <Upload className="h-4 w-4 mr-1" />
                Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
