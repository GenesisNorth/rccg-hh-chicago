"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  MoreHorizontal,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Share2,
  Lock,
  Unlock,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  HardDrive,
  Calendar,
  User,
} from "lucide-react";
import { format } from "date-fns";
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
  duration?: number;
  tags: string[];
  uploadedById: string;
  uploadedByName: string;
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

export default function AdminMediaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("ALL");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/media");

        if (response.ok) {
          const data = await response.json();
          setMediaItems(data);
          setFilteredItems(data);
        } else {
          throw new Error("Failed to fetch media items");
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        toast({
          title: "Error", // id: 1
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== "ALL") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Visibility filter
    if (visibilityFilter !== "ALL") {
      const isPublic = visibilityFilter === "PUBLIC";
      filtered = filtered.filter(item => item.isPublic === isPublic);
    }

    setFilteredItems(filtered);
  }, [mediaItems, searchTerm, typeFilter, categoryFilter, visibilityFilter]);

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
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleToggleVisibility = async (item: MediaItem) => {
    try {
      const response = await fetch(`/api/admin/media/${item.id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !item.isPublic }),
      });

      if (response.ok) {
        setMediaItems(items =>
          items.map(mediaItem =>
            mediaItem.id === item.id
              ? { ...mediaItem, isPublic: !mediaItem.isPublic }
              : mediaItem
          )
        );

        toast({
          title: "Success",
          description: `Media item ${item.isPublic ? "made private" : "made public"}`,
        });
      } else {
        throw new Error("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/admin/media/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMediaItems(items => items.filter(item => item.id !== itemToDelete.id));
        toast({
          title: "Success",
          description: "Media item deleted successfully",
        });
      } else {
        throw new Error("Failed to delete media item");
      }
    } catch (error) {
      console.error("Error deleting media item:", error);
      toast({
        title: "Error",
        description: "Failed to delete media item",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const response = await fetch("/api/admin/media/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds: selectedItems }),
      });

      if (response.ok) {
        setMediaItems(items => items.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        toast({
          title: "Success",
          description: `${selectedItems.length} media items deleted successfully`,
        });
      } else {
        throw new Error("Failed to delete media items");
      }
    } catch (error) {
      console.error("Error deleting media items:", error);
      toast({
        title: "Error",
        description: "Failed to delete media items",
        variant: "destructive",
      });
    }
  };

  const getTotalSize = () => {
    return filteredItems.reduce((total, item) => total + item.size, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Management</h1>
          <p className="text-muted-foreground">
            Manage church media library - photos, videos, audio, and documents
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/media/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
              </div>
              <HardDrive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(getTotalSize())}</p>
              </div>
              <HardDrive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Public Items</p>
                <p className="text-2xl font-bold">
                  {filteredItems.filter(item => item.isPublic).length}
                </p>
              </div>
              <Unlock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold">
                  {filteredItems.reduce((total, item) => total + item.downloadCount, 0)}
                </p>
              </div>
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="IMAGE">Images</SelectItem>
                  <SelectItem value="VIDEO">Videos</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                  <SelectItem value="DOCUMENT">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="SERMONS">Sermons</SelectItem>
                  <SelectItem value="MUSIC">Music</SelectItem>
                  <SelectItem value="EVENTS">Events</SelectItem>
                  <SelectItem value="OUTREACH">Outreach</SelectItem>
                  <SelectItem value="DOCUMENTS">Documents</SelectItem>
                  <SelectItem value="GALLERY">Gallery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Items</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedItems.length} items selected
              </span>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No media items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 bg-muted rounded flex items-center justify-center">
                              {item.thumbnailUrl ? (
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  className="h-full w-full object-cover rounded"
                                />
                              ) : (
                                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{item.title}</p>
                              {item.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <TypeIcon className="mr-1 h-3 w-3" />
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatFileSize(item.size)}</div>
                            {item.duration && (
                              <div className="text-muted-foreground">
                                {formatDuration(item.duration)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.downloadCount}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisibility(item)}
                          >
                            {item.isPublic ? (
                              <Unlock className="h-4 w-4 mr-1" />
                            ) : (
                              <Lock className="h-4 w-4 mr-1" />
                            )}
                            {item.isPublic ? "Public" : "Private"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{item.uploadedByName}</div>
                            <div className="text-muted-foreground">
                              {format(new Date(item.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/media/${item.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Item
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/media/${item.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleVisibility(item)}>
                                {item.isPublic ? (
                                  <Lock className="mr-2 h-4 w-4" />
                                ) : (
                                  <Unlock className="mr-2 h-4 w-4" />
                                )}
                                {item.isPublic ? "Make Private" : "Make Public"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setItemToDelete(item);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}