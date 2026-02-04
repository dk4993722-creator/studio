"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialBranches = [
  { id: '01', district: 'Deoghar', branchName: 'Deoghar Main', address: '123 Test St, Deoghar', gstNo: '20AAAAA0000A1Z5', branchCode: 'Yunex202601', pin: '123456' },
  { id: '25', district: 'Deoghar', branchName: 'Baidyanathdham', address: '456 Temple Rd, Deoghar', gstNo: '20AAAAA0000A1Z6', branchCode: 'Yunex202625', pin: '123457' },
  { id: '26', district: 'Deoghar', branchName: 'Satsang Nagar', address: '789 Ashram Ave, Deoghar', gstNo: '20AAAAA0000A1Z7', branchCode: 'Yunex202626', pin: '123458' },
  { id: '02', district: 'Dumka', branchName: 'Dumka Central', address: '456 Sample Ave, Dumka', gstNo: '20BBBBB1111B1Z4', branchCode: 'Yunex202602', pin: '234567' },
  { id: '03', district: 'Bokaro', branchName: 'Bokaro Steel City', address: '789 Demo Rd, Bokaro', gstNo: '20CCCCC2222C1Z3', branchCode: 'Yunex202603', pin: '345678' },
  { id: '04', district: 'Giridih', branchName: 'Giridih Town', address: '101 Example Blvd, Giridih', gstNo: '20DDDDD3333D1Z2', branchCode: 'Yunex202604', pin: '456789' },
  { id: '05', district: 'Koderma', branchName: 'Koderma Station', address: '212 Fake St, Koderma', gstNo: '20EEEEE4444E1Z1', branchCode: 'Yunex202605', pin: '567890' },
  { id: '06', district: 'Godda', branchName: 'Godda Market', address: '333 Placeholder Ln, Godda', gstNo: '', branchCode: 'Yunex202606', pin: '678901' },
  { id: '07', district: 'Chatra', branchName: 'Chatra Chowk', address: '444 Dev Dr, Chatra', gstNo: '', branchCode: 'Yunex202607', pin: '789012' },
  { id: '08', district: 'Dhanbad', branchName: 'Dhanbad City', address: '555 Code Cres, Dhanbad', gstNo: '20HHHHH8888H1Z8', branchCode: 'Yunex202608', pin: '890123' },
  { id: '27', district: 'Dhanbad', branchName: 'Bank More', address: '111 Bank St, Dhanbad', gstNo: '20HHHHH8888H1Z9', branchCode: 'Yunex202627', pin: '890124' },
  { id: '28', district: 'Dhanbad', branchName: 'Jharia', address: '222 Coal Rd, Jharia', gstNo: '20HHHHH8888H1Z0', branchCode: 'Yunex202628', pin: '890125' },
  { id: '29', district: 'Dhanbad', branchName: 'Govindpur', address: '333 Govindpur St, Dhanbad', gstNo: '20HHHHH8888H1Z1', branchCode: 'Yunex202629', pin: '890126' },
  { id: '09', district: 'Garhwa', branchName: 'Garhwa Road', address: '666 Script St, Garhwa', gstNo: '', branchCode: 'Yunex202609', pin: '901234' },
  { id: '10', district: 'East-Singhbhum', branchName: 'Jamshedpur', address: '777 HTML Hwy, East-Singhbhum', gstNo: '20JJJJJ0000J1Z6', branchCode: 'Yunex202610', pin: '012345' },
  { id: '11', district: 'Jamtara', branchName: 'Jamtara Cyber', address: '888 CSS Ct, Jamtara', gstNo: '', branchCode: 'Yunex202611', pin: '112233' },
  { id: '12', district: 'Saraikela-Kharsawan', branchName: 'Saraikela Town', address: '999 JS St, Saraikela', gstNo: '', branchCode: 'Yunex202612', pin: '223344' },
  { id: '13', district: 'Ranchi', branchName: 'Ranchi Capital', address: '121 React Rd, Ranchi', gstNo: '20MMMMM3333M1Z3', branchCode: 'Yunex202613', pin: '334455' },
  { id: '30', district: 'Ranchi', branchName: 'Kanke Road', address: '454 Kanke Road, Ranchi', gstNo: '20MMMMM3333M1Z4', branchCode: 'Yunex202630', pin: '334456' },
  { id: '14', district: 'Pakur', branchName: 'Pakur Border', address: '232 Next Ave, Pakur', gstNo: '', branchCode: 'Yunex202614', pin: '445566' },
  { id: '15', district: 'Latehar', branchName: 'Latehar Hills', address: '343 TS St, Latehar', gstNo: '', branchCode: 'Yunex202615', pin: '556677' },
  { id: '16', district: 'Hazaribagh', branchName: 'Hazaribagh National Park', address: '454 Node St, Hazaribagh', gstNo: '20QQQQQ7777Q1Z9', branchCode: 'Yunex202616', pin: '667788' },
  { id: '17', district: 'Lohardaga', branchName: 'Lohardaga Mines', address: '565 API Ave, Lohardaga', gstNo: '', branchCode: 'Yunex202617', pin: '778899' },
  { id: '18', district: 'Palamu', branchName: 'Palamu Fort', address: '676 JSON Jct, Palamu', gstNo: '', branchCode: 'Yunex202618', pin: '889900' },
  { id: '19', district: 'Ramghar', branchName: 'Ramghar Cantt', address: '787 XML Xing, Ramghar', gstNo: '', branchCode: 'Yunex202619', pin: '990011' },
  { id: '20', district: 'Simdega', branchName: 'Simdega Hockey', address: '898 Component Ct, Simdega', gstNo: '', branchCode: 'Yunex202620', pin: '001122' },
  { id: '21', district: 'West-Singhbhum', branchName: 'Chaibasa', address: '909 Prop Pl, West-Singhbhum', gstNo: '', branchCode: 'Yunex202621', pin: '112233' },
  { id: '22', district: 'Sahebganj', branchName: 'Sahebganj Ganga', address: '111 State St, Sahebganj', gstNo: '', branchCode: 'Yunex202622', pin: '223344' },
  { id: '23', district: 'Gumla', branchName: 'Gumla Hills', address: '222 Hook Hbr, Gumla', gstNo: '', branchCode: 'Yunex202623', pin: '334455' },
  { id: '24', district: 'Khunti', branchName: 'Khunti Birsa', address: '333 Effect Espl, Khunti', gstNo: '', branchCode: 'Yunex202624', pin: '445566' },
];

