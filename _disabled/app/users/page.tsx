"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, User, FilterX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  bio: string | null;
  occupation: string | null;
}

export default function UsersDirectoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/directory");
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load church directory",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchUsers();
    }
  }, [user, toast]);
  
  // Filter users based on search term and role filter
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = 
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (user.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) || "");
        
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);
  
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!loading && !user) {
    router.push("/auth/signin");
    return null;
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
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Church Directory</h1>
        <p className="text-muted-foreground">
          Connect with other members of our church community
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, bio, or occupation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Members</SelectItem>
                  <SelectItem value="PASTOR">Pastors</SelectItem>
                  <SelectItem value="LEADER">Leaders</SelectItem>
                  <SelectItem value="MEMBER">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <FilterX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No church members matching your search criteria were found.
              </p>
              {(searchTerm || roleFilter !== "ALL") && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("ALL");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Link 
                  href={`/users/${user.id}`} 
                  key={user.id}
                  className="block"
                >
                  <Card className="h-full hover:bg-accent/10 transition-colors cursor-pointer">
                    <CardContent className="p-5 flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-20 w-20 mt-4">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>
                          {user.name ? user.name[0].toUpperCase() : <User className="h-6 w-6" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <h3 className="font-medium text-lg">{user.name || "Unnamed Member"}</h3>
                        
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {formatRole(user.role)}
                        </Badge>
                        
                        {user.occupation && (
                          <p className="text-sm text-muted-foreground">{user.occupation}</p>
                        )}
                        
                        {user.bio && (
                          <p className="text-sm line-clamp-2 mt-2">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
