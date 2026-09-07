"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, BellRing, Moon, Shield, Eye, Settings, Computer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationPreferences {
  email: {
    announcements: boolean;
    events: boolean;
    sermons: boolean;
    newsletters: boolean;
    prayerRequests: boolean;
  };
  inApp: {
    announcements: boolean;
    events: boolean;
    sermons: boolean;
    chat: boolean;
  };
}

interface PrivacySettings {
  profileVisibility: "public" | "members" | "private";
  showEmail: boolean;
  showPhone: boolean;
  showBirthday: boolean;
}

interface UserSettings {
  notificationPrefs: NotificationPreferences;
  theme: "light" | "dark" | "system";
  privacySettings: PrivacySettings;
}

interface UserSettingsProps {
  initialSettings?: {
    notificationPrefs: Partial<NotificationPreferences> | null;
    theme: "light" | "dark" | "system" | null;
    privacySettings: Partial<PrivacySettings> | null;
  };
}

const defaultNotificationPrefs: NotificationPreferences = {
  email: {
    announcements: true,
    events: true,
    sermons: true,
    newsletters: true,
    prayerRequests: true,
  },
  inApp: {
    announcements: true,
    events: true,
    sermons: true,
    chat: true,
  },
};

const defaultPrivacySettings: PrivacySettings = {
  profileVisibility: "members",
  showEmail: false,
  showPhone: false,
  showBirthday: false,
};

export default function UserSettingsPage({ initialSettings }: UserSettingsProps) {
  const { user, loading, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(defaultNotificationPrefs);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);

  // Seed from the user's Firestore doc (passed in by the profile page)
  useEffect(() => {
    if (!initialSettings) return;

    const prefs = initialSettings.notificationPrefs;
    setNotificationPrefs({
      email: { ...defaultNotificationPrefs.email, ...(prefs?.email ?? {}) },
      inApp: { ...defaultNotificationPrefs.inApp, ...(prefs?.inApp ?? {}) },
    });
    setTheme(initialSettings.theme || "system");
    setPrivacySettings({
      ...defaultPrivacySettings,
      ...(initialSettings.privacySettings ?? {}),
    });
  }, [initialSettings]);

  const saveSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      // Persists to the user's own Firestore doc (AuthContext shows success/error toasts)
      await updateUserProfile({
        notificationPrefs,
        theme,
        privacySettings,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <BellRing className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Manage how you receive notifications from the church
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-announcements" className="flex-1">
                  Announcements
                  <p className="text-sm text-muted-foreground">
                    Receive church announcements via email
                  </p>
                </Label>
                <Switch
                  id="email-announcements"
                  checked={notificationPrefs.email.announcements}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      email: { ...notificationPrefs.email, announcements: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-events" className="flex-1">
                  Events
                  <p className="text-sm text-muted-foreground">
                    Receive updates about upcoming events
                  </p>
                </Label>
                <Switch
                  id="email-events"
                  checked={notificationPrefs.email.events}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      email: { ...notificationPrefs.email, events: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-sermons" className="flex-1">
                  Sermons
                  <p className="text-sm text-muted-foreground">
                    Get notified when new sermons are posted
                  </p>
                </Label>
                <Switch
                  id="email-sermons"
                  checked={notificationPrefs.email.sermons}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      email: { ...notificationPrefs.email, sermons: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-newsletters" className="flex-1">
                  Newsletters
                  <p className="text-sm text-muted-foreground">
                    Receive church newsletters
                  </p>
                </Label>
                <Switch
                  id="email-newsletters"
                  checked={notificationPrefs.email.newsletters}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      email: { ...notificationPrefs.email, newsletters: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-prayers" className="flex-1">
                  Prayer Requests
                  <p className="text-sm text-muted-foreground">
                    Receive prayer request notifications
                  </p>
                </Label>
                <Switch
                  id="email-prayers"
                  checked={notificationPrefs.email.prayerRequests}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      email: { ...notificationPrefs.email, prayerRequests: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">In-App Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="app-announcements" className="flex-1">
                  Announcements
                  <p className="text-sm text-muted-foreground">
                    Show announcements in the app
                  </p>
                </Label>
                <Switch
                  id="app-announcements"
                  checked={notificationPrefs.inApp.announcements}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      inApp: { ...notificationPrefs.inApp, announcements: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="app-events" className="flex-1">
                  Events
                  <p className="text-sm text-muted-foreground">
                    Show event reminders in the app
                  </p>
                </Label>
                <Switch
                  id="app-events"
                  checked={notificationPrefs.inApp.events}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      inApp: { ...notificationPrefs.inApp, events: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="app-sermons" className="flex-1">
                  Sermons
                  <p className="text-sm text-muted-foreground">
                    Show new sermon notifications
                  </p>
                </Label>
                <Switch
                  id="app-sermons"
                  checked={notificationPrefs.inApp.sermons}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      inApp: { ...notificationPrefs.inApp, sermons: checked },
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="app-chat" className="flex-1">
                  Chat Messages
                  <p className="text-sm text-muted-foreground">
                    Show notifications for new messages
                  </p>
                </Label>
                <Switch
                  id="app-chat"
                  checked={notificationPrefs.inApp.chat}
                  onCheckedChange={(checked) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      inApp: { ...notificationPrefs.inApp, chat: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Moon className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize how the application looks for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
              >
                <SelectTrigger id="theme-select" className="w-full sm:w-[280px] mt-1.5">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Computer className="h-4 w-4 mr-2" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Privacy Settings</CardTitle>
          </div>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              value={privacySettings.profileVisibility}
              onValueChange={(value: "public" | "members" | "private") =>
                setPrivacySettings({
                  ...privacySettings,
                  profileVisibility: value,
                })
              }
            >
              <SelectTrigger id="profile-visibility" className="w-full sm:w-[280px] mt-1.5">
                <SelectValue placeholder="Who can see your profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="members">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Church Members Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Private (Only Admins)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-email" className="flex-1">
                Show Email Address
                <p className="text-sm text-muted-foreground">
                  Allow other members to see your email
                </p>
              </Label>
              <Switch
                id="show-email"
                checked={privacySettings.showEmail}
                onCheckedChange={(checked) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showEmail: checked,
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-phone" className="flex-1">
                Show Phone Number
                <p className="text-sm text-muted-foreground">
                  Allow other members to see your phone number
                </p>
              </Label>
              <Switch
                id="show-phone"
                checked={privacySettings.showPhone}
                onCheckedChange={(checked) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showPhone: checked,
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-birthday" className="flex-1">
                Show Birthday
                <p className="text-sm text-muted-foreground">
                  Allow other members to see your birthday
                </p>
              </Label>
              <Switch
                id="show-birthday"
                checked={privacySettings.showBirthday}
                onCheckedChange={(checked) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showBirthday: checked,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
