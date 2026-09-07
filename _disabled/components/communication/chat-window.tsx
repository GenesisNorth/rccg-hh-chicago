"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageInput } from "@/components/communication/message-input";
import { MessageBubble } from "@/components/communication/message-bubble";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Video,
  Info,
  MoreHorizontal,
  Users,
  Hash,
  Bell,
  BellOff,
  UserPlus,
  Settings,
  Search,
  Pin,
  Archive,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface Chat {
  id: string;
  type: "direct" | "group" | "channel";
  name: string;
  description?: string;
  avatar?: string;
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

interface ChatWindowProps {
  chat: Chat;
  currentUser: any;
  onChatUpdate: (chat: Chat) => void;
}

export function ChatWindow({ chat, currentUser, onChatUpdate }: ChatWindowProps) {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatInfo, setShowChatInfo] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/messages/chats/${chat.id}/messages`);
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          // Mock messages for demo
          const mockMessages: Message[] = [
            {
              id: "1",
              content: "Hello! How are you doing today?",
              senderId: chat.participants[0]?.id || "other",
              senderName: chat.participants[0]?.name || "Other User",
              senderAvatar: chat.participants[0]?.avatar,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              type: "text",
            },
            {
              id: "2",
              content: "I'm doing well, thank you! How was your week?",
              senderId: currentUser?.uid || "user",
              senderName: currentUser?.name || "You",
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
              type: "text",
            },
            {
              id: "3",
              content: "It was great! I wanted to share something with you.",
              senderId: chat.participants[0]?.id || "other",
              senderName: chat.participants[0]?.name || "Other User",
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              type: "text",
            },
            {
              id: "4",
              content: "Thank you for your prayer request. I'll be praying for you and your family during this time.",
              senderId: chat.participants[0]?.id || "other",
              senderName: chat.participants[0]?.name || "Other User",
              timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
              type: "text",
            },
          ];
          
          setMessages(mockMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chat.id, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string, type: "text" | "image" | "file" | "audio" = "text", fileData?: any) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId: currentUser?.uid || "user",
        senderName: currentUser?.name || "You",
        senderAvatar: currentUser?.photoURL,
        timestamp: new Date().toISOString(),
        type,
        ...fileData,
      };

      // Optimistically add message
      setMessages(prev => [...prev, newMessage]);

      // Send to API
      const response = await fetch(`/api/messages/chats/${chat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type,
          ...fileData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();
      
      // Update with server response
      setMessages(prev => 
        prev.map(msg => msg.id === newMessage.id ? savedMessage : msg)
      );

      // Update chat's last message
      const updatedChat = {
        ...chat,
        lastMessage: {
          id: savedMessage.id,
          content: savedMessage.content,
          senderId: savedMessage.senderId,
          senderName: savedMessage.senderName,
          timestamp: savedMessage.timestamp,
          type: savedMessage.type,
        },
        updatedAt: savedMessage.timestamp,
      };
      
      onChatUpdate(updatedChat);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== Date.now().toString()));
    }
  };

  const handleToggleMute = () => {
    const updatedChat = { ...chat, isMuted: !chat.isMuted };
    onChatUpdate(updatedChat);
    toast({
      title: chat.isMuted ? "Chat Unmuted" : "Chat Muted",
      description: `You will ${chat.isMuted ? "now" : "no longer"} receive notifications for this chat.`,
    });
  };

  const handleTogglePin = () => {
    const updatedChat = { ...chat, isPinned: !chat.isPinned };
    onChatUpdate(updatedChat);
    toast({
      title: chat.isPinned ? "Chat Unpinned" : "Chat Pinned",
      description: `Chat ${chat.isPinned ? "removed from" : "added to"} pinned conversations.`,
    });
  };

  const getChatIcon = () => {
    switch (chat.type) {
      case "group":
        return Users;
      case "channel":
        return Hash;
      default:
        return null;
    }
  };

  const Icon = getChatIcon();
  const otherParticipant = chat.type === "direct" 
    ? chat.participants.find(p => p.id !== currentUser?.uid)
    : null;

  const getOnlineStatus = () => {
    if (chat.type === "direct" && otherParticipant) {
      if (otherParticipant.isOnline) {
        return "Online";
      } else if (otherParticipant.lastSeen) {
        return `Last seen ${formatDistanceToNow(new Date(otherParticipant.lastSeen), { addSuffix: true })}`;
      }
    } else if (chat.type === "group") {
      const onlineCount = chat.participants.filter(p => p.isOnline).length;
      return `${chat.participants.length} members, ${onlineCount} online`;
    }
    return "";
  };

  if (loading) {
    return (
      <Card className="h-[calc(100vh-200px)]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-200px)] flex flex-col">
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={chat.avatar || otherParticipant?.avatar} 
                alt={chat.name} 
              />
              <AvatarFallback>
                {Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  chat.name[0]?.toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            
            {chat.type === "direct" && otherParticipant?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{chat.name}</h3>
              {chat.isPinned && <Pin className="h-4 w-4 text-muted-foreground" />}
              {chat.isMuted && <BellOff className="h-4 w-4 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">
              {getOnlineStatus()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chat.type === "direct" && (
            <>
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowChatInfo(!showChatInfo)}
          >
            <Info className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                Search Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePin}>
                <Pin className="mr-2 h-4 w-4" />
                {chat.isPinned ? "Unpin" : "Pin"} Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleMute}>
                {chat.isMuted ? (
                  <Bell className="mr-2 h-4 w-4" />
                ) : (
                  <BellOff className="mr-2 h-4 w-4" />
                )}
                {chat.isMuted ? "Unmute" : "Mute"} Chat
              </DropdownMenuItem>
              {chat.type === "group" && (
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Members
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Chat Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Chat
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-2">👋</div>
              <h3 className="text-lg font-medium mb-1">Start the conversation</h3>
              <p className="text-muted-foreground text-sm">
                Send a message to begin chatting with {chat.name}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser?.uid}
              showAvatar={
                index === 0 || 
                messages[index - 1]?.senderId !== message.senderId ||
                new Date(message.timestamp).getTime() - new Date(messages[index - 1]?.timestamp).getTime() > 300000 // 5 minutes
              }
              chatType={chat.type}
            />
          ))
        )}
        
        {/* Typing Indicator */}
        {chat.isTyping && chat.isTyping.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
            <span className="text-sm text-muted-foreground">
              {chat.isTyping.length === 1 
                ? `${chat.isTyping[0].userName} is typing...`
                : `${chat.isTyping.length} people are typing...`
              }
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </Card>
  );
}