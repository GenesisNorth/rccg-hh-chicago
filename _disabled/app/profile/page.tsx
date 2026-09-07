"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, User, Mail, Phone, MapPin, CalendarClock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserSettings from "@/components/user-settings";
import { ProfileImageUpload } from "@/components/profile-image-upload";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().max(20, "Phone number is too long").optional(),
  address: z.string().max(200, "Address is too long").optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().max(100, "Occupation is too long").optional(),
  maritalStatus: z.string().optional(),
  anniversary: z.string().optional(),
  joinedChurchDate: z.string().optional(),
  emergencyContact: z.string().max(50, "Emergency contact is too long").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Firestore Timestamp (or ISO string) → ISO string
const tsToIso = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return typeof value === "string" ? value : null;
};

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  imagePublicId?: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  occupation: string | null;
  maritalStatus: string | null;
  anniversary: string | null;
  joinedChurchDate: string | null;
  emergencyContact: string | null;
  notificationPrefs: {
    emailNotifications?: boolean;
    inAppNotifications?: boolean;
    eventReminders?: boolean;
    churchAnnouncements?: boolean;
    prayerRequests?: boolean;
  } | null;
  theme: 'light' | 'dark' | 'system' | null;
  privacySettings: {
    profileVisibility?: 'public' | 'members' | 'private';
    showEmail?: boolean;
    showPhone?: boolean;
    showBirthday?: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { user, firebaseUser, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [sendingVerification, setSendingVerification] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      phone: "",
      address: "",
    },
  });
  
  // The signed-in user's own document already lives in AuthContext — no API round-trip needed
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    } else if (user) {
      const data: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        imagePublicId: user.imagePublicId,
        role: user.role,
        bio: user.bio,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dateOfBirth: tsToIso(user.dateOfBirth),
        occupation: user.occupation,
        maritalStatus: user.maritalStatus,
        anniversary: tsToIso(user.anniversary),
        joinedChurchDate: tsToIso(user.joinedChurchDate),
        emergencyContact: user.emergencyContact,
        notificationPrefs: user.notificationPrefs,
        theme: user.theme as UserProfile["theme"],
        privacySettings: user.privacySettings,
        createdAt: tsToIso(user.createdAt) || new Date().toISOString(),
        updatedAt: tsToIso(user.updatedAt) || new Date().toISOString(),
      };
      setProfile(data);

      form.reset({
        name: data.name || "",
        bio: data.bio || "",
        phone: data.phone || "",
        address: data.address || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        occupation: data.occupation || "",
        maritalStatus: data.maritalStatus || "",
        anniversary: data.anniversary ? data.anniversary.split("T")[0] : "",
        joinedChurchDate: data.joinedChurchDate ? data.joinedChurchDate.split("T")[0] : "",
        emergencyContact: data.emergencyContact || "",
      });
    }
  }, [user, loading, router, form]);

  const handleImageUpdate = async (url: string, publicId: string) => {
    if (profile) {
      setProfile({
        ...profile,
        image: url,
        imagePublicId: publicId
      });
      try {
        await updateUserProfile({ image: url || null, imagePublicId: publicId || null });
      } catch (error) {
        console.error("Error saving profile image:", error);
      }
    }
  };
  
  const handleSendVerificationEmail = async () => {
    try {
      setSendingVerification(true);
      if (!firebaseUser) {
        throw new Error("You must be signed in to verify your email");
      }
      await sendEmailVerification(firebaseUser);

      toast({
        title: "Success",
        description: "Verification email sent. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setSendingVerification(false);
    }
  };
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);

      const toTimestamp = (value?: string) =>
        value ? Timestamp.fromDate(new Date(value)) : null;

      // Writes the user's own Firestore doc via AuthContext (success/error toasts included)
      await updateUserProfile({
        name: data.name,
        bio: data.bio || null,
        phone: data.phone || null,
        address: data.address || null,
        gender: data.gender || null,
        dateOfBirth: toTimestamp(data.dateOfBirth),
        occupation: data.occupation || null,
        maritalStatus: data.maritalStatus || null,
        anniversary: toTimestamp(data.anniversary),
        joinedChurchDate: toTimestamp(data.joinedChurchDate),
        emergencyContact: data.emergencyContact || null,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
      </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you on the site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6">                    <div className="flex flex-col items-center space-y-4">
                      <ProfileImageUpload 
                        initialImage={profile?.image || ""}
                        onChange={handleImageUpdate}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us a little about yourself"
                                className="resize-none min-h-[100px]"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Your address" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="Your occupation" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ""}
                            >
                              <option value="">Select Status</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="divorced">Divorced</option>
                              <option value="widowed">Widowed</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="anniversary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anniversary Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="joinedChurchDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When did you join the church?</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Name and phone number" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="mt-6">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{profile?.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Role</div>
                      <div className="text-sm text-muted-foreground capitalize">{profile?.role.toLowerCase()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CalendarClock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Member Since</div>
                      <div className="text-sm text-muted-foreground">
                        {profile ? formatDate(profile.createdAt) : "-"}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium">Account Security</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/auth/forgot-password">Change Password</Link>
                    </Button>                    {!profile?.emailVerified && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2" 
                        onClick={handleSendVerificationEmail}
                        disabled={sendingVerification}
                      >
                        {sendingVerification ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Verify Email"
                        )}
                      </Button>
                    )}
                  </div>
                </div>              </div>
            </CardContent>
          </Card>
        </TabsContent>
          <TabsContent value="settings">
          <UserSettings 
            initialSettings={profile ? {
              notificationPrefs: profile.notificationPrefs as any,
              theme: profile.theme as any,
              privacySettings: profile.privacySettings as any,
            } : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
