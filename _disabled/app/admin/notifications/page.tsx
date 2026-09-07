"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetRole: "ALL",
    actionUrl: "",
  });

  const load = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      setRecent(res.ok ? await res.json() : []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const send = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Missing information", description: "Title and message are required", variant: "destructive" });
      return;
    }
    try {
      setSending(true);
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, actionUrl: form.actionUrl || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      toast({ title: "Notification sent", description: `Delivered to ${data.recipients} member(s)` });
      setForm({ title: "", content: "", targetRole: "ALL", actionUrl: "" });
      await load();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Broadcast in-app notifications to members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>Appears in each member's notifications page immediately</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Service time change"
              />
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={form.targetRole} onValueChange={(v) => setForm((f) => ({ ...f, targetRole: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All members</SelectItem>
                  <SelectItem value="LEADER">Leaders</SelectItem>
                  <SelectItem value="PASTOR">Pastors</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              rows={3}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write the notification message…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actionUrl">Link (optional)</Label>
            <Input
              id="actionUrl"
              value={form.actionUrl}
              onChange={(e) => setForm((f) => ({ ...f, actionUrl: e.target.value }))}
              placeholder="/events/abc123"
            />
          </div>
          <Button onClick={send} disabled={sending}>
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send Notification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Sent</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nothing sent yet.</p>
          ) : (
            <div className="space-y-4">
              {recent.map((n) => (
                <div key={n.id} className="flex items-start gap-3 border-b pb-4 last:border-0">
                  <Bell className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ""}
                    </p>
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
