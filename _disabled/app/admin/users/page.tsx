"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { canManageUsers, isSuperAdmin } from "@/lib/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, MoreHorizontal, UserPlus, Mail, AlertTriangle, ChevronDown, Check, User, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

// Schema for creating/editing user
const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["SUPERADMIN", "ADMIN", "PASTOR", "LEADER", "MEMBER"]),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  // Form for editing/creating users
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "MEMBER",
    },
  });

  // Check if user has admin access
  useEffect(() => {
    if (user && !canManageUsers(user.role)) {
      router.push("/dashboard");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [user, router, toast]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users");

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
          description: "Failed to load users",
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
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [users, searchTerm, roleFilter]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle edit user
  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    form.reset({
      name: user.name || "",
      email: user.email,
      role: user.role as any,
    });
    setIsEditDialogOpen(true);
  };

  // Handle new user
  const handleNewUser = () => {
    setSelectedUser(null);
    form.reset({
      name: "",
      email: "",
      role: "MEMBER",
      password: "",
    });
    setIsNewUserDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle submit for edit/create user
  const onSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        // Update existing user
        const response = await fetch(`/api/users/${selectedUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        const updatedUser = await response.json();

        // Update users state
        setUsers(users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ));

        toast({
          title: "Success",
          description: "User updated successfully",
        });

        setIsEditDialogOpen(false);
      } else {
        // Create new user
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const newUser = await response.json();

        // Update users state
        setUsers([...users, newUser]);

        toast({
          title: "Success",
          description: "User created successfully",
        });

        setIsNewUserDialogOpen(false);
      }
    } catch (error) {
      console.error("Error submitting user form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process user",
        variant: "destructive",
      });
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Update users state
      setUsers(users.filter(user => user.id !== selectedUser.id));

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedUserIds.length === currentItems.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(currentItems.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;

    try {
      setIsBulkActionLoading(true);

      const response = await fetch("/api/users/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete users");
      }

      // Update users state
      setUsers(users.filter(user => !selectedUserIds.includes(user.id)));

      toast({
        title: "Success",
        description: `${selectedUserIds.length} users deleted successfully`,
      });

      setSelectedUserIds([]);
    } catch (error) {
      console.error("Error performing bulk delete:", error);
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  // Handle bulk role update
  const handleBulkRoleUpdate = async (role: string) => {
    if (selectedUserIds.length === 0) return;

    try {
      setIsBulkActionLoading(true);

      const response = await fetch("/api/users/bulk", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedUserIds,
          data: { role }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update users");
      }

      // Update users state
      const updatedUsers = await response.json();
      setUsers(users.map(user => {
        const updatedUser = updatedUsers.find((u: UserType) => u.id === user.id);
        return updatedUser || user;
      }));

      toast({
        title: "Success",
        description: `${selectedUserIds.length} users updated to ${role.toLowerCase()} role`,
      });

      setSelectedUserIds([]);
    } catch (error) {
      console.error("Error performing bulk role update:", error);
      toast({
        title: "Error",
        description: "Failed to update user roles",
        variant: "destructive",
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  // Handle send verification email
  const handleSendVerification = async (userId: string) => {
    try {
      const response = await fetch("/api/users/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }

      toast({
        title: "Success",
        description: "Verification email sent successfully",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
    }
  };

  // Generate pagination items
  const paginationItems = [];

  for (let i = 1; i <= totalPages; i++) {
    // Show first page, last page, current page, and pages +/- 1 from current
    if (
      i === 1 ||
      i === totalPages ||
      i === currentPage ||
      i === currentPage - 1 ||
      i === currentPage + 1
    ) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    } else if (
      (i === currentPage - 2 && currentPage > 3) ||
      (i === currentPage + 2 && currentPage < totalPages - 2)
    ) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role badge colors
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
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage church members, leaders, and staff accounts
          </p>
        </div>
        <Button onClick={handleNewUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PASTOR">Pastor</SelectItem>
                  <SelectItem value="LEADER">Leader</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>

              {selectedUserIds.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      {selectedUserIds.length} users selected
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkRoleUpdate("MEMBER")}>
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleUpdate("LEADER")}>
                      Set as Leader
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleUpdate("PASTOR")}>
                      Set as Pastor
                    </DropdownMenuItem>
                    {isSuperAdmin(user?.role) && (
                      <DropdownMenuItem onClick={() => handleBulkRoleUpdate("ADMIN")}>
                        Set as Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={handleBulkDelete}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        currentItems.length > 0 &&
                        selectedUserIds.length === currentItems.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                          aria-label={`Select ${user.name || user.email}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.image || ""} alt={user.name || ""} />
                            <AvatarFallback>
                              {user.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name || "Unnamed User"}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="text-sm">Unverified</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              Edit user
                            </DropdownMenuItem>
                            {!user.emailVerified && (
                              <DropdownMenuItem onClick={() => handleSendVerification(user.id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send verification
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete user
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

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>                <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9"
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
                {paginationItems}                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9"
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="User's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="LEADER">Leader</SelectItem>
                        <SelectItem value="PASTOR">Pastor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        {isSuperAdmin(user?.role) && (
                          <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="User's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      At least 8 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="LEADER">Leader</SelectItem>
                        <SelectItem value="PASTOR">Pastor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        {isSuperAdmin(user?.role) && (
                          <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name || selectedUser?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
