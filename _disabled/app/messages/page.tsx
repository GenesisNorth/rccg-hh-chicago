"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow } from "@/components/communication/chat-window";
import { ChatList } from "@/components/communication/chat-list";
import { GroupChatList } from "@/components/communication/group-chat-list";
import { NewChatDialog } from "@/components/communication/new-chat-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Users,
  Plus,
  Search,
  Phone,
  Video,
  Settings,
  Bell,
  BellOff,
} from "lucide-react";

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

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/messages/chats");
        
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          setChats([]);
          toast({
            title: "Error",
            description: "Failed to load messages",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user, toast]);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || 
      (activeTab === "direct" && chat.type === "direct") ||
      (activeTab === "groups" && chat.type === "group") ||
      (activeTab === "channels" && chat.type === "channel") ||
      (activeTab === "unread" && chat.unreadCount > 0);

    return matchesSearch && matchesTab;
  });

  const totalUnreadCount = chats.reduce((total, chat) => total + chat.unreadCount, 0);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark messages as read
    if (chat.unreadCount > 0) {
      setChats(prevChats =>
        prevChats.map(c =>
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const handleNewChat = (newChat: Chat) => {
    setChats(prevChats => [newChat, ...prevChats]);
    setSelectedChat(newChat);
    setNewChatDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Connect with church members, pastors, and ministry teams
          </p>
        </div>
        <div className="flex items-center gap-2">
          {totalUnreadCount > 0 && (
            <Badge variant="destructive" className="mr-2">
              {totalUnreadCount} unread
            </Badge>
          )}
          <Button onClick={() => setNewChatDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Chat List Sidebar */}
        <div className="lg:col-span-4">
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversations
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="direct" className="text-xs">Direct</TabsTrigger>
                  <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Unread
                    {totalUnreadCount > 0 && (
                      <Badge variant="destructive" className="ml-1 text-xs h-4 w-4 p-0">
                        {totalUnreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="m-0">
                  <ChatList
                    chats={filteredChats}
                    selectedChat={selectedChat}
                    onChatSelect={handleChatSelect}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              currentUser={user}
              onChatUpdate={(updatedChat) => {
                setChats(prevChats =>
                  prevChats.map(c =>
                    c.id === updatedChat.id ? updatedChat : c
                  )
                );
                setSelectedChat(updatedChat);
              }}
            />
          ) : (
            <Card className="h-[calc(100vh-200px)]">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                  <Button onClick={() => setNewChatDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Chat Dialog */}
      <NewChatDialog
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
        onChatCreated={handleNewChat}
      />
    </div>
  );
}