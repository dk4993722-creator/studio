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
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const initialStockData = [
  { sNo: 1, eVehicle: 'Yunex-X1', chassisNo: 'YX1A0001', price: 75000, openingStock: 150, sales: 15, closingStock: 135, date: '2024-07-29' },
  { sNo: 2, eVehicle: 'Yunex-S1', chassisNo: 'YS1A0001', price: 68000, openingStock: 100, sales: 20, closingStock: 80, date: '2024-07-29' },
  { sNo: 3, eVehicle: 'Yunex-X2', chassisNo: 'YX2A0001', price: 82000, openingStock: 120, sales: 10, closingStock: 110, date: '2024-07-30' },
  { sNo: 4, eVehicle: 'Yunex-X3', chassisNo: 'YX3A0001', price: 79000, openingStock: 75, sales: 5, closingStock: 70, date: '2024-07-31' },
];

const addStockSchema = z.object({
  eVehicle: z.string().min(1, "E. Vehicle name is required."),
  chassisNo: z.string().min(1, "Chassis number is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  openingStock: z.coerce.number().min(0, "Opening stock cannot be negative."),
  addQty: z.coerce.number().min(1, "Quantity to add must be at least 1."),
});

export default function EVehicleStockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stockData, setStockData] = useState(initialStockData);
  const [eVehicleFilter, setEVehicleFilter] = useState("");

  useEffect(() => {
    try {
      const storedStock = localStorage.getItem('yunex-admin-vehicle-stock');
      if (storedStock) {
        setStockData(JSON.parse(storedStock));
      } else {
        localStorage.setItem('yunex-admin-vehicle-stock', JSON.stringify(initialStockData));
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

  const form = useForm<z.infer<typeof addStockSchema>>({
    resolver: zodResolver(addStockSchema),
    defaultValues: {
      eVehicle: "",
      chassisNo: "",
      price: 0,
      openingStock: 0,
      addQty: 0,
    },
  });

  const { watch, setValue } = form;
  const openingStock = watch("openingStock");
  const addQty = watch("addQty");
  const watchedEVehicle = watch("eVehicle");
  
  const calculatedClosingStock = Number(openingStock || 0) + Number(addQty || 0);
  const closingStock = isNaN(calculatedClosingStock) ? (Number(openingStock) || 0) : calculatedClosingStock;

  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (watchedEVehicle) {
        const latestEntry = stockData
            .filter(item => item.eVehicle.toLowerCase() === watchedEVehicle.toLowerCase())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        if (latestEntry) {
            setValue("openingStock", latestEntry.closingStock);
        } else {
            setValue("openingStock", 0);
        }
    }
  }, [watchedEVehicle, stockData, setValue]);

  function onSubmit(values: z.infer<typeof addStockSchema>) {
    if (stockData.some(item => item.chassisNo === values.chassisNo)) {
        form.setError("chassisNo", { type: "manual", message: "Chassis number must be unique." });
        return;
    }

    const newEntry = {
      sNo: stockData.length > 0 ? Math.max(...stockData.map(item => item.sNo)) + 1 : 1,
      eVehicle: values.eVehicle,
      chassisNo: values.chassisNo,
      price: values.price,
      openingStock: values.openingStock,
      sales: 0,
      closingStock: values.openingStock + values.addQty,
      date: new Date().toISOString().split('T')[0],
    };
    
    const updatedStock = [newEntry, ...stockData];
    setStockData(updatedStock);
    
    try {
      localStorage.setItem('yunex-admin-vehicle-stock', JSON.stringify(updatedStock));
    } catch (error) {
       console.error("Failed to save stock to localStorage", error);
       toast({
        variant: "destructive",
        title: "Save Error",
        description: "Could not save the new stock entry.",
      });
    }

    toast({
      title: "Stock Added",
      description: "The vehicle stock transaction has been updated.",
    });
    form.reset({ eVehicle: "", chassisNo: "", price: 0, openingStock: 0, addQty: 0 });
  }

  const handleDelete = (sNo: number) => {
    const updatedStock = stockData.filter(item => item.sNo !== sNo);
    setStockData(updatedStock);
    try {
      localStorage.setItem('yunex-admin-vehicle-stock', JSON.stringify(updatedStock));
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">E. Vehicle Stock</h2>
        </div>

        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Warehouse className="h-6 w-6" />
                        <span>Manage E. Vehicle Stock</span>
                    </CardTitle>
                    <CardDescription>
                    A log of all vehicle inventory transactions for the company.
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
                      <TableHead>E. Vehicle</TableHead>
                      <TableHead>Chassis No.</TableHead>
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
                          <TableCell className="font-medium">{item.eVehicle}</TableCell>
                          <TableCell>{item.chassisNo}</TableCell>
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
                          No stock data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Add Stock Transaction</CardTitle>
            <CardDescription>Fill out the form to submit a new stock transaction.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
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
                      name="chassisNo"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Chassis No.</FormLabel>
                          <FormControl><Input {...field} placeholder="Unique chassis number" /></FormControl>
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
                          <FormControl><Input type="number" {...field} disabled /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="addQty"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Add E. Vehicle</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="lg:col-span-1">
                        <FormLabel>Closing Stock</FormLabel>
                        <Input value={closingStock < 0 ? 0 : closingStock} disabled />
                    </div>
                    <div className="lg:col-span-1">
                        <FormLabel>Date</FormLabel>
                        <Input value={currentDate} disabled />
                    </div>
                </div>
                 <Button type="submit" className="w-full md:w-auto">Submit Transaction</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
