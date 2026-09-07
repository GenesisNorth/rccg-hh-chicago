"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  Download,
  Share2,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  HardDrive,
  Calendar,
  User,
  Eye,
  Tag,
} from "lucide-react";
import { format } from "date-fns";

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
  category: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  duration?: number;
  tags: string[];
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  isPublic: boolean;
  downloadCount: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

interface MediaViewerProps {
  item: MediaItem;
  onClose: () => void;
  onDownload: () => void;
}

export function MediaViewer({ item, onClose, onDownload }: MediaViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return FileImage;
      case "VIDEO":
        return FileVideo;
      case "AUDIO":
        return FileAudio;
      case "DOCUMENT":
        return FileText;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(item.url);
    }
  };

  const renderMediaContent = () => {
    switch (item.type) {
      case "IMAGE":
        return (
          <div className="relative w-full h-[60vh] bg-black rounded-lg overflow-hidden">
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>
        );

      case "VIDEO":
        return (
          <div className="relative w-full h-[60vh] bg-black rounded-lg overflow-hidden">
            <video
              src={item.url}
              controls
              className="w-full h-full object-contain"
              poster={item.thumbnailUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "AUDIO":
        return (
          <div className="w-full p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <FileAudio className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              {item.duration && (
                <p className="text-muted-foreground">
                  Duration: {formatDuration(item.duration)}
                </p>
              )}
            </div>
            <audio
              src={item.url}
              controls
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "DOCUMENT":
        return (
          <div className="w-full p-8 text-center bg-muted/50 rounded-lg">
            <div className="w-32 h-32 mx-auto bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground mb-4">
              {item.metadata?.format} Document • {formatFileSize(item.size)}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download to View
              </Button>
              {item.url.endsWith('.pdf') && (
                <Button variant="outline" onClick={() => window.open(item.url, '_blank')}>
                  <Maximize className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const TypeIcon = getTypeIcon(item.type);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl mb-2">{item.title}</DialogTitle>
              {item.description && (
                <DialogDescription className="text-base">
                  {item.description}
                </DialogDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <TypeIcon className="mr-1 h-3 w-3" />
                {item.type}
              </Badge>
              <Badge>{item.category}</Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Media Content */}
        <div className="mb-6">
          {renderMediaContent()}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          {item.type === "IMAGE" && (
            <Button variant="outline" onClick={() => window.open(item.url, '_blank')}>
              <Maximize className="mr-2 h-4 w-4" />
              View Full Size
            </Button>
          )}
        </div>

        <Separator />

        {/* Media Details */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Media Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span>{formatFileSize(item.size)}</span>
                </div>
                {item.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{formatDuration(item.duration)}</span>
                  </div>
                )}
                {item.metadata?.format && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span>{item.metadata.format}</span>
                  </div>
                )}
                {item.metadata?.width && item.metadata?.height && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span>{item.metadata.width} × {item.metadata.height}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span>{item.downloadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibility:</span>
                  <Badge variant={item.isPublic ? "default" : "secondary"}>
                    {item.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Uploader Info */}
            <div>
              <h4 className="font-semibold mb-3">Uploaded By</h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {item.uploadedBy.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.uploadedBy.name}</p>
                  <p className="text-sm text-muted-foreground">{item.uploadedBy.role}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Uploaded on {format(new Date(item.createdAt), "PPP")}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Tags & Additional Info */}
          <div className="space-y-4">
            {/* Tags */}
            {item.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional metadata could go here */}
            <div>
              <h4 className="font-semibold mb-3">Media Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{item.downloadCount} downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>{formatFileSize(item.size)} storage used</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}