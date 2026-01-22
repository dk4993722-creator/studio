
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
import { ArrowLeft, Phone, LogOut, Wrench, Eye, Download, Edit, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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

const addStockSchema = z.object({
  sparePart: z.string().min(1, "Spare part name is required."),
  partCode: z.string().min(1, "Part code is required."),
  hsnCode: z.string().min(1, "HSN code is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  addQty: z.coerce.number().min(1, "Quantity must be at least 1."),
});

const sparePartInvoiceSchema = z.object({
  // Branch Details
  branchName: z.string().min(1, "Branch name is required"),
  branchCode: z.string().min(1, "Branch code is required"),
  branchGstNo: z.string().optional(),
  branchContact: z.string().min(1, "Contact is required"),
  branchAddress: z.string().min(1, "Address is required"),
  branchCity: z.string().min(1, "City is required"),
  branchDistrict: z.string().min(1, "District is required"),
  branchState: z.string().min(1, "State is required"),
  branchPinCode: z.string().min(1, "Pin code is required"),
  
  // Part Details
  sparePart: z.string().min(1, "Please select a spare part."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});


type StockItem = {
  sNo: number;
  branchCode: string;
  sparePart: string;
  partCode?: string;
  hsnCode?: string;
  price?: number;
  openingStock: number;
  sales: number;
  closingStock: number;
  date: string;
};

type SparePartInvoice = z.infer<typeof sparePartInvoiceSchema> & {
    id: string;
    date: Date;
    total: number;
    partCode: string;
    hsnCode: string;
    rate: number;
    sourceBranchCode: string;
};

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const toWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const numStr = Math.floor(num).toString();
    const [, major] = numStr.match(/^(\d+)/) || [];
    if (!major) return '';

    const numberToWords = (n: number): string => {
        if (n < 20) return ones[n];
        const digit = n % 10;
        if (n < 100) return tens[Math.floor(n / 10)] + (digit ? ' ' + ones[digit] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + numberToWords(n % 100) : '');
        if (n < 100000) return numberToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + numberToWords(n % 1000) : '');
        if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + ' lakh' + (n % 100000 !== 0 ? ' ' + numberToWords(n % 100000) : '');
        return numberToWords(Math.floor(n / 10000000)) + ' crore' + (n % 10000000 !== 0 ? ' ' + numberToWords(n % 10000000) : '');
    };
    return numberToWords(parseInt(major));
};


export default function SparePartsStockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stockData, setStockData] = useState<StockItem[]>(initialStockData);
  const [currentBranch, setCurrentBranch] = useState(branches[0].branchCode);
  const [sparePartInvoices, setSparePartInvoices] = useState<SparePartInvoice[]>([]);
  const [selectedPart, setSelectedPart] = useState<{ price: number; partCode: string; hsnCode: string; } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKey, setFilterKey] = useState<"branchCode" | "district">("branchCode");
  
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

  const invoiceForm = useForm<z.infer<typeof sparePartInvoiceSchema>>({
    resolver: zodResolver(sparePartInvoiceSchema),
    defaultValues: {
      branchName: "",
      branchCode: "",
      branchGstNo: "",
      branchContact: "",
      branchAddress: "",
      branchCity: "",
      branchDistrict: "",
      branchState: "",
      branchPinCode: "",
      sparePart: "",
      quantity: 1,
    },
  });

  const watchedInvoiceSparePart = invoiceForm.watch("sparePart");
  const watchedInvoiceQuantity = invoiceForm.watch("quantity");
  const totalInvoiceAmount = (selectedPart?.price || 0) * watchedInvoiceQuantity;

  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    try {
      const storedStock = localStorage.getItem('yunex-spareparts-stock');
      if (storedStock) {
        setStockData(JSON.parse(storedStock));
      } else {
        localStorage.setItem('yunex-spareparts-stock', JSON.stringify(initialStockData));
      }

      const storedInvoices = JSON.parse(localStorage.getItem('yunex-spare-part-invoices') || '[]');
      const formattedInvoices = storedInvoices.map((inv: any) => ({
        ...inv,
        date: new Date(inv.date),
      }));
      setSparePartInvoices(formattedInvoices);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load page data.",
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (currentBranch && watchedInvoiceSparePart) {
      const latestEntry = stockData
        .filter(item => item.branchCode === currentBranch && item.sparePart.toLowerCase() === watchedInvoiceSparePart.toLowerCase())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
        if (latestEntry) {
            setSelectedPart({
                price: latestEntry.price || 0,
                partCode: latestEntry.partCode || 'N/A',
                hsnCode: latestEntry.hsnCode || 'N/A',
            });
        } else {
            setSelectedPart(null);
        }
    } else {
        setSelectedPart(null);
    }
}, [currentBranch, watchedInvoiceSparePart, stockData]);

  const updateStockData = (newData: StockItem[]) => {
      setStockData(newData);
      try {
          localStorage.setItem('yunex-spareparts-stock', JSON.stringify(newData));
      } catch (error) {
          console.error("Failed to save stock to localStorage", error);
          toast({
              variant: "destructive",
              title: "Save Error",
              description: "Could not save the new stock entry.",
          });
      }
  };

  function onAddStockSubmit(values: z.infer<typeof addStockSchema>) {
    const { sparePart, addQty, partCode, hsnCode, price } = values;
    const branchCode = currentBranch;

    if (!branchCode) {
      toast({
        variant: "destructive",
        title: "Branch Not Selected",
        description: "Please select a branch from the top of the page first.",
      });
      return;
    }

    const latestEntry = stockData
      .filter(item => item.branchCode === branchCode && item.sparePart.toLowerCase() === sparePart.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const openingStockForAddition = latestEntry ? latestEntry.closingStock : 0;

    const newEntry: StockItem = {
      sNo: stockData.length > 0 ? Math.max(...stockData.map(item => item.sNo)) + 1 : 1,
      branchCode: branchCode,
      sparePart: sparePart,
      partCode: partCode,
      hsnCode: hsnCode,
      price: price,
      openingStock: openingStockForAddition,
      sales: 0, // No sales for a stock addition
      closingStock: openingStockForAddition + addQty,
      date: new Date().toISOString().split('T')[0],
    };

    updateStockData([newEntry, ...stockData]);
    
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
    });
  }

  const onInvoiceSubmit = (values: z.infer<typeof sparePartInvoiceSchema>) => {
    if (!currentBranch) {
        toast({ variant: "destructive", title: "Branch Not Selected", description: "Please select a branch." });
        return;
    }

    const latestEntry = stockData
      .filter(item => item.branchCode === currentBranch && item.sparePart.toLowerCase() === values.sparePart.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!latestEntry || latestEntry.closingStock < values.quantity) {
        toast({ variant: "destructive", title: "Out of Stock", description: "Not enough stock available for this sale." });
        return;
    }

    // 1. Create new stock transaction for the sale
    const newStockEntry: StockItem = {
      sNo: stockData.length > 0 ? Math.max(...stockData.map(item => item.sNo)) + 1 : 1,
      branchCode: currentBranch,
      sparePart: values.sparePart,
      partCode: latestEntry.partCode,
      hsnCode: latestEntry.hsnCode,
      price: latestEntry.price,
      openingStock: latestEntry.closingStock,
      sales: values.quantity,
      closingStock: latestEntry.closingStock - values.quantity,
      date: new Date().toISOString().split('T')[0],
    };
    updateStockData([newStockEntry, ...stockData]);
    
    // 2. Create invoice
    const newInvoice: SparePartInvoice = {
        ...values,
        id: `YUNEX-SP-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date(),
        total: values.quantity * (latestEntry.price || 0),
        partCode: latestEntry.partCode || 'N/A',
        hsnCode: latestEntry.hsnCode || 'N/A',
        rate: latestEntry.price || 0,
        sourceBranchCode: currentBranch,
    };
    
    const updatedInvoices = [newInvoice, ...sparePartInvoices];
    setSparePartInvoices(updatedInvoices);

    try {
        localStorage.setItem('yunex-spare-part-invoices', JSON.stringify(updatedInvoices));
    } catch (error) {
        console.error("Failed to save spare part invoices to localStorage", error);
    }

    invoiceForm.reset({
      branchName: "",
      branchCode: "",
      branchGstNo: "",
      branchContact: "",
      branchAddress: "",
      branchCity: "",
      branchDistrict: "",
      branchState: "",
      branchPinCode: "",
      sparePart: "",
      quantity: 1,
    });
    toast({ title: "Invoice Generated", description: "Stock has been updated." });
  };
  
  const handleDelete = (sNo: number) => {
    const updatedStock = stockData.filter(item => item.sNo !== sNo);
    updateStockData(updatedStock);
    toast({
        title: "Transaction Deleted",
        description: "The stock transaction has been removed.",
    });
  };

  const generateSparePartInvoicePDF = async (invoiceData: SparePartInvoice) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const primaryColor = '#326cd1';
    const mutedColor = '#6c757d';
    
    // Logo and Header
    const logoX = 14;
    const logoY = 15;
    const logoSize = 25;
    doc.setFillColor(primaryColor);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor('#FFFFFF');
    doc.text('YU', logoX + logoSize / 2, logoY + logoSize / 2 + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(primaryColor);
    doc.text('YUNEX', logoX + logoSize + 3, 30);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor('#000000');
    doc.text('TAX INVOICE', pageWidth - 14, 25, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text(`Invoice No: ${invoiceData.id}`, pageWidth - 14, 32, { align: 'right' });
    doc.text(`Date: ${invoiceData.date.toLocaleDateString('en-IN')}`, pageWidth - 14, 37, { align: 'right' });

    doc.setDrawColor(200);
    doc.line(14, 45, pageWidth - 14, 45);

    // Billing details
    const sellerBranch = branches.find(b => b.branchCode === invoiceData.sourceBranchCode);
    const sellerDetails = `YUNEX - ${sellerBranch?.district || invoiceData.sourceBranchCode}\nNear D.C. Office, Satyam Nagar\nDhanbad, Jharkhand, INDIA. 826004.\nE-mail: info@yunex.com`;
    const buyerDetails = `Branch: ${invoiceData.branchName} (${invoiceData.branchCode})\n${invoiceData.branchAddress}, ${invoiceData.branchCity}, ${invoiceData.branchDistrict}, ${invoiceData.branchState} - ${invoiceData.branchPinCode}\nGSTIN: ${invoiceData.branchGstNo || 'N/A'}\nContact: ${invoiceData.branchContact}`;

    autoTable(doc, {
        startY: 50,
        theme: 'plain',
        body: [
            [{ content: 'Billed By:', styles: { fontStyle: 'bold', textColor: primaryColor } }, { content: 'Billed To:', styles: { fontStyle: 'bold', textColor: primaryColor } }],
            [sellerDetails, buyerDetails],
        ],
        styles: { fontSize: 9, cellPadding: {top: 1, right: 2, bottom: 1, left: 0}, valign: 'top' },
    });
    
    // Items table
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['S.No.', 'Spare Part', 'Part Code', 'HSN Code', 'Qty', 'Rate', 'Amount']],
        body: [
            [
                '1',
                invoiceData.sparePart,
                invoiceData.partCode,
                invoiceData.hsnCode,
                invoiceData.quantity,
                `₹${invoiceData.rate.toFixed(2)}`,
                `₹${invoiceData.total.toFixed(2)}`,
            ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [50, 108, 209], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: { 0: { halign: 'center' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' } },
    });
    
    // Totals
    let finalY = (doc as any).lastAutoTable.finalY;
    const totalInWords = toWords(invoiceData.total).trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Only';

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total In Words:', 14, finalY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(totalInWords, 14, finalY + 15, { maxWidth: pageWidth / 2 });
    
    autoTable(doc, {
      startY: finalY + 5,
      body: [['Total Invoice Value', `₹${invoiceData.total.toFixed(2)}`]],
      theme: 'plain',
      tableWidth: 80,
      margin: { left: pageWidth - 80 - 14 },
      styles: { halign: 'right' },
      bodyStyles: { fontStyle: 'bold', fontSize: 12, cellPadding: { top: 5, right: 0 } },
    });

    finalY = (doc as any).lastAutoTable.finalY;
    let signatureY = finalY > pageHeight - 70 ? pageHeight - 60 : finalY + 30;
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setDrawColor(220);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(mutedColor);
    doc.text(`Office address: Near D.C. Office, Satyam Nagar, Dhanbad, Jharkhand, INDIA. 826004.`, 14, footerY);
    doc.text(`www.yunex.com | E-mail: info@yunex.com`, 14, footerY + 4);
    
    // Signature
    doc.setFontSize(10);
    doc.setTextColor('#000000');
    doc.text('For YUNEX', pageWidth - 14, signatureY, { align: 'right' });
    doc.text('Authorised Signatory', pageWidth - 14, signatureY + 20, { align: 'right' });
    
    return doc;
  };

  const handleViewInvoice = async (invoice: SparePartInvoice) => {
    try {
        const doc = await generateSparePartInvoicePDF(invoice);
        window.open(doc.output('bloburl'), '_blank');
    } catch(e) {
        console.error("PDF View Error:", e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF for viewing." });
    }
  };

  const handleDownloadInvoice = async (invoice: SparePartInvoice) => {
    try {
        const doc = await generateSparePartInvoicePDF(invoice);
        doc.save(`spare-part-invoice-${invoice.id}.pdf`);
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

    const headers = ["S. No.", "Branch Code", "Spare Part", "Part Code", "HSN Code", "Price", "Date", "Opening Stock", "Sales", "Closing Stock"];
    const csvContent = [
      headers.join(","),
      ...stockData.map(item => [
        item.sNo,
        item.branchCode,
        `"${item.sparePart.replace(/"/g, '""')}"`,
        item.partCode || '',
        item.hsnCode || '',
        item.price || 0,
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

  const availableParts = [...new Set(stockData.filter(item => item.branchCode === currentBranch && item.closingStock > 0).map(item => item.sparePart))];
  
  const branchMap = new Map(branches.map(b => [b.branchCode, b.district]));

  const filteredStockData = stockData.filter(item => {
    if (!searchQuery) return true;
    if (filterKey === 'branchCode') {
        return item.branchCode.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (filterKey === 'district') {
        const district = branchMap.get(item.branchCode) || '';
        return district.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Spare Parts Stock</h2>
        </div>

        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-6 w-6" />
                        <span>Company Spare Parts Stock</span>
                    </CardTitle>
                    <CardDescription>
                      A log of all spare parts transactions across all branches.
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
                      <TableHead>HSN Code</TableHead>
                      <TableHead className="text-right">Price</TableHead>
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
                        <TableCell>{item.hsnCode || 'N/A'}</TableCell>
                        <TableCell className="text-right">{item.price ? `₹${item.price.toFixed(2)}` : 'N/A'}</TableCell>
                        <TableCell className="text-right">{item.openingStock}</TableCell>
                        <TableCell className="text-right">{item.sales}</TableCell>
                        <TableCell className="text-right">{item.closingStock}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="text-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Transaction</DialogTitle>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
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
                      name="addQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Add Quantity</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
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
                </div>
                <Button type="submit" className="w-full md:w-auto">Add Stock</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Find Branch Stock</CardTitle>
                <CardDescription>Filter spare parts stock by District or Branch Code.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                 <Select value={filterKey} onValueChange={(value) => setFilterKey(value as "branchCode" | "district")}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="branchCode">Branch Code</SelectItem>
                        <SelectItem value="district">District</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder={`Filter by ${filterKey === 'branchCode' ? 'Branch Code' : 'District'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Branch Spare Parts Details</CardTitle>
                <CardDescription>View and edit spare parts stock transactions for all branches.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S. No.</TableHead>
                            <TableHead>Branch Code</TableHead>
                            <TableHead>Spare Part</TableHead>
                            <TableHead>HSN Code</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Opening Stock</TableHead>
                            <TableHead className="text-right">Sales</TableHead>
                            <TableHead className="text-right">Closing Stock</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStockData.map((item) => (
                        <TableRow key={item.sNo}>
                            <TableCell>{item.sNo}</TableCell>
                            <TableCell>{item.branchCode}</TableCell>
                            <TableCell className="font-medium">{item.sparePart}</TableCell>
                            <TableCell>{item.hsnCode || 'N/A'}</TableCell>
                            <TableCell className="text-right">{item.price ? `₹${item.price.toFixed(2)}` : 'N/A'}</TableCell>
                            <TableCell className="text-right">{item.openingStock}</TableCell>
                            <TableCell className="text-right">{item.sales}</TableCell>
                            <TableCell className="text-right">{item.closingStock}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="text-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Transaction</DialogTitle>
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spare Parts Invoice</CardTitle>
            <CardDescription>Generate an invoice for a spare part sale. This will update the stock automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...invoiceForm}>
              <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-6">
                
                <h3 className="text-lg font-medium">Branch Details</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField control={invoiceForm.control} name="branchName" render={({ field }) => ( <FormItem> <FormLabel>Branch Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField
                    control={invoiceForm.control}
                    name="branchCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Code</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedBranch = branches.find(
                              (b) => b.branchCode === value
                            );
                            if (selectedBranch) {
                              invoiceForm.setValue("branchName", selectedBranch.district);
                              invoiceForm.setValue("branchDistrict", selectedBranch.district);
                              invoiceForm.setValue("branchCity", selectedBranch.district);
                              invoiceForm.setValue("branchState", "Jharkhand");
                              invoiceForm.setValue("branchAddress", "");
                              invoiceForm.setValue("branchPinCode", "");
                              invoiceForm.setValue("branchGstNo", "");
                              invoiceForm.setValue("branchContact", "");
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.branchCode}>
                                {branch.district} ({branch.branchCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={invoiceForm.control} name="branchGstNo" render={({ field }) => ( <FormItem> <FormLabel>GST No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={invoiceForm.control} name="branchContact" render={({ field }) => ( <FormItem> <FormLabel>Contact</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={invoiceForm.control} name="branchAddress" render={({ field }) => ( <FormItem className="md:col-span-2"> <FormLabel>Address</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={invoiceForm.control} name="branchCity" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={invoiceForm.control} name="branchDistrict" render={({ field }) => ( <FormItem> <FormLabel>District</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={invoiceForm.control} name="branchState" render={({ field }) => ( <FormItem> <FormLabel>State</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={invoiceForm.control} name="branchPinCode" render={({ field }) => ( <FormItem> <FormLabel>Pin Code</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </div>


                <h3 className="text-lg font-medium pt-4">Part Details</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                    <FormField
                        control={invoiceForm.control}
                        name="sparePart"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                            <FormLabel>Spare Part</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!currentBranch}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={!currentBranch ? "Select a branch first" : "Select a spare part"} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {availableParts.map(part => (
                                    <SelectItem key={part} value={part}>{part}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={invoiceForm.control} name="quantity" render={({ field }) => ( <FormItem> <FormLabel>Quantity</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <div>
                        <FormLabel>Part Code</FormLabel>
                        <Input value={selectedPart?.partCode || 'N/A'} disabled />
                    </div>
                     <div>
                        <FormLabel>HSN Code</FormLabel>
                        <Input value={selectedPart?.hsnCode || 'N/A'} disabled />
                    </div>
                    <div>
                        <FormLabel>Price</FormLabel>
                        <Input value={selectedPart ? `₹${selectedPart.price.toFixed(2)}` : 'N/A'} disabled />
                    </div>
                </div>
                 <div className="flex justify-between items-center rounded-md bg-muted p-4 mt-6">
                    <span className="text-muted-foreground font-medium">Total Invoice Value</span>
                    <span className="text-2xl font-bold">₹{totalInvoiceAmount.toFixed(2)}</span>
                </div>
                <Button type="submit" className="w-full md:w-auto">Generate Invoice</Button>
              </form>
            </Form>
            <Separator className="my-8" />
            <div>
                <h3 className="text-lg font-medium mb-4">Spare Part Invoice History</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Spare Part</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sparePartInvoices.length > 0 ? (
                            sparePartInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.branchName}</TableCell>
                                    <TableCell>{invoice.sparePart}</TableCell>
                                    <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">₹{invoice.total.toFixed(2)}</TableCell>
                                    <TableCell className="flex justify-center items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleViewInvoice(invoice)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDownloadInvoice(invoice)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No spare part invoices generated yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
