"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Users,
  MessageSquare,
  Hash,
  Plus,
  X,
  Loader2,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  ministry?: string;
  isOnline: boolean;
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
  isPinned: boolean;
  isMuted: boolean;
  ministry?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChatCreated: (chat: Chat) => void;
}

export function NewChatDialog({ open, onOpenChange, onChatCreated }: NewChatDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("direct");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupMinistry, setGroupMinistry] = useState("");

  // Mock users data
  const mockUsers: User[] = [
    {
      id: "pastor1",
      name: "Pastor Williams",
      email: "pastor@rccghalleluyahhouse.org",
      role: "Senior Pastor",
      avatar: "/images/pastor-williams.jpg",
      isOnline: true,
    },
    {
      id: "youth1",
      name: "Sarah Johnson",
      email: "sarah@rccghalleluyahhouse.org",
      role: "Youth Pastor",
      ministry: "youth",
      isOnline: false,
    },
    {
      id: "member1",
      name: "John Adebayo",
      email: "john@example.com",
      role: "Member",
      ministry: "men",
      isOnline: true,
    },
    {
      id: "member2",
      name: "Grace Okafor",
      email: "grace@example.com",
      role: "Member",
      ministry: "women",
      isOnline: true,
    },
    {
      id: "leader1",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Youth Leader",
      ministry: "youth",
      isOnline: false,
    },
    {
      id: "member3",
      name: "Mary Eze",
      email: "mary@example.com",
      role: "Member",
      ministry: "children",
      isOnline: true,
    },
  ];

  const filteredUsers = mockUsers.filter(u => 
    u.id !== user?.id && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ministries = [
    { value: "youth", label: "Youth Ministry" },
    { value: "women", label: "Women's Ministry" },
    { value: "men", label: "Men's Ministry" },
    { value: "children", label: "Children's Ministry" },
    { value: "worship", label: "Worship Ministry" },
    { value: "outreach", label: "Outreach Ministry" },
  ];

  const handleUserSelect = (selectedUser: User) => {
    if (activeTab === "direct") {
      // For direct messages, immediately create chat
      createDirectChat(selectedUser);
    } else {
      // For groups, add to selection
      const isSelected = selectedUsers.some(u => u.id === selectedUser.id);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== selectedUser.id));
      } else {
        setSelectedUsers([...selectedUsers, selectedUser]);
      }
    }
  };

  const createDirectChat = async (otherUser: User) => {
    try {
      setLoading(true);
      
      // In real app, this would be an API call
      const newChat: Chat = {
        id: `direct-${Date.now()}`,
        type: "direct",
        name: otherUser.name,
        avatar: otherUser.avatar,
        participants: [
          {
            id: user?.id || "current-user",
            name: user?.name || "You",
            role: user?.role || "Member",
            avatar: user?.image ?? undefined,
            isOnline: true,
          },
          {
            id: otherUser.id,
            name: otherUser.name,
            role: otherUser.role,
            avatar: otherUser.avatar,
            isOnline: otherUser.isOnline,
          },
        ],
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onChatCreated(newChat);
      
      toast({
        title: "Chat Created",
        description: `Started conversation with ${otherUser.name}`,
      });

      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error creating direct chat:", error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroupChat = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a group name and select at least one member",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // In real app, this would be an API call
      const newChat: Chat = {
        id: `group-${Date.now()}`,
        type: "group",
        name: groupName,
        description: groupDescription || undefined,
        participants: [
          {
            id: user?.id || "current-user",
            name: user?.name || "You",
            role: user?.role || "Member",
            avatar: user?.image ?? undefined,
            isOnline: true,
          },
          ...selectedUsers.map(u => ({
            id: u.id,
            name: u.name,
            role: u.role,
            avatar: u.avatar,
            isOnline: u.isOnline,
          })),
        ],
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        ministry: groupMinistry || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onChatCreated(newChat);
      
      toast({
        title: "Group Created",
        description: `Created group "${groupName}" with ${selectedUsers.length} members`,
      });

      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error creating group chat:", error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSearchTerm("");
    setSelectedUsers([]);
    setGroupName("");
    setGroupDescription("");
    setGroupMinistry("");
    setActiveTab("direct");
    onOpenChange(false);
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Create a direct message or group chat with church members
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Direct Message
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Chat
            </TabsTrigger>
          </TabsList>

          {/* Direct Message Tab */}
          <TabsContent value="direct" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-users">Search Members</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-users"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No members found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{user.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.role}
                      </p>
                    </div>
                    {user.ministry && (
                      <Badge variant="secondary" className="text-xs">
                        {user.ministry}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Group Chat Tab */}
          <TabsContent value="group" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-ministry">Ministry (Optional)</Label>
                <Select value={groupMinistry} onValueChange={setGroupMinistry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry.value} value={ministry.value}>
                        {ministry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-description">Description (Optional)</Label>
              <Textarea
                id="group-description"
                placeholder="Describe the purpose of this group"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Members ({selectedUsers.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                      {user.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeSelectedUser(user.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Add Users */}
            <div className="space-y-2">
              <Label>Add Members</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members to add..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleUserSelect(user)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    {user.ministry && (
                      <Badge variant="outline" className="text-xs">
                        {user.ministry}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          {activeTab === "group" && (
            <Button 
              onClick={createGroupChat} 
              disabled={loading || !groupName.trim() || selectedUsers.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}