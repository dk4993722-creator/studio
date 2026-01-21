
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
import { ArrowLeft, Phone, LogOut, Wrench, Eye, Download } from "lucide-react";
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialStockData = [
  { sNo: 1, branchCode: 'Yunex202601', sparePart: 'Brake Pad', partCode: 'BP-001', hsnCode: '8708', price: 550, openingStock: 200, sales: 20, closingStock: 180, date: '2024-07-30' },
  { sNo: 2, branchCode: 'Yunex202602', sparePart: 'Headlight', partCode: 'HL-001', hsnCode: '8512', price: 1200, openingStock: 100, sales: 5, closingStock: 95, date: '2024-07-30' },
  { sNo: 3, branchCode: 'Yunex202601', sparePart: 'Battery 48V', partCode: 'BT-48V', hsnCode: '8507', price: 15000, openingStock: 50, sales: 2, closingStock: 48, date: '2024-07-30' },
  { sNo: 4, branchCode: 'Yunex202603', sparePart: 'Tyre 10-inch', partCode: 'TY-10', hsnCode: '4011', price: 2500, openingStock: 150, sales: 10, closingStock: 140, date: '2024-07-30' },
];

const branches = [
  { id: '01', district: 'Deoghar', branchCode: 'Yunex202601' },
  { id: '02', district: 'Dumka', branchCode: 'Yunex202602' },
  { id: '03', district: 'Bokaro', branchCode: 'Yunex202603' },
];

const reportSchema = z.object({
  sparePart: z.string().min(1, "Spare part name is required."),
  partCode: z.string().min(1, "Part code is required."),
  hsnCode: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  openingStock: z.coerce.number().min(0, "Opening stock cannot be negative."),
  sales: z.coerce.number().min(0, "Sales cannot be negative."),
}).refine(data => data.sales <= data.openingStock, {
  message: "Sales cannot be greater than opening stock.",
  path: ["sales"],
});

type StockItem = typeof initialStockData[0];

export default function SparePartsStockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stockData, setStockData] = useState(initialStockData);
  const [currentBranch] = useState(branches[0].branchCode);
  const [sparePartFilter, setSparePartFilter] = useState("");
  
  useEffect(() => {
    try {
      const storedStock = localStorage.getItem('yunex-dealer-spareparts-stock');
      if (storedStock) {
        setStockData(JSON.parse(storedStock));
      } else {
        localStorage.setItem('yunex-dealer-spareparts-stock', JSON.stringify(initialStockData));
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
      sparePart: "",
      partCode: "",
      hsnCode: "",
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
    const newEntry: StockItem = {
      sNo: stockData.length > 0 ? Math.max(...stockData.map(item => item.sNo)) + 1 : 1,
      branchCode: currentBranch,
      sparePart: values.sparePart,
      partCode: values.partCode,
      hsnCode: values.hsnCode || "",
      price: values.price,
      openingStock: values.openingStock,
      sales: values.sales,
      closingStock: values.openingStock - values.sales,
      date: new Date().toISOString().split('T')[0],
    };
    
    const updatedStock = [newEntry, ...stockData];
    setStockData(updatedStock);
    
    try {
      localStorage.setItem('yunex-dealer-spareparts-stock', JSON.stringify(updatedStock));
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
      description: "The daily spare parts stock transaction has been updated.",
    });
    form.reset({ sparePart: "", partCode: "", hsnCode: "", price: 0, openingStock: 0, sales: 0 });
  }

  const myBranchStock = stockData.filter(item => {
    const branchMatch = item.branchCode === currentBranch;
    const sparePartMatch = sparePartFilter ? item.sparePart.toLowerCase().includes(sparePartFilter.toLowerCase()) : true;
    return branchMatch && sparePartMatch;
  });

  const generatePDF = (stockItem: StockItem) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Spare Part Stock Transaction Details", 14, 22);
    
    autoTable(doc, {
        startY: 30,
        head: [['Field', 'Value']],
        body: [
            ['S. No.', stockItem.sNo],
            ['Branch Code', stockItem.branchCode],
            ['Spare Part', stockItem.sparePart],
            ['Part Code', stockItem.partCode],
            ['HSN Code', stockItem.hsnCode],
            ['Price', stockItem.price ? `₹${stockItem.price.toLocaleString('en-IN')}`: 'N/A'],
            ['Date', stockItem.date],
            ['Opening Stock', stockItem.openingStock],
            ['Sales', stockItem.sales],
            ['Closing Stock', stockItem.closingStock],
        ],
    });

    return doc;
  };

  const handleView = (sNo: number) => {
    const stockItem = stockData.find(item => item.sNo === sNo);
    if (!stockItem) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Stock item not found.",
        });
        return;
    }
    const doc = generatePDF(stockItem);
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleDownload = (sNo: number) => {
    const stockItem = stockData.find(item => item.sNo === sNo);
    if (!stockItem) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Stock item not found.",
        });
        return;
    }
    const doc = generatePDF(stockItem);
    doc.save(`sparepart-transaction-${stockItem.sNo}.pdf`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Helpline:</span>
            <span className="text-primary-foreground">+91 1800 123 4567</span>
          </div>
          <Avatar>
            <AvatarImage
              src={placeholderImages.placeholderImages[0].imageUrl}
              alt="User avatar"
              data-ai-hint={placeholderImages.placeholderImages[0].imageHint}
            />
            <AvatarFallback>U</AvatarFallback>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Spare Parts Stock</h2>
        </div>

        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-6 w-6" />
                        <span>My Branch Spare Parts Stock</span>
                    </CardTitle>
                    <CardDescription>
                    A log of all spare parts inventory transactions for your branch.
                    </CardDescription>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                    <Input 
                        placeholder="Find Spare Parts..."
                        value={sparePartFilter}
                        onChange={(e) => setSparePartFilter(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S. No.</TableHead>
                      <TableHead>Spare Part</TableHead>
                      <TableHead>Part Code</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Opening Stock</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">View/Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBranchStock.length > 0 ? (
                      myBranchStock.map((item) => (
                        <TableRow key={item.sNo}>
                          <TableCell>{item.sNo}</TableCell>
                          <TableCell className="font-medium">{item.sparePart}</TableCell>
                          <TableCell>{item.partCode}</TableCell>
                          <TableCell>{item.hsnCode}</TableCell>
                          <TableCell className="text-right">{item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'N/A'}</TableCell>
                          <TableCell className="text-right">{item.openingStock}</TableCell>
                          <TableCell className="text-right">{item.sales}</TableCell>
                          <TableCell className="text-right">{item.closingStock}</TableCell>
                          <TableCell>{item.date}</TableCell>
                           <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => handleView(item.sNo)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(item.sNo)}>
                                <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          No stock data found for your branch.
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
            <CardDescription>Fill out the form to submit the daily stock report for your branch ({currentBranch}).</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="sparePart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spare Part</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="partCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part Code</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hsnCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN Code</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                        <FormItem>
                          <FormLabel>Sales</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                        <FormLabel>Closing</FormLabel>
                        <Input value={closingStock < 0 ? 0 : closingStock} disabled />
                    </div>
                    <div>
                        <FormLabel>Date</FormLabel>
                        <Input value={currentDate} disabled />
                    </div>
                </div>
                 <Button type="submit" className="w-full md:w-auto">Submit Report</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
