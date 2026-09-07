import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  disabled?: boolean;
  variant?: 'image' | 'video' | 'audio';
}

export default function FileUpload({
  onChange,
  onRemove,
  value,
  disabled,
  variant = 'image'
}: FileUploadProps) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  // Cloudinary has no 'audio' resource type — audio files upload under 'video'
  const resourceTypes: Record<string, string> = {
    image: "image",
    video: "video",
    audio: "video",
  };

  const allowedFormats: Record<string, string[]> = {
    image: ["image"],
    video: ["video"],
    audio: ["mp3", "wav", "ogg", "m4a", "aac"],
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            {variant === 'image' && (
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {variant === 'image' ? (
              <Image
                fill
                className="object-cover"
                alt="Upload"
                src={url}
              />
            ) : variant === 'video' ? (
              <video src={url} controls className="w-full h-full" />
            ) : (
              <audio src={url} controls className="w-full mt-4" />
            )}
          </div>
        ))}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        options={{
          maxFiles: 1,
          resourceType: resourceTypes[variant],
          clientAllowedFormats: allowedFormats[variant],
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload {variant}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
