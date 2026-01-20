
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
import { ArrowLeft, Phone, LogOut, Wrench, Download, Eye } from "lucide-react";
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileUpload } from "@/components/ui/file-upload";

const initialStockData = [
  { sNo: 1, branchCode: 'Yunex202601', sparePart: 'Brake Pad', openingStock: 200, sales: 20, closingStock: 180, date: '2024-07-30' },
  { sNo: 2, branchCode: 'Yunex202602', sparePart: 'Headlight', openingStock: 100, sales: 5, closingStock: 95, date: '2024-07-30' },
  { sNo: 3, branchCode: 'Yunex202601', sparePart: 'Battery 48V', openingStock: 50, sales: 2, closingStock: 48, date: '2024-07-30' },
  { sNo: 4, branchCode: 'Yunex202603', sparePart: 'Tyre 10-inch', openingStock: 150, sales: 10, closingStock: 140, date: '2024-07-30' },
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
  branchCode: z.string().min(1, "Branch code is required."),
  sparePart: z.string().min(1, "Spare part name is required."),
  openingStock: z.coerce.number().min(0, "Opening stock cannot be negative."),
  sales: z.coerce.number().min(0, "Sales cannot be negative."),
}).refine(data => data.sales <= data.openingStock, {
  message: "Sales cannot be greater than opening stock.",
  path: ["sales"],
});

