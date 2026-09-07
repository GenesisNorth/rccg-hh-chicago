"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Phone, MapPin, Calendar, Briefcase, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface UserProfileViewProps {
  userId: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
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
  privacySettings: {
    profileVisibility: "public" | "members" | "private";
    showEmail: boolean;
    showPhone: boolean;
    showBirthday: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export function UserProfileView({ userId }: UserProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to view this profile");
          } else {
            throw new Error("Failed to load profile");
          }
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsError(true);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchProfile();
    }
  }, [userId, toast]);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Profile Not Available</h2>
        <p className="text-muted-foreground max-w-md">
          This profile could not be loaded. It may be private or no longer exists.
        </p>
      </div>
    );
  }
  
  // Format role for display
  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };
  
  // Get badge variant based on role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "destructive";
      case "ADMIN":
        return "default";
      case "PASTOR":
        return "secondary";
      case "LEADER":
        return "outline";
      default:
        return "secondary";
    }
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
              <AvatarFallback className="text-2xl">
                {profile.name ? profile.name[0].toUpperCase() : <User className="h-12 w-12" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.name || "Unnamed Member"}</h2>
                <Badge className="self-center sm:self-auto" variant={getRoleBadgeVariant(profile.role)}>
                  {formatRole(profile.role)}
                </Badge>
              </div>
              
              {profile.bio && (
                <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                {profile.privacySettings?.showEmail !== false && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
                
                {profile.phone && profile.privacySettings?.showPhone !== false && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                {profile.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {profile.address && (
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Address</h3>
                <p className="text-muted-foreground">{profile.address}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.dateOfBirth && profile.privacySettings?.showBirthday !== false && (
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Birthday</h3>
                  <p className="text-muted-foreground">{formatDate(profile.dateOfBirth)}</p>
                </div>
              </div>
            )}
            
            {profile.maritalStatus && (
              <div className="flex items-start gap-2">
                <Heart className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Marital Status</h3>
                  <p className="text-muted-foreground">
                    {profile.maritalStatus.charAt(0).toUpperCase() + profile.maritalStatus.slice(1)}
                    {profile.anniversary && ` (Anniversary: ${formatDate(profile.anniversary)})`}
                  </p>
                </div>
              </div>
            )}
            
            {profile.joinedChurchDate && (
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Joined Church</h3>
                  <p className="text-muted-foreground">{formatDate(profile.joinedChurchDate)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
