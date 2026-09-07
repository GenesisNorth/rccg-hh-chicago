"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  Download,
  Eye,
  Share2,
  MoreHorizontal,
  Clock,
  HardDrive,
  Calendar,
  User,
  Lock,
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

interface MediaCardProps {
  item: MediaItem;
  view: "grid" | "list";
  onView: () => void;
  onDownload: () => void;
}

export function MediaCard({ item, view, onView, onDownload }: MediaCardProps) {
  const [loading, setLoading] = useState(false);

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "IMAGE":
        return "bg-green-100 text-green-700";
      case "VIDEO":
        return "bg-blue-100 text-blue-700";
      case "AUDIO":
        return "bg-purple-100 text-purple-700";
      case "DOCUMENT":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-muted text-foreground";
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

  const handleDownload = async () => {
    setLoading(true);
    try {
      await onDownload();
    } finally {
      setLoading(false);
    }
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

  const TypeIcon = getTypeIcon(item.type);

  if (view === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail/Icon */}
            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              {item.thumbnailUrl && (item.type === "IMAGE" || item.type === "VIDEO") ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <TypeIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {item.duration && (
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Badge className={getTypeColor(item.type)} variant="secondary">
                        {item.type}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {formatFileSize(item.size)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {item.downloadCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!item.isPublic && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Button variant="outline" size="sm" onClick={onView}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDownload} disabled={loading}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="relative h-48 bg-muted">
        {item.thumbnailUrl && (item.type === "IMAGE" || item.type === "VIDEO") ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <TypeIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-3 left-3">
          <Badge className={getTypeColor(item.type)}>
            {item.type}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          {!item.isPublic && (
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
        </div>

        {item.duration && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm px-2 py-1 rounded">
            {formatDuration(item.duration)}
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={onView}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload} disabled={loading}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title & Category */}
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
            {item.title}
          </h3>
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {formatFileSize(item.size)}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {item.downloadCount}
          </div>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Uploader & Date */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {item.uploadedBy.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {item.uploadedBy.name}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(item.createdAt), "MMM d")}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" onClick={onView} className="flex-1">
          <Eye className="mr-2 h-3 w-3" />
          View
        </Button>
        <Button size="sm" onClick={handleDownload} disabled={loading} className="flex-1">
          {loading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
          ) : (
            <Download className="mr-2 h-3 w-3" />
          )}
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}