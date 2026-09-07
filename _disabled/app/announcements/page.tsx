"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { canManageContent, hasLeadershipRole } from "@/lib/roles";
import { UserRole } from "@/lib/firestore-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  Megaphone,
  Pin,
  Calendar,
  Users,
  Globe,
  Lock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bell,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: "general" | "event" | "ministry" | "urgent" | "celebration" | "prayer" | "service";
  priority: "low" | "normal" | "high" | "urgent";
  audience: "everyone" | "members" | "leadership" | "ministry-specific";
  targetMinistry?: string;
  isPinned: boolean;
  isActive: boolean;
  expiresAt?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  engagement: {
    views: number;
    likes: number;
    comments: number;
    userHasLiked: boolean;
    userHasViewed: boolean;
  };
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAudience, setFilterAudience] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "general" as Announcement["category"],
    priority: "normal" as Announcement["priority"],
    audience: "everyone" as Announcement["audience"],
    targetMinistry: "",
    expiresAt: "",
    scheduledFor: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements");
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        setAnnouncements([]);
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const announcementData = {
        ...newAnnouncement,
        author: {
          id: user?.id || "",
          name: user?.name || "Anonymous",
          avatar: user?.image ?? undefined,
          role: user?.role || UserRole.MEMBER,
        },
      };

      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      const savedAnnouncement = await response.json();
      setAnnouncements(prev => [savedAnnouncement, ...prev]);

      toast({
        title: "Announcement Created",
        description: "Your announcement has been published",
      });

      // Reset form
      setNewAnnouncement({
        title: "",
        content: "",
        category: "general",
        priority: "normal",
        audience: "everyone",
        targetMinistry: "",
        expiresAt: "",
        scheduledFor: "",
      });
      setShowNewAnnouncement(false);

    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeAnnouncement = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setAnnouncements(prev => prev.map(announcement =>
          announcement.id === announcementId
            ? {
                ...announcement,
                engagement: {
                  ...announcement.engagement,
                  likes: announcement.engagement.userHasLiked 
                    ? announcement.engagement.likes - 1 
                    : announcement.engagement.likes + 1,
                  userHasLiked: !announcement.engagement.userHasLiked,
                }
              }
            : announcement
        ));
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/pin`, {
        method: "POST",
      });

      if (response.ok) {
        setAnnouncements(prev => prev.map(announcement =>
          announcement.id === announcementId
            ? { ...announcement, isPinned: !announcement.isPinned }
            : announcement
        ));

        const announcement = announcements.find(a => a.id === announcementId);
        toast({
          title: announcement?.isPinned ? "Announcement Unpinned" : "Announcement Pinned",
          description: announcement?.isPinned 
            ? "Announcement removed from pinned items" 
            : "Announcement pinned to top",
        });
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast({
        title: "Error",
        description: "Failed to update pin status",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "event", label: "Events" },
    { value: "ministry", label: "Ministry" },
    { value: "urgent", label: "Urgent" },
    { value: "celebration", label: "Celebrations" },
    { value: "prayer", label: "Prayer" },
    { value: "service", label: "Service" },
  ];

  const audiences = [
    { value: "all", label: "All Audiences" },
    { value: "everyone", label: "Everyone" },
    { value: "members", label: "Members Only" },
    { value: "leadership", label: "Leadership" },
    { value: "ministry-specific", label: "Ministry Specific" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-800", icon: Info },
    { value: "normal", label: "Normal", color: "bg-muted text-foreground", icon: Info },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "urgent": return AlertTriangle;
      case "celebration": return CheckCircle;
      case "event": return Calendar;
      case "prayer": return Heart;
      default: return Megaphone;
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || announcement.category === filterCategory;
    const matchesAudience = filterAudience === "all" || announcement.audience === filterAudience;
    const matchesPinned = !showPinnedOnly || announcement.isPinned;
    
    return matchesSearch && matchesCategory && matchesAudience && matchesPinned && announcement.isActive;
  });

  // Sort announcements: pinned first, then by priority, then by creation date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with church news and important information
          </p>
        </div>
        {hasLeadershipRole(user?.role) && (
          <Button onClick={() => setShowNewAnnouncement(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAudience} onValueChange={setFilterAudience}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((audience) => (
                  <SelectItem key={audience.value} value={audience.value}>
                    {audience.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showPinnedOnly ? "default" : "outline"}
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            >
              <Pin className="mr-2 h-4 w-4" />
              Pinned Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-6">
        {sortedAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterCategory !== "all" || filterAudience !== "all"
                    ? "Try adjusting your filters"
                    : "No announcements available"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedAnnouncements.map((announcement) => {
            const CategoryIcon = getCategoryIcon(announcement.category);
            const PriorityData = priorities.find(p => p.value === announcement.priority);
            const PriorityIcon = PriorityData?.icon || Info;

            return (
              <Card key={announcement.id} className={`hover:shadow-md transition-shadow ${announcement.isPinned ? "ring-2 ring-primary/20" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
                      <AvatarFallback>
                        {announcement.author.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                            {announcement.isPinned && (
                              <Pin className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{announcement.author.name}</span>
                            <span>•</span>
                            <span>{announcement.author.role}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}</span>
                            <div className="flex items-center gap-1">
                              {announcement.audience === "members" && <Users className="h-3 w-3" />}
                              {announcement.audience === "leadership" && <Lock className="h-3 w-3" />}
                              {announcement.audience === "everyone" && <Globe className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(canManageContent(user?.role) || announcement.author.id === user?.id) && (
                              <>
                                <DropdownMenuItem onClick={() => handleTogglePin(announcement.id)}>
                                  <Pin className="mr-2 h-4 w-4" />
                                  {announcement.isPinned ? "Unpin" : "Pin"} Announcement
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Announcement
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Announcement
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share Announcement
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CategoryIcon className="h-3 w-3" />
                          {announcement.category.replace("-", " ")}
                        </Badge>
                        <Badge className={`flex items-center gap-1 ${PriorityData?.color}`}>
                          <PriorityIcon className="h-3 w-3" />
                          {announcement.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {announcement.audience.replace("-", " ")}
                        </Badge>
                        {announcement.targetMinistry && (
                          <Badge variant="outline">
                            {announcement.targetMinistry} ministry
                          </Badge>
                        )}
                        {announcement.expiresAt && (
                          <Badge variant="outline" className="text-orange-600">
                            <Calendar className="mr-1 h-3 w-3" />
                            Expires {format(new Date(announcement.expiresAt), "MMM d")}
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                      </div>

                      {/* Attachments */}
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Attachments:</h4>
                          <div className="flex flex-wrap gap-2">
                            {announcement.attachments.map((attachment) => (
                              <Button key={attachment.id} variant="outline" size="sm" asChild>
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                  {attachment.name}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Engagement */}
                      <div className="flex items-center gap-4 pt-2">
                        <Button
                          variant={announcement.engagement.userHasLiked ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleLikeAnnouncement(announcement.id)}
                          className="flex items-center gap-2"
                        >
                          <Heart className={`h-4 w-4 ${announcement.engagement.userHasLiked ? "fill-current" : ""}`} />
                          {announcement.engagement.likes}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAnnouncement(announcement)}
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {announcement.engagement.comments}
                        </Button>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {announcement.engagement.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* New Announcement Dialog */}
      <Dialog open={showNewAnnouncement} onOpenChange={setShowNewAnnouncement}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Share important information with the church community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your announcement..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newAnnouncement.category} onValueChange={(value: Announcement["category"]) => setNewAnnouncement(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="prayer">Prayer</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newAnnouncement.priority} onValueChange={(value: Announcement["priority"]) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={newAnnouncement.audience} onValueChange={(value: Announcement["audience"]) => setNewAnnouncement(prev => ({ ...prev, audience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="ministry-specific">Ministry Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newAnnouncement.audience === "ministry-specific" && (
                <div className="space-y-2">
                  <Label>Target Ministry</Label>
                  <Select value={newAnnouncement.targetMinistry} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, targetMinistry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ministry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youth">Youth Ministry</SelectItem>
                      <SelectItem value="women">Women's Ministry</SelectItem>
                      <SelectItem value="men">Men's Ministry</SelectItem>
                      <SelectItem value="children">Children's Ministry</SelectItem>
                      <SelectItem value="worship">Worship Ministry</SelectItem>
                      <SelectItem value="outreach">Outreach Ministry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expires At (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule For (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.scheduledFor}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, scheduledFor: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAnnouncement(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Megaphone className="mr-2 h-4 w-4" />
                  Create Announcement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}