const branchSchema = z.object({
  district: z.string().min(1, "District is required."),
  branchName: z.string().min(1, "Branch name is required."),
  address: z.string().min(1, "Address is required."),
  gstNo: z.string().optional(),
  branchCode: z.string().min(1, "Branch code is required."),
  pin: z.string().length(6, "PIN must be 6 digits."),
});

type Branch = typeof initialBranches[0];

export default function BranchDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKey, setFilterKey] = useState<keyof Branch>("branchName");

  useEffect(() => {
    try {
      const storedBranches = localStorage.getItem('yunex-branches');
      if (storedBranches) {
        setBranches(JSON.parse(storedBranches));
      } else {
        localStorage.setItem('yunex-branches', JSON.stringify(initialBranches));
        setBranches(initialBranches);
      }
    } catch (error) {
      console.error("Failed to load branches from localStorage", error);
      setBranches(initialBranches);
    }
  }, []);

  const filterLabels: { [key in keyof Branch]?: string } = {
    district: "District",
    branchCode: "Branch Code",
    branchName: "Branch Name",
    pin: "Pin Code",
  };

  const form = useForm<z.infer<typeof branchSchema>>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      district: "",
      branchName: "",
      address: "",
      gstNo: "",
      branchCode: "",
      pin: "",
    },
  });

  function onSubmit(values: z.infer<typeof branchSchema>) {
    if (branches.some(branch => branch.branchCode.toLowerCase() === values.branchCode.toLowerCase())) {
      form.setError("branchCode", {
        type: "manual",
        message: "Branch code must be unique."
      });
      return;
    }
    const newId = (branches.length + 1).toString().padStart(2, '0');
    const newBranch = { id: newId, ...values };
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    localStorage.setItem('yunex-branches', JSON.stringify(updatedBranches));
    toast({
      title: "Branch Added",
      description: `Branch "${values.branchName}" has been successfully added.`,
    });
    form.reset();
    setIsAddDialogOpen(false);
  }

  const filteredBranches = branches.filter(branch => {
    if (!searchQuery) return true;
    const value = branch[filterKey];
    return value.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        <span>Manage Branches</span>
                    </CardTitle>
                    <CardDescription>Add, edit, or remove branch details from this panel.</CardDescription>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                    <Select value={filterKey} onValueChange={(value) => setFilterKey(value as keyof Branch)}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Filter by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="district">District</SelectItem>
                            <SelectItem value="branchCode">Branch Code</SelectItem>
                            <SelectItem value="branchName">Branch Name</SelectItem>
                            <SelectItem value="pin">Pin Code</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder={`Filter by ${filterLabels[filterKey]}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:max-w-xs"
                    />
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                           <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add Branch
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                            <DialogTitle>Add New Branch</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the new branch.
                            </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="district"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>District</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Deoghar" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="branchName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Branch Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Deoghar Main" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="address"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                      <FormLabel>Address</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 123 Main St, Deoghar" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                 <FormField
                                  control={form.control}
                                  name="gstNo"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>GST No. (Optional)</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 20AAAAA0000A1Z5" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="branchCode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Branch Code</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Yunex202625" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="pin"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>6-Digit Pin</FormLabel>
                                      <FormControl>
                                        <Input type="password" placeholder="••••••" {...field} maxLength={6} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter className="md:col-span-2">
                                  <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit">Save Branch</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">S. No.</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Branch Name</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>GST. No.</TableHead>
                      <TableHead>6-Digit Pin</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBranches.map(branch => (
                      <TableRow key={branch.id}>
                        <TableCell>{branch.id}</TableCell>
                        <TableCell>{branch.district}</TableCell>
                        <TableCell className="font-medium">{branch.branchName}</TableCell>
                        <TableCell>{branch.branchCode}</TableCell>
                        <TableCell>{branch.address}</TableCell>
                        <TableCell>{branch.gstNo}</TableCell>
                        <TableCell>{'••••••'}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Branch: {branch.branchName}</DialogTitle>
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
                                <DialogTitle>Delete Branch: {branch.branchName}?</DialogTitle>
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
