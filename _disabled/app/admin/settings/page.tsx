"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceTime {
  day: string;
  time: string;
  name: string;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    churchName: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    aboutBlurb: "",
  });
  const [serviceTimes, setServiceTimes] = useState<ServiceTime[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings((s) => ({ ...s, ...Object.fromEntries(Object.entries(data).filter(([k]) => k in s)) }));
          if (Array.isArray(data.serviceTimes)) setServiceTimes(data.serviceTimes);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, serviceTimes }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "Saved", description: "Church settings updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((s) => ({ ...s, [key]: e.target.value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Church Settings</h1>
        <p className="text-muted-foreground">Contact details, service times, and social links</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Church Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Church Name</Label>
              <Input value={settings.churchName} onChange={set("churchName")} placeholder="RCCG Living Seed Church" />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={settings.tagline} onChange={set("tagline")} placeholder="A place to belong" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={settings.phone} onChange={set("phone")} placeholder="+234 …" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={settings.email} onChange={set("email")} placeholder="info@…" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={settings.address} onChange={set("address")} placeholder="Street, city" />
          </div>
          <div className="space-y-2">
            <Label>About Blurb</Label>
            <Textarea rows={3} value={settings.aboutBlurb} onChange={set("aboutBlurb")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Times</CardTitle>
          <CardDescription>Shown on the public website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {serviceTimes.map((st, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="space-y-1 flex-1">
                <Label className="text-xs">Service</Label>
                <Input
                  value={st.name}
                  onChange={(e) => setServiceTimes((arr) => arr.map((s, j) => (j === i ? { ...s, name: e.target.value } : s)))}
                  placeholder="Sunday Celebration"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Day</Label>
                <Input
                  className="w-28"
                  value={st.day}
                  onChange={(e) => setServiceTimes((arr) => arr.map((s, j) => (j === i ? { ...s, day: e.target.value } : s)))}
                  placeholder="Sunday"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Time</Label>
                <Input
                  className="w-28"
                  value={st.time}
                  onChange={(e) => setServiceTimes((arr) => arr.map((s, j) => (j === i ? { ...s, time: e.target.value } : s)))}
                  placeholder="9:00 AM"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setServiceTimes((arr) => arr.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setServiceTimes((arr) => [...arr, { name: "", day: "", time: "" }])}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input value={settings.facebookUrl} onChange={set("facebookUrl")} placeholder="https://facebook.com/…" />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input value={settings.instagramUrl} onChange={set("instagramUrl")} placeholder="https://instagram.com/…" />
          </div>
          <div className="space-y-2">
            <Label>YouTube</Label>
            <Input value={settings.youtubeUrl} onChange={set("youtubeUrl")} placeholder="https://youtube.com/…" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Settings
      </Button>
    </div>
  );
}
