"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { canManageContent } from "@/lib/roles";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  Book,
  Calendar,
  Clock,
  Share2,
  Heart,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  Volume2,
  Download,
  Loader2,
  Quote,
  Star,
  CheckCircle,
  Users,
} from "lucide-react";
import { formatDistanceToNow, format, startOfWeek, endOfWeek, isToday } from "date-fns";

interface Devotional {
  id: string;
  title: string;
  content: string;
  scriptureReference: string;
  scriptureText: string;
  keyVerse: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: "daily" | "weekly" | "special" | "youth" | "children" | "study";
  tags: string[];
  audioUrl?: string;
  audioDuration?: number;
  readingTime: number; // in minutes
  isBookmarked: boolean;
  hasCompleted: boolean;
  completedAt?: string;
  likes: number;
  userHasLiked: boolean;
  shares: number;
  publishedAt: string;
  scheduledFor?: string;
  isPublished: boolean;
  featuredImageUrl?: string;
  prayerPoints?: string[];
  reflection?: {
    questions: string[];
    action: string;
  };
  series?: {
    id: string;
    title: string;
    part: number;
    totalParts: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface DevotionalSeries {
  id: string;
  title: string;
  description: string;
  totalParts: number;
  completedParts: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function DevotionalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [series, setSeries] = useState<DevotionalSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [showNewDevotional, setShowNewDevotional] = useState(false);
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Form state for new devotional
  const [newDevotional, setNewDevotional] = useState({
    title: "",
    content: "",
    scriptureReference: "",
    scriptureText: "",
    keyVerse: "",
    category: "daily" as Devotional["category"],
    tags: [] as string[],
    prayerPoints: [""] as string[],
    reflectionQuestions: [""] as string[],
    reflectionAction: "",
    scheduledFor: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDevotionals();
    fetchSeries();
  }, []);

  const fetchDevotionals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/devotionals");

      if (response.ok) {
        const data = await response.json();
        // Map API data to UI Devotional interface
        const mappedDevotionals: Devotional[] = data.map((apiDev: any) => {
          return {
            id: apiDev.id,
            title: apiDev.title,
            content: apiDev.content,
            scriptureReference: apiDev.scripture || "",
            scriptureText: "", // Backend doesn't store full text separately yet
            keyVerse: "",
            author: {
              id: apiDev.authorId,
              name: apiDev.authorName,
              role: "Author", // Default role
            },
            category: "daily", // Default category
            tags: apiDev.tags || [],
            readingTime: Math.ceil(apiDev.content.length / 200), // Estimate reading time
            isBookmarked: false, // User specific, needs separate implementation
            hasCompleted: false, // User specific
            likes: apiDev.likes || 0,
            userHasLiked: false,
            shares: 0,
            publishedAt: apiDev.date, // API returns ISO string for date
            isPublished: apiDev.isPublished,
            featuredImageUrl: apiDev.image,
            prayerPoints: apiDev.prayerPoint ? [apiDev.prayerPoint] : [],
            reflection: undefined, // Backend doesn't support this yet
            createdAt: apiDev.createdAt,
            updatedAt: apiDev.updatedAt,
          };
        });
        setDevotionals(mappedDevotionals);
      } else {
        toast({
          title: "Error",
          description: "Failed to load devotionals from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching devotionals:", error);
      toast({
        title: "Error",
        description: "Failed to load devotionals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch("/api/devotional-series");

      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      } else {
        setSeries([]);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

  const handleCompleteDevotional = async (devotionalId: string) => {
    try {
      const response = await fetch(`/api/devotionals/${devotionalId}/complete`, {
        method: "POST",
      });

      if (response.ok) {
        setDevotionals(prev => prev.map(dev =>
          dev.id === devotionalId
            ? {
              ...dev,
              hasCompleted: !dev.hasCompleted,
              completedAt: dev.hasCompleted ? undefined : new Date().toISOString()
            }
            : dev
        ));

        const devotional = devotionals.find(d => d.id === devotionalId);
        toast({
          title: devotional?.hasCompleted ? "Devotional Unmarked" : "Devotional Completed!",
          description: devotional?.hasCompleted
            ? "You can always come back to complete this devotional"
            : "Great job staying consistent in your spiritual growth!",
        });
      }
    } catch (error) {
      console.error("Error updating completion:", error);
      toast({
        title: "Error",
        description: "Failed to update completion status",
        variant: "destructive",
      });
    }
  };

  const handleBookmarkDevotional = async (devotionalId: string) => {
    try {
      const response = await fetch(`/api/devotionals/${devotionalId}/bookmark`, {
        method: "POST",
      });

      if (response.ok) {
        setDevotionals(prev => prev.map(dev =>
          dev.id === devotionalId
            ? { ...dev, isBookmarked: !dev.isBookmarked }
            : dev
        ));
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const handleLikeDevotional = async (devotionalId: string) => {
    try {
      const response = await fetch(`/api/devotionals/${devotionalId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setDevotionals(prev => prev.map(dev =>
          dev.id === devotionalId
            ? {
              ...dev,
              likes: dev.userHasLiked ? dev.likes - 1 : dev.likes + 1,
              userHasLiked: !dev.userHasLiked
            }
            : dev
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

  const handleAudioToggle = (devotionalId: string) => {
    if (playingAudio === devotionalId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(devotionalId);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "daily", label: "Daily Devotionals" },
    { value: "weekly", label: "Weekly Studies" },
    { value: "youth", label: "Youth Focus" },
    { value: "children", label: "Children" },
    { value: "special", label: "Special Occasions" },
    { value: "study", label: "Bible Study" },
  ];

  const getDevotionalsByTab = (tab: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (tab) {
      case "today":
        return devotionals.filter(dev => isToday(new Date(dev.publishedAt)) && dev.isPublished);
      case "this-week":
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return devotionals.filter(dev => {
          const pubDate = new Date(dev.publishedAt);
          return pubDate >= weekStart && pubDate <= weekEnd && dev.isPublished;
        });
      case "bookmarked":
        return devotionals.filter(dev => dev.isBookmarked);
      case "completed":
        return devotionals.filter(dev => dev.hasCompleted);
      default:
        return devotionals.filter(dev => dev.isPublished);
    }
  };

  const filteredDevotionals = getDevotionalsByTab(activeTab).filter(devotional => {
    const matchesSearch = devotional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotional.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotional.scriptureReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotional.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || devotional.category === filterCategory;

    return matchesSearch && matchesCategory;
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
          <h1 className="text-3xl font-bold">Daily Devotionals</h1>
          <p className="text-muted-foreground mt-2">
            Grow deeper in your faith with daily spiritual nourishment
          </p>
        </div>
        {canManageContent(user?.role) && (
          <Button onClick={() => setShowNewDevotional(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Devotional
          </Button>
        )}
      </div>

      {/* Active Series */}
      {series.filter(s => s.isActive).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Series</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {series.filter(s => s.isActive).map((serie) => (
              <Card key={serie.id} className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{serie.title}</h3>
                    <Badge variant="secondary">
                      {serie.completedParts}/{serie.totalParts}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{serie.description}</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(serie.completedParts / serie.totalParts) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((serie.completedParts / serie.totalParts) * 100)}% complete
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="this-week">This Week</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devotionals..."
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
          </div>
        </CardContent>
      </Card>

      {/* Devotionals List */}
      <div className="space-y-6">
        {filteredDevotionals.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No devotionals found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Check back soon for new devotionals"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDevotionals.map((devotional) => (
            <Card key={devotional.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={devotional.author.avatar} alt={devotional.author.name} />
                    <AvatarFallback>
                      {devotional.author.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-xl">{devotional.title}</h3>
                          {devotional.hasCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>{devotional.author.name}</span>
                          <span>•</span>
                          <span>{devotional.author.role}</span>
                          <span>•</span>
                          <span>{format(new Date(devotional.publishedAt), "MMM d, yyyy")}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {devotional.readingTime} min read
                          </span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleBookmarkDevotional(devotional.id)}>
                            {devotional.isBookmarked ? (
                              <BookmarkCheck className="mr-2 h-4 w-4" />
                            ) : (
                              <Bookmark className="mr-2 h-4 w-4" />
                            )}
                            {devotional.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Devotional
                          </DropdownMenuItem>
                          {devotional.audioUrl && (
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Audio
                            </DropdownMenuItem>
                          )}
                          {(canManageContent(user?.role) || devotional.author.id === user?.id) && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Devotional
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Devotional
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {devotional.category}
                      </Badge>
                      {devotional.series && (
                        <Badge variant="outline">
                          {devotional.series.title} • Part {devotional.series.part}
                        </Badge>
                      )}
                      {devotional.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Scripture Reference */}
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <Quote className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-primary mb-1">{devotional.scriptureReference}</p>
                          <p className="text-sm italic">{devotional.keyVerse}</p>
                        </div>
                      </div>
                    </div>

                    {/* Audio Player */}
                    {devotional.audioUrl && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAudioToggle(devotional.id)}
                        >
                          {playingAudio === devotional.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="w-full h-1 bg-muted rounded-full">
                            <div className="w-1/3 h-1 bg-primary rounded-full"></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Audio • {Math.floor((devotional.audioDuration || 0) / 60)}:{((devotional.audioDuration || 0) % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground line-clamp-3">
                        {devotional.content.substring(0, 200)}...
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant={devotional.hasCompleted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCompleteDevotional(devotional.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className={`h-4 w-4 ${devotional.hasCompleted ? "fill-current" : ""}`} />
                        {devotional.hasCompleted ? "Completed" : "Mark Complete"}
                      </Button>
                      <Button
                        variant={devotional.userHasLiked ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLikeDevotional(devotional.id)}
                        className="flex items-center gap-2"
                      >
                        <Heart className={`h-4 w-4 ${devotional.userHasLiked ? "fill-current" : ""}`} />
                        {devotional.likes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDevotional(devotional)}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Devotional Detail Dialog */}
      <Dialog open={!!selectedDevotional} onOpenChange={() => setSelectedDevotional(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedDevotional && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDevotional.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span>{selectedDevotional.author.name}</span>
                  <span>•</span>
                  <span>{format(new Date(selectedDevotional.publishedAt), "MMMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{selectedDevotional.readingTime} min read</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Scripture */}
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                  <h3 className="font-semibold text-primary mb-2">{selectedDevotional.scriptureReference}</h3>
                  <p className="italic">{selectedDevotional.scriptureText}</p>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{selectedDevotional.content}</div>
                </div>

                {/* Prayer Points */}
                {selectedDevotional.prayerPoints && selectedDevotional.prayerPoints.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Prayer Points
                    </h3>
                    <ul className="space-y-2">
                      {selectedDevotional.prayerPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reflection */}
                {selectedDevotional.reflection && (
                  <div>
                    <h3 className="font-semibold mb-3">Reflection</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Questions for Reflection:</h4>
                        <ul className="space-y-1">
                          {selectedDevotional.reflection.questions.map((question, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {index + 1}. {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Action Step:</h4>
                        <p className="text-sm text-muted-foreground">{selectedDevotional.reflection.action}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant={selectedDevotional.hasCompleted ? "default" : "outline"}
                  onClick={() => handleCompleteDevotional(selectedDevotional.id)}
                >
                  {selectedDevotional.hasCompleted ? "Completed ✓" : "Mark as Complete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBookmarkDevotional(selectedDevotional.id)}
                >
                  {selectedDevotional.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}