"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Pin, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  audience: string;
  isPinned: boolean;
  isActive: boolean;
  author: { name: string; role: string };
  createdAt: string;
}

export default function AdminCommunicationsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "normal",
    audience: "everyone",
  });

  const load = async () => {
    try {
      const res = await fetch("/api/announcements");
      setAnnouncements(res.ok ? await res.json() : []);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const publish = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Missing information", description: "Title and content are required", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to publish");
      toast({ title: "Published", description: "Announcement is now live" });
      setForm({ title: "", content: "", category: "general", priority: "normal", audience: "everyone" });
      await load();
    } catch (error) {
      toast({ title: "Error", description: "Failed to publish announcement", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePin = async (id: string) => {
    const res = await fetch(`/api/announcements/${id}/pin`, { method: "POST" });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Announcement removed" });
      await load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
        <p className="text-muted-foreground">Publish and manage church announcements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Announcement</CardTitle>
          <CardDescription>Published immediately to the announcements feed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Announcement title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={4}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write the announcement…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={form.audience} onValueChange={(v) => setForm((f) => ({ ...f, audience: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={publish} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Megaphone className="mr-2 h-4 w-4" />}
            Publish
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-4 border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{a.title}</p>
                      {a.isPinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                      <Badge variant="secondary" className="capitalize">{a.category}</Badge>
                      <Badge variant="outline" className="capitalize">{a.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.author?.name} · {a.createdAt ? formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" title={a.isPinned ? "Unpin" : "Pin"} onClick={() => togglePin(a.id)}>
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => remove(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
