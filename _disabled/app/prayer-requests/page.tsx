"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  Heart,
  MessageCircle,
  Users,
  Lock,
  Globe,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  HandHeart,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: "health" | "family" | "work" | "ministry" | "personal" | "community";
  priority: "low" | "medium" | "high" | "urgent";
  privacy: "public" | "members-only" | "leadership-only";
  status: "active" | "answered" | "ongoing" | "closed";
  tags: string[];
  prayerCount: number;
  userHasPrayed: boolean;
  comments: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    timestamp: string;
  }>;
  answeredAt?: string;
  answeredDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PrayerRequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    category: "personal" as PrayerRequest["category"],
    priority: "medium" as PrayerRequest["priority"],
    privacy: "public" as PrayerRequest["privacy"],
    tags: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/prayer-requests");
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setRequests([]);
        toast({
          title: "Error",
          description: "Failed to load prayer requests",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      toast({
        title: "Error",
        description: "Failed to load prayer requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and description",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const requestData = {
        ...newRequest,
        requestedBy: {
          id: user?.id || "",
          name: user?.name || "Anonymous",
          avatar: user?.image || undefined,
          role: user?.role || "Member",
        },
      };

      const response = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to create prayer request");
      }

      const savedRequest = await response.json();
      setRequests(prev => [savedRequest, ...prev]);

      toast({
        title: "Prayer Request Created",
        description: "Your prayer request has been shared with the community",
      });

      // Reset form
      setNewRequest({
        title: "",
        description: "",
        category: "personal",
        priority: "medium",
        privacy: "public",
        tags: [],
      });
      setShowNewRequest(false);

    } catch (error) {
      console.error("Error creating prayer request:", error);
      toast({
        title: "Error",
        description: "Failed to create prayer request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrayForRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/prayer-requests/${requestId}/pray`, {
        method: "POST",
      });

      if (response.ok) {
      setRequests(prev => prev.map(req =>
          req.id === requestId
            ? {
                ...req,
                prayerCount: req.userHasPrayed ? req.prayerCount - 1 : req.prayerCount + 1,
                userHasPrayed: !req.userHasPrayed
              }
            : req
        ));

        const target = requests.find(r => r.id === requestId);
        toast({
          title: target?.userHasPrayed ? "Prayer Removed" : "Prayer Added",
          description: target?.userHasPrayed
            ? "You are no longer praying for this request"
            : "You are now praying for this request",
        });
      }
    } catch (error) {
      console.error("Error updating prayer:", error);
      toast({
        title: "Error",
        description: "Failed to update prayer status",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "health", label: "Health & Healing" },
    { value: "family", label: "Family & Relationships" },
    { value: "work", label: "Work & Career" },
    { value: "ministry", label: "Ministry & Service" },
    { value: "personal", label: "Personal Growth" },
    { value: "community", label: "Community & Outreach" },
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "ongoing", label: "Ongoing" },
    { value: "answered", label: "Answered" },
    { value: "closed", label: "Closed" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || request.category === filterCategory;
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
          <h1 className="text-3xl font-bold">Prayer Requests</h1>
          <p className="text-muted-foreground mt-2">
            Share your prayer needs and lift each other up in faith
          </p>
        </div>
        <Button onClick={() => setShowNewRequest(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prayer requests..."
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prayer Requests List */}
      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <HandHeart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No prayer requests found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Be the first to share a prayer request"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.requestedBy.avatar} alt={request.requestedBy.name} />
                    <AvatarFallback>
                      {request.requestedBy.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{request.requestedBy.name}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                          <div className="flex items-center gap-1">
                            {request.privacy === "members-only" && <Users className="h-3 w-3" />}
                            {request.privacy === "leadership-only" && <Lock className="h-3 w-3" />}
                            {request.privacy === "public" && <Globe className="h-3 w-3" />}
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
                          {request.requestedBy.id === user?.id && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Request
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Request
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {request.category.replace("-", " ")}
                      </Badge>
                      <Badge className={priorities.find(p => p.value === request.priority)?.color}>
                        {request.priority}
                      </Badge>
                      <Badge 
                        variant={request.status === "answered" ? "default" : "outline"}
                        className={request.status === "answered" ? "bg-green-100 text-green-800" : ""}
                      >
                        {request.status}
                      </Badge>
                      {request.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground">{request.description}</p>

                    {/* Answered section */}
                    {request.status === "answered" && request.answeredDescription && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">Prayer Answered</span>
                          <span className="text-sm text-green-600">
                            {formatDistanceToNow(new Date(request.answeredAt!), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-green-700">{request.answeredDescription}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant={request.userHasPrayed ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePrayForRequest(request.id)}
                        className="flex items-center gap-2"
                      >
                        <Heart className={`h-4 w-4 ${request.userHasPrayed ? "fill-current" : ""}`} />
                        {request.prayerCount} {request.prayerCount === 1 ? "Prayer" : "Prayers"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {request.comments.length} {request.comments.length === 1 ? "Comment" : "Comments"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Prayer Request Dialog */}
      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share a Prayer Request</DialogTitle>
            <DialogDescription>
              Share your prayer needs with the church community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief title for your prayer request"
                value={newRequest.title}
                onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Share details about your prayer request..."
                value={newRequest.description}
                onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newRequest.category} onValueChange={(value: PrayerRequest["category"]) => setNewRequest(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health & Healing</SelectItem>
                    <SelectItem value="family">Family & Relationships</SelectItem>
                    <SelectItem value="work">Work & Career</SelectItem>
                    <SelectItem value="ministry">Ministry & Service</SelectItem>
                    <SelectItem value="personal">Personal Growth</SelectItem>
                    <SelectItem value="community">Community & Outreach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newRequest.priority} onValueChange={(value: PrayerRequest["priority"]) => setNewRequest(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Privacy</Label>
              <Select value={newRequest.privacy} onValueChange={(value: PrayerRequest["privacy"]) => setNewRequest(prev => ({ ...prev, privacy: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Everyone can see</SelectItem>
                  <SelectItem value="members-only">Members Only - Church members only</SelectItem>
                  <SelectItem value="leadership-only">Leadership Only - Leaders and pastors only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}