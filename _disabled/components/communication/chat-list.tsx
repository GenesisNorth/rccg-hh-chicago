"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MessageSquare, 
  Users, 
  Hash, 
  MoreHorizontal, 
  Pin, 
  Bell, 
  BellOff,
  Trash2,
  UserMinus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  type: "direct" | "group" | "channel";
  name: string;
  description?: string;
  avatar?: string;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    type: "text" | "image" | "file" | "audio";
  };
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  unreadCount: number;
  isTyping?: Array<{
    userId: string;
    userName: string;
  }>;
  isPinned: boolean;
  isMuted: boolean;
  ministry?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

export function ChatList({ chats, selectedChat, onChatSelect }: ChatListProps) {
  const getChatIcon = (type: string) => {
    switch (type) {
      case "direct":
        return MessageSquare;
      case "group":
        return Users;
      case "channel":
        return Hash;
      default:
        return MessageSquare;
    }
  };

  const getMessagePreview = (message: any) => {
    if (!message) return "No messages yet";
    
    switch (message.type) {
      case "image":
        return "📷 Image";
      case "file":
        return "📎 File";
      case "audio":
        return "🎵 Voice message";
      default:
        return message.content;
    }
  };

  const handleToggleMute = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    // Implementation for toggling mute
    console.log("Toggle mute for chat:", chatId);
  };

  const handleTogglePin = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    // Implementation for toggling pin
    console.log("Toggle pin for chat:", chatId);
  };

  const handleLeaveChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    // Implementation for leaving chat
    console.log("Leave chat:", chatId);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    // Implementation for deleting chat
    console.log("Delete chat:", chatId);
  };

  // Sort chats: pinned first, then by last message time
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const aTime = new Date(a.updatedAt).getTime();
    const bTime = new Date(b.updatedAt).getTime();
    return bTime - aTime;
  });

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No conversations found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {sortedChats.map((chat) => {
        const Icon = getChatIcon(chat.type);
        const isSelected = selectedChat?.id === chat.id;
        const otherParticipant = chat.type === "direct" 
          ? chat.participants.find(p => p.id !== "current-user-id")
          : null;
        
        return (
          <div
            key={chat.id}
            className={cn(
              "flex items-center gap-3 p-4 hover:bg-accent cursor-pointer transition-colors",
              isSelected && "bg-accent"
            )}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={chat.avatar || otherParticipant?.avatar} 
                  alt={chat.name} 
                />
                <AvatarFallback>
                  {chat.type === "direct" && otherParticipant ? (
                    otherParticipant.name[0]?.toUpperCase()
                  ) : chat.type === "group" ? (
                    <Users className="h-5 w-5" />
                  ) : (
                    <Hash className="h-5 w-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              
              {/* Online indicator for direct chats */}
              {chat.type === "direct" && otherParticipant?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              )}
              
              {/* Chat type icon */}
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-background border rounded-full flex items-center justify-center">
                <Icon className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium truncate">{chat.name}</h4>
                  {chat.isPinned && (
                    <Pin className="h-3 w-3 text-muted-foreground" />
                  )}
                  {chat.isMuted && (
                    <BellOff className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {chat.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                    </span>
                  )}
                  
                  {/* Unread count */}
                  {chat.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                      {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Last message or typing indicator */}
              <div className="text-sm text-muted-foreground">
                {chat.isTyping && chat.isTyping.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                    <span className="italic">
                      {chat.isTyping.length === 1 
                        ? `${chat.isTyping[0].userName} is typing...`
                        : `${chat.isTyping.length} people are typing...`
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {chat.lastMessage && (
                      <>
                        {chat.lastMessage.senderId !== "current-user-id" && chat.type !== "direct" && (
                          <span className="font-medium">
                            {chat.lastMessage.senderName}:
                          </span>
                        )}
                        <span className="truncate">
                          {getMessagePreview(chat.lastMessage)}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Ministry badge for ministry chats */}
              {chat.ministry && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {chat.ministry} ministry
                </Badge>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => handleTogglePin(e, chat.id)}>
                  <Pin className="mr-2 h-4 w-4" />
                  {chat.isPinned ? "Unpin" : "Pin"} Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleToggleMute(e, chat.id)}>
                  {chat.isMuted ? (
                    <Bell className="mr-2 h-4 w-4" />
                  ) : (
                    <BellOff className="mr-2 h-4 w-4" />
                  )}
                  {chat.isMuted ? "Unmute" : "Mute"} Chat
                </DropdownMenuItem>
                {chat.type === "group" && (
                  <DropdownMenuItem onClick={(e) => handleLeaveChat(e, chat.id)}>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Leave Group
                  </DropdownMenuItem>
                )}
                {chat.type === "direct" && (
                  <DropdownMenuItem 
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Chat
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}