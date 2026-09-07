"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  category: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  maxAttendees?: number;
  currentAttendees: number;
  organizer: {
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminEventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/events");

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
          setFilteredEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  // Filter events
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        const duplicatedEvent = await response.json();
        setEvents([duplicatedEvent, ...events]);
        toast({
          title: "Success",
          description: "Event duplicated successfully",
        });
      } else {
        throw new Error("Failed to duplicate event");
      }
    } catch (error) {
      console.error("Error duplicating event:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate event",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "default";
      case "ONGOING":
        return "secondary";
      case "COMPLETED":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      WORSHIP: "bg-blue-100 text-blue-700",
      YOUTH: "bg-green-100 text-green-700",
      WOMEN: "bg-pink-100 text-pink-700",
      MEN: "bg-indigo-100 text-indigo-700",
      CHILDREN: "bg-yellow-100 text-yellow-700",
      SPIRITUAL: "bg-purple-100 text-purple-700",
      COMMUNITY: "bg-orange-100 text-orange-700",
      TRAINING: "bg-teal-100 text-teal-700",
    };
    return colors[category as keyof typeof colors] || "bg-muted text-foreground";
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
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and track church events and activities
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="WORSHIP">Worship</SelectItem>
                  <SelectItem value="YOUTH">Youth</SelectItem>
                  <SelectItem value="WOMEN">Women</SelectItem>
                  <SelectItem value="MEN">Men</SelectItem>
                  <SelectItem value="CHILDREN">Children</SelectItem>
                  <SelectItem value="SPIRITUAL">Spiritual</SelectItem>
                  <SelectItem value="COMMUNITY">Community</SelectItem>
                  <SelectItem value="TRAINING">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(event.date), "PPP")}</div>
                          <div className="text-muted-foreground">
                            {format(new Date(`${event.date}T${event.time}`), "p")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.currentAttendees}
                            {event.maxAttendees && `/${event.maxAttendees}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{event.organizer.name}</div>
                          <div className="text-muted-foreground">{event.organizer.role}</div>
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
                              <Link href={`/events/${event.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Event
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Event
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/attendees`}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Attendees
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDuplicateEvent(event.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate Event
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Attendees
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}