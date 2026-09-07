"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { canManageContent } from "@/lib/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaCard } from "@/components/media/media-card";
import { MediaFilters } from "@/components/media/media-filters";
import { MediaViewer } from "@/components/media/media-viewer";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, Grid, List, Filter, Plus } from "lucide-react";
import Link from "next/link";

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
  category: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  duration?: number; // for video/audio in seconds
  tags: string[];
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  downloadCount: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

export default function MediaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/media");
        
        if (response.ok) {
          const data = await response.json();
          setMediaItems(data);
          setFilteredItems(data);
        } else {
          setMediaItems([]);
          setFilteredItems([]);
          toast({
            title: "Error",
            description: "Failed to load media library",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        toast({
          title: "Error",
          description: "Failed to load media library",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [toast]);

  // Filter media items
  useEffect(() => {
    let filtered = mediaItems;

    // Only show public items to regular users, all items to admins
    if (user && !canManageContent(user.role)) {
      filtered = filtered.filter(item => item.isPublic);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [mediaItems, searchTerm, selectedType, selectedCategory, user]);

  const handleDownload = async (item: MediaItem) => {
    try {
      // Increment download count
      const response = await fetch(`/api/media/${item.id}/download`, {
        method: "POST",
      });

      if (response.ok) {
        // Update local state
        setMediaItems(items =>
          items.map(mediaItem =>
            mediaItem.id === item.id
              ? { ...mediaItem, downloadCount: mediaItem.downloadCount + 1 }
              : mediaItem
          )
        );

        // Trigger download
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Download Started",
          description: `Downloading ${item.title}`,
        });
      }
    } catch (error) {
      console.error("Error downloading media:", error);
      toast({
        title: "Error",
        description: "Failed to download media",
        variant: "destructive",
      });
    }
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
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Browse and download sermons, music, photos, and documents
          </p>
        </div>
        {user && canManageContent(user.role) && (
          <Button asChild>
            <Link href="/admin/media/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <MediaFilters
              selectedType={selectedType}
              selectedCategory={selectedCategory}
              onTypeChange={setSelectedType}
              onCategoryChange={setSelectedCategory}
            />
            <div className="flex gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Display */}
      <Tabs value={selectedType === "all" ? "all" : selectedType.toLowerCase()}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No media found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedType !== "all" || selectedCategory !== "all"
                      ? "Try adjusting your search or filters"
                      : "No media items are currently available"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={view === "grid" 
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-4"
            }>
              {filteredItems.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  view={view}
                  onView={() => setSelectedItem(item)}
                  onDownload={() => handleDownload(item)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Type-specific tabs would show filtered content */}
        <TabsContent value="image" className="mt-6">
          <div className={view === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
          }>
            {filteredItems.filter(item => item.type === "IMAGE").map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                view={view}
                onView={() => setSelectedItem(item)}
                onDownload={() => handleDownload(item)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <div className={view === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
          }>
            {filteredItems.filter(item => item.type === "VIDEO").map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                view={view}
                onView={() => setSelectedItem(item)}
                onDownload={() => handleDownload(item)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio" className="mt-6">
          <div className={view === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
          }>
            {filteredItems.filter(item => item.type === "AUDIO").map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                view={view}
                onView={() => setSelectedItem(item)}
                onDownload={() => handleDownload(item)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="document" className="mt-6">
          <div className={view === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
          }>
            {filteredItems.filter(item => item.type === "DOCUMENT").map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                view={view}
                onView={() => setSelectedItem(item)}
                onDownload={() => handleDownload(item)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Media Viewer Modal */}
      {selectedItem && (
        <MediaViewer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDownload={() => handleDownload(selectedItem)}
        />
      )}
    </div>
  );
}