
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit, LogOut, Trash2, Eye, EyeOff, PlusCircle } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
    id: string;
    sponsorId: string;
    name: string;
    email: string;
    mobile: string;
    role: 'Associate' | 'Dealer';
    status: 'Active' | 'Inactive' | 'Pending';
    password: string;
    isAdminCreated?: boolean;
};

const mockUsersData: User[] = [
  { id: 'YNX26A0001', sponsorId: 'YUNEX_SP', name: 'Yunex', email: 'yunex@example.com', mobile: '9876543210', role: 'Dealer', status: 'Active', password: 'password123' },
  { id: 'YNX26A0002', sponsorId: 'YNX26A0001', name: 'Ram', email: 'ram@example.com', mobile: '9876543211', role: 'Associate', status: 'Active', password: 'password123' },
  { id: 'YNX26A0003', sponsorId: 'YNX26A0001', name: 'Shiu', email: 'shiu@example.com', mobile: '9876543212', role: 'Associate', status: 'Active', password: 'password123' },
  { id: 'YNX26A0004', sponsorId: 'YNX26A0001', name: 'Krishna', email: 'krishna@example.com', mobile: '9876543213', role: 'Associate', status: 'Active', password: 'password123' },
];

const userSchema = z.object({
  id: z.string().min(1, "User ID is required."),
  sponsorId: z.string().min(1, "Sponsor ID is required."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["Associate", "Dealer"]),
  status: z.enum(["Active", "Inactive", "Pending"]),
});

const editUserSchema = userSchema.partial().extend({
  password: userSchema.shape.password.optional().or(z.literal('')),
});


export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('yunex-users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        localStorage.setItem('yunex-users', JSON.stringify(mockUsersData));
        setUsers(mockUsersData);
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
      setUsers(mockUsersData);
    }
  }, []);

  const addUserForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: "",
      sponsorId: "",
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "Associate",
      status: "Pending",
    },
  });

  const editForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
  });

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      password: "",
    });
    setIsEditDialogOpen(true);
  };
  
  const onAddUserSubmit = (values: z.infer<typeof userSchema>) => {
    if (users.some(u => u.id.toLowerCase() === values.id.toLowerCase())) {
        addUserForm.setError("id", {
            type: "manual",
            message: "User ID must be unique."
        });
        return;
    }
    const newUser: User = { ...values, isAdminCreated: true };
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    localStorage.setItem('yunex-users', JSON.stringify(updatedUsers));
    toast({
      title: "User Added",
      description: `User "${values.name}" has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    addUserForm.reset();
  };

  const onEditSubmit = (values: z.infer<typeof editUserSchema>) => {
    if (!editingUser) return;
    const updatedUsers = users.map(u => 
      u.id === editingUser.id 
        ? { 
            ...u, 
            ...values,
            password: values.password ? values.password : u.password
          } 
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('yunex-users', JSON.stringify(updatedUsers));
    toast({
      title: "User Updated",
      description: `User "${values.name || editingUser.name}" has been updated.`,
    });
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete?.isAdminCreated) {
        toast({
            title: "Deletion Prevented",
            description: "Users created by an admin cannot be deleted from this interface.",
            variant: "destructive",
        });
        return;
    }
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('yunex-users', JSON.stringify(updatedUsers));
    toast({
      title: "User Deleted",
      description: "The user has been successfully deleted.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Admin</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={placeholderImages.placeholderImages[0].imageUrl}
              alt="Admin avatar"
              data-ai-hint={placeholderImages.placeholderImages[0].imageHint}
            />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">User Management</h2>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all users in the system.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new user.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...addUserForm}>
                        <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="grid grid-cols-2 gap-4">
                             <FormField control={addUserForm.control} name="id" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>User ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={addUserForm.control} name="sponsorId" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Sponsor ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={addUserForm.control} name="name" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={addUserForm.control} name="email" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={addUserForm.control} name="mobile" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Mobile No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField
                                control={addUserForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                      <FormControl>
                                        <Input
                                          type={showAddPassword ? "text" : "password"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                        onClick={() => setShowAddPassword(!showAddPassword)}
                                      >
                                        {showAddPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                             <FormField control={addUserForm.control} name="role" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Associate">Associate</SelectItem><SelectItem value="Dealer">Dealer</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                             <FormField control={addUserForm.control} name="status" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                            <DialogFooter className="col-span-2">
                                <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Create User</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S. No.</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Sponsor ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile No.</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                    users.map((user, index) => (
                    <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.sponsorId}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>
                        <div className="flex items-center gap-2">
                            <span>
                            {visiblePasswords.has(user.id) ? user.password : '••••••••'}
                            </span>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => togglePasswordVisibility(user.id)}
                            >
                            {visiblePasswords.has(user.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                        <Badge
                            variant={user.status === 'Active' ? 'default' : user.status === 'Inactive' ? 'destructive' : 'secondary'}
                            className={user.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/40' : user.status === 'Inactive' ? 'bg-red-500/20 text-red-700 border-red-500/40' : ''}
                        >
                            {user.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete User: {user.name}?</DialogTitle>
                                <DialogDescription>
                                This action cannot be undone. Are you sure you want to permanently delete this user?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                </DialogClose>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={10} className="text-center">
                            No users found. Click 'Add User' to create one.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User: {editingUser?.name}</DialogTitle>
              <DialogDescription>
                Update the user's details below.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="name" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={editForm.control} name="email" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                 <FormField control={editForm.control} name="mobile" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Mobile No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField
                  control={editForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showEditPassword ? "text" : "password"}
                            placeholder="Leave blank to keep current"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowEditPassword(!showEditPassword)}
                        >
                          {showEditPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={editForm.control} name="role" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Associate">Associate</SelectItem><SelectItem value="Dealer">Dealer</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField control={editForm.control} name="status" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                <DialogFooter className="col-span-2">
                  <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
