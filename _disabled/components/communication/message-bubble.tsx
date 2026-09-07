"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Reply,
  Edit,
  Copy,
  Trash2,
  Download,
  Play,
  Pause,
  FileText,
  Image as ImageIcon,
  Heart,
  ThumbsUp,
  Smile,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  type: "text" | "image" | "file" | "audio" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  isEdited?: boolean;
  editedAt?: string;
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  chatType: "direct" | "group" | "channel";
}

export function MessageBubble({ 
  message, 
  isCurrentUser, 
  showAvatar, 
  chatType 
}: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleReaction = (emoji: string) => {
    // Implementation for adding/removing reactions
    console.log("Add reaction:", emoji, "to message:", message.id);
  };

  const handleDownload = () => {
    if (message.fileUrl) {
      const link = document.createElement("a");
      link.href = message.fileUrl;
      link.download = message.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleReplyToMessage = () => {
    // Implementation for replying to message
    console.log("Reply to message:", message.id);
  };

  const handleEditMessage = () => {
    // Implementation for editing message
    console.log("Edit message:", message.id);
  };

  const handleDeleteMessage = () => {
    // Implementation for deleting message
    console.log("Delete message:", message.id);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "image":
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <div className="relative max-w-sm">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || "Image"}
                  className="rounded-lg max-w-full h-auto"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
            {message.content !== "📷 Image" && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg max-w-sm">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{message.fileName}</p>
              {message.fileSize && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(message.fileSize)}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );

      case "audio":
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg max-w-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <div className="w-32 h-1 bg-muted rounded-full">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">0:00 / 0:15</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );

      case "system":
        return (
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              {message.content}
            </Badge>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            {message.replyTo && (
              <div className="border-l-2 border-muted pl-3 py-1 bg-muted/30 rounded">
                <p className="text-xs font-medium text-muted-foreground">
                  {message.replyTo.senderName}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {message.replyTo.content}
                </p>
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
            {message.isEdited && (
              <p className="text-xs text-muted-foreground">(edited)</p>
            )}
          </div>
        );
    }
  };

  // System messages are centered and don't have avatars or actions
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-2">
        {renderMessageContent()}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-3 group",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      {showAvatar && !isCurrentUser && chatType !== "direct" && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback>
            {message.senderName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Spacer for alignment when no avatar */}
      {!showAvatar && !isCurrentUser && chatType !== "direct" && (
        <div className="w-8" />
      )}

      {/* Message Content */}
      <div className={cn(
        "flex flex-col space-y-1 max-w-xs lg:max-w-md",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        {/* Sender name for group chats */}
        {showAvatar && !isCurrentUser && chatType !== "direct" && (
          <p className="text-xs font-medium text-muted-foreground">
            {message.senderName}
          </p>
        )}

        {/* Message bubble */}
        <div className={cn(
          "relative px-3 py-2 rounded-lg",
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}>
          {renderMessageContent()}

          {/* Message actions */}
          <div className={cn(
            "absolute top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isCurrentUser ? "-left-20" : "-right-20"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Smile className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex gap-1 p-1">
                  {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                <DropdownMenuItem onClick={handleReplyToMessage}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyMessage}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </DropdownMenuItem>
                {isCurrentUser && (
                  <DropdownMenuItem onClick={handleEditMessage}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {(message.fileUrl || message.type === "image") && (
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                )}
                {isCurrentUser && (
                  <DropdownMenuItem
                    onClick={handleDeleteMessage}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleReaction(reaction.emoji)}
              >
                {reaction.emoji} {reaction.count}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={cn(
          "text-xs text-muted-foreground",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {format(new Date(message.timestamp), "h:mm a")}
        </p>
      </div>
    </div>
  );
}