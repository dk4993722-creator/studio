
"use client";

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
import { ArrowLeft, Edit, LogOut, Trash2 } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Badge } from "@/components/ui/badge";

const mockUsers = [
  { id: 'YUNEX12345', sponsorId: 'YUNEXSP001', name: 'Sanjay Kumar', email: 'sanjay@example.com', role: 'Associate', status: 'Active' },
  { id: 'YUNEX54321', sponsorId: 'YUNEXSP002', name: 'Priya Sharma', email: 'priya@example.com', role: 'Dealer', status: 'Active' },
  { id: 'YUNEX67890', sponsorId: 'YUNEXSP001', name: 'Amit Singh', email: 'amit@example.com', role: 'Associate', status: 'Inactive' },
  { id: 'YUNEX09876', sponsorId: 'YUNEXSP003', name: 'Deepika Rao', email: 'deepika@example.com', role: 'Associate', status: 'Active' },
  { id: 'YUNEX11223', sponsorId: 'YUNEXSP002', name: 'Rohan Gupta', email: 'rohan@example.com', role: 'Dealer', status: 'Pending' },
];


export default function AdminUsersPage() {
  const router = useRouter();

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
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Sponsor ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.sponsorId}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User: {user.name}</DialogTitle>
                            <DialogDescription>
                              This functionality is for demonstration purposes and is not yet implemented.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                              <Button variant="destructive">Delete</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
