"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ArrowLeft, LogOut, Warehouse, Edit, Trash2 } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

const initialStockData = [
  // Day 1: 2024-07-29
  { sNo: 1, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', price: 75000, openingStock: 50, sales: 5, closingStock: 45, date: '2024-07-29' },
  { sNo: 2, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', price: 68000, openingStock: 30, sales: 10, closingStock: 20, date: '2024-07-29' },
  { sNo: 3, branchCode: 'Yunex202601', eVehicle: 'Yunex-X2', price: 82000, openingStock: 40, sales: 0, closingStock: 40, date: '2024-07-29' },
  { sNo: 4, branchCode: 'Yunex202603', eVehicle: 'Yunex-X3', price: 79000, openingStock: 25, sales: 3, closingStock: 22, date: '2024-07-29' },

  // Day 2: 2024-07-30
  { sNo: 5, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', price: 75000, openingStock: 45, sales: 2, closingStock: 43, date: '2024-07-30' },
  { sNo: 6, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', price: 68000, openingStock: 20, sales: 5, closingStock: 15, date: '2024-07-30' },
  { sNo: 7, branchCode: 'Yunex202601', eVehicle: 'Yunex-X2', price: 82000, openingStock: 40, sales: 1, closingStock: 39, date: '2024-07-30' },

  // Day 3: 2024-07-31
  { sNo: 8, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', price: 75000, openingStock: 43, sales: 3, closingStock: 40, date: '2024-07-31' },
  { sNo: 9, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', price: 68000, openingStock: 15, sales: 0, closingStock: 15, date: '2024-07-31' },
  { sNo: 10, branchCode: 'Yunex202603', eVehicle: 'Yunex-X3', price: 79000, openingStock: 22, sales: 2, closingStock: 20, date: '2024-07-31' },
];

const branches = [
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

const reportSchema = z.object({
  eVehicle: z.string().min(1, "E. Vehicle name is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  openingStock: z.coerce.number().min(0, "Opening stock cannot be negative."),
  sales: z.coerce.number().min(0, "Sales cannot be negative."),
}).refine(data => data.sales <= data.openingStock, {
  message: "Sales cannot be greater than opening stock.",
  path: ["sales"],
});

export default function VehicleStockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stockData, setStockData] = useState(initialStockData);
  const [currentBranch] = useState(branches[0].branchCode);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [eVehicleFilter, setEVehicleFilter] = useState("");
  
  const districts = [...new Set(branches.map((b) => b.district))];

  useEffect(() => {
    try {
      const storedStock = localStorage.getItem('yunex-vehicle-stock');
      if (storedStock) {
        setStockData(JSON.parse(storedStock));
      } else {
        localStorage.setItem('yunex-vehicle-stock', JSON.stringify(initialStockData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load stock history.",
      });
    }
  }, [toast]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      eVehicle: "",
      price: 0,
      openingStock: 0,
      sales: 0,
    },
  });

  const { watch } = form;
  const openingStock = watch("openingStock");
  const sales = watch("sales");
  const closingStock = openingStock - sales;
  const currentDate = new Date().toISOString().split('T')[0];

  function onSubmit(values: z.infer<typeof reportSchema>) {
    const newEntry = {
      sNo: stockData.length > 0 ? Math.max(...stockData.map(item => item.sNo)) + 1 : 1,
      branchCode: currentBranch,
      eVehicle: values.eVehicle,
      price: values.price,
      openingStock: values.openingStock,
      sales: values.sales,
      closingStock: values.openingStock - values.sales,
      date: new Date().toISOString().split('T')[0],
    };
    
    const updatedStock = [newEntry, ...stockData];
    setStockData(updatedStock);
    
    try {
      localStorage.setItem('yunex-vehicle-stock', JSON.stringify(updatedStock));
    } catch (error) {
       console.error("Failed to save stock to localStorage", error);
       toast({
        variant: "destructive",
        title: "Save Error",
        description: "Could not save the new stock entry.",
      });
    }

    toast({
      title: "Report Submitted",
      description: "The daily vehicle stock transaction has been updated.",
    });
    form.reset({ eVehicle: "", price: 0, openingStock: 0, sales: 0 });
  }

  const handleDelete = (sNo: number) => {
    const updatedStock = stockData.filter(item => item.sNo !== sNo);
    setStockData(updatedStock);
    try {
      localStorage.setItem('yunex-vehicle-stock', JSON.stringify(updatedStock));
      toast({
        title: "Transaction Deleted",
        description: "The vehicle stock transaction has been removed.",
      });
    } catch (error) {
       console.error("Failed to update localStorage", error);
       toast({
        variant: "destructive",
        title: "Delete Error",
        description: "Could not delete the stock entry.",
      });
    }
  };

  const filteredCompanyStock = stockData.filter(item => {
    const eVehicleMatch = eVehicleFilter ? item.eVehicle.toLowerCase().includes(eVehicleFilter.toLowerCase()) : true;
    return eVehicleMatch;
  });

  const filteredBranchStock = stockData.filter(item => {
    if (!selectedDistrict) return true;

    const branchCodesForDistrict = branches
        .filter(branch => branch.district === selectedDistrict)
        .map(branch => branch.branchCode);

    return branchCodesForDistrict.includes(item.branchCode);
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Vehicle Stock</h2>
        </div>

        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Warehouse className="h-6 w-6" />
                        <span>Company Vehicle Stock</span>
                    </CardTitle>
                    <CardDescription>
                    A log of all vehicle inventory transactions across all branches.
                    </CardDescription>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                    <Input 
                        placeholder="Filter by E. Vehicle..."
                        value={eVehicleFilter}
                        onChange={(e) => setEVehicleFilter(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S. No.</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead>E. Vehicle</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Opening Stock</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanyStock.length > 0 ? (
                      filteredCompanyStock.map((item) => (
                        <TableRow key={item.sNo}>
                          <TableCell>{item.sNo}</TableCell>
                          <TableCell>{item.branchCode}</TableCell>
                          <TableCell className="font-medium">{item.eVehicle}</TableCell>
                          <TableCell className="text-right">{item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'N/A'}</TableCell>
                          <TableCell className="text-right">{item.openingStock}</TableCell>
                          <TableCell className="text-right">{item.sales}</TableCell>
                          <TableCell className="text-right">{item.closingStock}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Transaction #{item.sNo}</DialogTitle>
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
                                  <DialogTitle>Delete Transaction #{item.sNo}?</DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. Are you sure you want to permanently delete this transaction?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                  </DialogClose>
                                   <DialogClose asChild>
                                    <Button variant="destructive" onClick={() => handleDelete(item.sNo)}>Delete</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No stock data found for the current filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Closing Daily Report Submit</CardTitle>
            <CardDescription>Fill out the form to submit the daily stock report.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="eVehicle"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>E. Vehicle</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Price</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="openingStock"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Opening Stock</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="sales"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Sales</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="lg:col-span-1">
                        <FormLabel>Closing</FormLabel>
                        <Input value={closingStock < 0 ? 0 : closingStock} disabled />
                    </div>
                    <div className="lg:col-span-1">
                        <FormLabel>Date</FormLabel>
                        <Input value={currentDate} disabled />
                    </div>
                </div>
                 <Button type="submit" className="w-full md:w-auto">Submit Report</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Branch Vehicle Stock</CardTitle>
                <CardDescription>Filter vehicle inventory by district.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <Select value={selectedDistrict} onValueChange={(value) => setSelectedDistrict(value === "all" ? "" : value)}>
                        <SelectTrigger className="w-full md:w-[280px]">
                            <SelectValue placeholder="Filter by District..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Districts</SelectItem>
                            {districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                    {district}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Separator className="mb-4" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S. No.</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead>E. Vehicle</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Opening Stock</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBranchStock.length > 0 ? (
                      filteredBranchStock.map((item) => (
                        <TableRow key={item.sNo}>
                          <TableCell>{item.sNo}</TableCell>
                          <TableCell>{item.branchCode}</TableCell>
                          <TableCell className="font-medium">{item.eVehicle}</TableCell>
                          <TableCell className="text-right">{item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'N/A'}</TableCell>
                          <TableCell className="text-right">{item.openingStock}</TableCell>
                          <TableCell className="text-right">{item.sales}</TableCell>
                          <TableCell className="text-right">{item.closingStock}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="text-right">
                             <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Transaction #{item.sNo}</DialogTitle>
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
                                  <DialogTitle>Delete Transaction #{item.sNo}?</DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. Are you sure you want to permanently delete this transaction?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                  </DialogClose>
                                   <DialogClose asChild>
                                    <Button variant="destructive" onClick={() => handleDelete(item.sNo)}>Delete</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No stock data found for the current filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}

    