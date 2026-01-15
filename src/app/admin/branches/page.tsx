
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LogOut, Building2, Edit, Trash2, PlusCircle } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
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

const mockBranches = [
  { id: '01', district: 'Deoghar', branchCode: 'Yunex202601' },
  { id: '02', district: 'Dumka', branchCode: 'Yunex202602' },
  { id: '03', district: 'Bokaro', branchCode: 'Yunex202603' },
  { id: '04', district: 'Giridih', branchCode: 'Yunex202604' },
  { id: '05', district: 'Koderma', branchCode: 'Yunex202605' },
  { id: '06', district: 'Godda', branchCode: 'Yunex202606' },
  { id: '07', district: 'Chatra', branchCode: 'Yunex202607' },
  { id: '08', district: 'Dhanbad', branchCode: 'Yunex202608' },
  { id: '09', district: 'Garhwa', branchCode: 'Yunex202609' },
  { id: '10', district: 'East-Singhbhum', branchCode: 'Yunex202610' },
  { id: '11', district: 'Jamtara', branchCode: 'Yunex202611' },
  { id: '12', district: 'Saraikela-Kharsawan', branchCode: 'Yunex202612' },
  { id: '13', district: 'Ranchi', branchCode: 'Yunex202613' },
  { id: '14', district: 'Pakur', branchCode: 'Yunex202614' },
  { id: '15', district: 'Latehar', branchCode: 'Yunex202615' },
  { id: '16', district: 'Hazaribagh', branchCode: 'Yunex202616' },
  { id: '17', district: 'Lohardaga', branchCode: 'Yunex202617' },
  { id: '18', district: 'Palamu', branchCode: 'Yunex202618' },
  { id: '19', district: 'Ramghar', branchCode: 'Yunex202619' },
  { id: '20', district: 'Simdega', branchCode: 'Yunex202620' },
  { id: '21', district: 'West-Singhbhum', branchCode: 'Yunex202621' },
  { id: '22', district: 'Sahebganj', branchCode: 'Yunex202622' },
  { id: '23', district: 'Gumla', branchCode: 'Yunex202623' },
  { id: '24', district: 'Khunti', branchCode: 'Yunex202624' },
];

export default function BranchDetailsPage() {
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Branch Details</h2>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        <span>Manage Branches</span>
                    </CardTitle>
                    <CardDescription>Add, edit, or remove branch details from this panel.</CardDescription>
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                       <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add New Branch
                       </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add New Branch</DialogTitle>
                        <DialogDescription>
                            This functionality is for demonstration purposes and is not yet implemented.
                        </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">S. No.</TableHead>
                      <TableHead>District (Branch)</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBranches.map(branch => (
                      <TableRow key={branch.id}>
                        <TableCell>{branch.id}</TableCell>
                        <TableCell className="font-medium">{branch.district}</TableCell>
                        <TableCell>{branch.branchCode}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Branch: {branch.district}</DialogTitle>
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
                                <DialogTitle>Delete Branch: {branch.district}?</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. Are you sure you want to permanently delete this branch?
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