const addStockSchema = z.object({
  sparePart: z.string().min(1, "Spare part name is required."),
  partCode: z.string().min(1, "Part code is required."),
  hsnCode: z.string().min(1, "HSN code is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  addQty: z.coerce.number().min(1, "Quantity must be at least 1."),
  partPicture: z.any().refine((files) => files?.length == 1, "Part picture is required."),
});


type StockItem = {
  sNo: number;
  branchCode: string;
  sparePart: string;
  openingStock: number;
  sales: number;
  closingStock: number;
  date: string;
};

export default function SparePartsStockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<StockItem[]>(initialStockData);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      branchCode: "",
      sparePart: "",
      openingStock: 0,
      sales: 0,
    },
  });
  
  const addStockForm = useForm<z.infer<typeof addStockSchema>>({
    resolver: zodResolver(addStockSchema),
    defaultValues: {
      sparePart: "",
      addQty: 0,
      partCode: "",
      hsnCode: "",
      price: 0,
    },
  });

  const { watch, setValue } = form;
  const watchedBranchCode = watch("branchCode");
  const watchedSparePart = watch("sparePart");
  const openingStock = watch("openingStock");
  const sales = watch("sales");
  const closingStock = openingStock - sales;
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (watchedBranchCode && watchedSparePart) {
      const latestEntry = stockData
        .filter(item => item.branchCode === watchedBranchCode && item.sparePart.toLowerCase() === watchedSparePart.toLowerCase())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (latestEntry) {
        setValue("openingStock", latestEntry.closingStock);
      } else {
        setValue("openingStock", 0);
      }
    }
  }, [watchedBranchCode, watchedSparePart, stockData, setValue]);

  function onSubmit(values: z.infer<typeof reportSchema>) {
    const newEntry: StockItem = {
      sNo: stockData.length + 1,
      ...values,
      closingStock: values.openingStock - values.sales,
      date: new Date().toISOString().split('T')[0],
    };
    setStockData(prev => [newEntry, ...prev]);
    toast({
      title: "Report Submitted",
      description: "The daily spare parts stock transaction has been updated.",
    });
    form.reset({
      branchCode: "",
      sparePart: "",
      openingStock: 0,
      sales: 0,
    });
  }
  
  function onAddStockSubmit(values: z.infer<typeof addStockSchema>) {
    const { sparePart, addQty } = values;
    const branchCode = form.getValues("branchCode");

    if (!branchCode) {
      toast({
        variant: "destructive",
        title: "Branch Not Selected",
        description: "Please select a branch from the 'Closing Daily Report' section first.",
      });
      return;
    }

    const latestEntry = stockData
      .filter(item => item.branchCode === branchCode && item.sparePart.toLowerCase() === sparePart.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const openingStockForAddition = latestEntry ? latestEntry.closingStock : 0;

    const newEntry: StockItem = {
      sNo: stockData.length + 1,
      branchCode: branchCode,
      sparePart: sparePart,
      openingStock: openingStockForAddition,
      sales: 0, // No sales for a stock addition
      closingStock: openingStockForAddition + addQty,
      date: new Date().toISOString().split('T')[0],
    };

    setStockData(prev => [newEntry, ...prev]);
    
    toast({
      title: "Stock Added",
      description: `${addQty} unit(s) of ${sparePart} added to branch ${branchCode}.`,
    });
    
    addStockForm.reset({
      sparePart: "",
      addQty: 0,
      partCode: "",
      hsnCode: "",
      price: 0,
      partPicture: null,
    });
  }

  const generatePDF = (item: StockItem) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Spare Part Stock Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    
    autoTable(doc, {
        startY: 40,
        head: [['Attribute', 'Value']],
        body: [
            ['S. No.', item.sNo.toString()],
            ['Branch Code', item.branchCode],
            ['Spare Part', item.sparePart],
            ['Report Date', item.date],
            ['Opening Stock', item.openingStock.toString()],
            ['Sales', item.sales.toString()],
            ['Closing Stock', item.closingStock.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [50, 108, 209] },
    });
    
    return doc;
  };

  const handleViewPdf = (item: StockItem) => {
    try {
        const doc = generatePDF(item);
        window.open(doc.output('bloburl'), '_blank');
    } catch(e) {
        console.error("PDF View Error:", e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF for viewing." });
    }
  };

  const handleDownloadPdf = (item: StockItem) => {
    try {
        const doc = generatePDF(item);
        doc.save(`stock-report-${item.branchCode}-${item.sNo}.pdf`);
        toast({ title: "Success", description: "PDF downloaded successfully." });
    } catch(e) {
        console.error("PDF Download Error:", e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF for download." });
    }
  };
  
  const handleDownloadCsv = () => {
    if (stockData.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "There is no stock history to download.",
      });
      return;
    }

    const headers = ["S. No.", "Branch Code", "Spare Part", "Date", "Opening Stock", "Sales", "Closing Stock"];
    const csvContent = [
      headers.join(","),
      ...stockData.map(item => [
        item.sNo,
        item.branchCode,
        `"${item.sparePart.replace(/"/g, '""')}"`,
        item.date,
        item.openingStock,
        item.sales,
        item.closingStock,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "spare-parts-stock.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Started",
        description: "Your spare parts stock history is being downloaded as a CSV file.",
      });
    }
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
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-6 w-6" />
                        <span>Daily Spare Parts Stock Transactions</span>
                    </CardTitle>
                    <CardDescription>
                      A daily summary of your spare parts inventory transactions.
                    </CardDescription>
                </div>
                 <Button onClick={handleDownloadCsv} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S. No.</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead>Spare Part</TableHead>
                      <TableHead className="text-right">Opening Stock</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.map((item) => (
                      <TableRow key={item.sNo}>
                        <TableCell>{item.sNo}</TableCell>
                        <TableCell>{item.branchCode}</TableCell>
                        <TableCell className="font-medium">{item.sparePart}</TableCell>
                        <TableCell className="text-right">{item.openingStock}</TableCell>
                        <TableCell className="text-right">{item.sales}</TableCell>
                        <TableCell className="text-right">{item.closingStock}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="flex justify-center items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewPdf(item)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDownloadPdf(item)}>
                                <Download className="h-4 w-4" />
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Add Spare Parts</CardTitle>
            <CardDescription>Add new stock for a spare part. This will create a new transaction record.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...addStockForm}>
              <form onSubmit={addStockForm.handleSubmit(onAddStockSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                    <FormField
                      control={addStockForm.control}
                      name="sparePart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spare Part</FormLabel>
                          <FormControl><Input {...field} placeholder="Enter part name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addStockForm.control}
                      name="partCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part Code</FormLabel>
                          <FormControl><Input {...field} placeholder="Enter part code" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addStockForm.control}
                      name="hsnCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN Code</FormLabel>
                          <FormControl><Input {...field} placeholder="Enter HSN code" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addStockForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl><Input type="number" {...field} placeholder="0.00" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addStockForm.control}
                      name="addQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Add Quantity</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                        <FormLabel>Date</FormLabel>
                        <Input value={currentDate} disabled />
                    </div>
                    <div className="md:col-span-2">
                      <FormField
                          control={addStockForm.control}
                          name="partPicture"
                          render={({ field }) => <FileUpload field={field} label="Part Picture" />}
                      />
                    </div>
                </div>
                <Button type="submit" className="w-full md:w-auto">Add Stock</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Closing Daily Report Submit</CardTitle>
            <CardDescription>Fill out the form to submit the daily spare parts stock report.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end">
                   <div className="lg:col-span-1">
                      <FormLabel>S.No.</FormLabel>
                      <Input value={stockData.length + 1} disabled />
                   </div>
                   <FormField
                      control={form.control}
                      name="branchCode"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Branch Code</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map(branch => (
                                <SelectItem key={branch.id} value={branch.branchCode}>{branch.district}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sparePart"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-1">
                          <FormLabel>Spare Part</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
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
                        <Input value={closingStock >= 0 ? closingStock : ''} disabled />
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

      </main>
    </div>
  );
}
