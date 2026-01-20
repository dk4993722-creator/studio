
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LogOut, Phone, Download, Eye } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useForm, FormProvider } from "react-hook-form";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const invoiceSchema = z.object({
  // User Details
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User name is required"),

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

  // Vehicle Details
  model: z.string().optional(),
  noOfSeat: z.string().optional(),
  chassisNo: z.string().optional(),
  motorNo: z.string().optional(),
  controllerNo: z.string().optional(),
  chargerNo1: z.string().optional(),
  chargerNo2: z.string().optional(),
  batteryMaker: z.string().optional(),
  batteryNo1: z.string().optional(),
  batteryNo2: z.string().optional(),
  batteryNo3: z.string().optional(),
  batteryNo4: z.string().optional(),
  batteryNo5: z.string().optional(),
  batteryNo6: z.string().optional(),

  // Billing
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
});

type Invoice = z.infer<typeof invoiceSchema> & {
  id: string;
  date: Date;
  total: number;
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


export default function SalesPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      userId: "",
      userName: "",
      branchName: "",
      branchCode: "",
      branchGstNo: "",
      branchContact: "",
      branchAddress: "",
      branchCity: "",
      branchDistrict: "",
      branchState: "",
      branchPinCode: "",
      model: "",
      noOfSeat: "",
      chassisNo: "",
      motorNo: "",
      controllerNo: "",
      chargerNo1: "",
      chargerNo2: "",
      batteryMaker: "",
      batteryNo1: "",
      batteryNo2: "",
      batteryNo3: "",
      batteryNo4: "",
      batteryNo5: "",
      batteryNo6: "",
      quantity: 1,
      rate: 0,
    },
  });

  const { watch } = form;
  const quantity = watch("quantity");
  const rate = watch("rate");

  useEffect(() => {
    try {
      const storedInvoices = JSON.parse(localStorage.getItem('yunex-invoices') || '[]');
      const formattedInvoices = storedInvoices.map((inv: any) => ({
        ...inv,
        date: new Date(inv.date),
      }));
      setInvoices(formattedInvoices);
    } catch (error) {
      console.error("Failed to load invoices from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const amount = (quantity || 0) * (rate || 0);
    setTotalAmount(amount);
  }, [quantity, rate]);

  const generatePDF = (invoiceData: Invoice) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const primaryColor = '#326cd1';
    const mutedColor = '#6c757d';
    
    // Draw Logo
    const logoX = 14;
    const logoY = 15;
    const logoSize = 25;
    doc.setFillColor(primaryColor);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor('#FFFFFF');
    doc.text('YU', logoX + logoSize / 2, logoY + logoSize / 2 + 4, { align: 'center' });

    // Reset font for title
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

    autoTable(doc, {
        startY: 50,
        theme: 'plain',
        body: [
            [
                { content: 'Billed To:', styles: { fontStyle: 'bold', textColor: primaryColor } },
            ],
            [
                `Branch: ${invoiceData.branchName} (${invoiceData.branchCode})\nUser: ${invoiceData.userName} (${invoiceData.userId})\n${invoiceData.branchAddress}, ${invoiceData.branchCity}, ${invoiceData.branchDistrict}, ${invoiceData.branchState} - ${invoiceData.branchPinCode}\nGSTIN: ${invoiceData.branchGstNo || 'N/A'}\nContact: ${invoiceData.branchContact}`,
            ],
        ],
        styles: { fontSize: 9, cellPadding: 1 },
    });

    const tableColumn = ["S. No.", "Description", "Particular", "Qty", "Rate", "Amount"];
    const tableRows: any[][] = [];

    const productRow = ['', { content: invoiceData.model || 'Yunex - E.Bike', styles: { fontStyle: 'bold' } }, '', invoiceData.quantity.toString(), `₹${invoiceData.rate.toFixed(2)}`, `₹${invoiceData.total.toFixed(2)}`];
    tableRows.push(productRow);

    const specs = [
        { desc: 'Model', value: invoiceData.model },
        { desc: 'No of seat', value: invoiceData.noOfSeat },
        { desc: 'Chassis No', value: invoiceData.chassisNo },
        { desc: 'Motor No', value: invoiceData.motorNo },
        { desc: 'Controller No', value: invoiceData.controllerNo },
        { desc: 'Charger No - 1', value: invoiceData.chargerNo1 },
        { desc: 'Charger No - 2', value: invoiceData.chargerNo2 },
        { desc: 'Battery Maker', value: invoiceData.batteryMaker },
        ...[1, 2, 3, 4, 5, 6].map(i => ({ desc: `Battery No-${i}`, value: invoiceData[`batteryNo${i}` as keyof Invoice] }))
    ];

    let specIndex = 1;
    specs.forEach((spec) => {
        if (spec.value) {
            const row = [String(specIndex++), spec.desc, String(spec.value), '', '', ''];
            tableRows.push(row);
        }
    });

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [50, 108, 209], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            2: { cellWidth: 'auto' },
            3: { halign: 'right', cellWidth: 20 },
            4: { halign: 'right', cellWidth: 30 },
            5: { halign: 'right', cellWidth: 30 },
        },
    });
    
    let finalY = (doc as any).lastAutoTable.finalY;
    const totalInWords = toWords(invoiceData.total).trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Only';

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total In Words:', 14, finalY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(totalInWords, 14, finalY + 15, { maxWidth: pageWidth / 2 });
    
    autoTable(doc, {
      startY: finalY + 5,
      body: [
        ['Total Invoice Value', `₹${invoiceData.total.toFixed(2)}`],
      ],
      theme: 'plain',
      tableWidth: 80,
      margin: { left: pageWidth - 80 - 14 },
      styles: { halign: 'right' },
      bodyStyles: { fontStyle: 'bold', fontSize: 12, cellPadding: { top: 5, right: 0 } },
    });

    finalY = (doc as any).lastAutoTable.finalY;
    let signatureY = finalY > pageHeight - 70 ? pageHeight - 60 : finalY + 30;
    
    const footerY = pageHeight - 20;
    doc.setDrawColor(220);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(mutedColor);
    doc.text(`Office address: Near D.C. Office, Satyam Nagar, Dhanbad, Jharkhand, INDIA. 826004.`, 14, footerY);
    doc.text(`www.yunex.com | E-mail: info@yunex.com`, 14, footerY + 4);

    doc.setFontSize(10);
    doc.setTextColor('#000000');
    doc.text('For YUNEX', pageWidth - 14, signatureY, { align: 'right' });
    doc.text('Authorised Signatory', pageWidth - 14, signatureY + 20, { align: 'right' });

    return doc;
  };


  const handleDownload = (invoice: Invoice) => {
    try {
        const doc = generatePDF(invoice);
        doc.save(`invoice-${invoice.id}.pdf`);
        toast({ title: "Success", description: "PDF downloaded successfully." });
    } catch(e) {
        console.error("PDF Download Error:", e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF for download." });
    }
  };

  const handleView = (invoice: Invoice) => {
     try {
        const doc = generatePDF(invoice);
        window.open(doc.output('bloburl'), '_blank');
    } catch(e) {
        console.error("PDF View Error:", e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF for viewing." });
    }
  };

  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    const newInvoice: Invoice = {
      ...data,
      id: `YUNEX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date(),
      total: data.quantity * data.rate,
    };
    
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);

    try {
        const invoicesForStorage = updatedInvoices.map(inv => ({...inv, date: inv.date.toISOString()}));
        localStorage.setItem('yunex-invoices', JSON.stringify(invoicesForStorage));
    } catch (error) {
        console.error("Failed to save invoices to localStorage", error);
    }
    
    // Create purchase entry and save to localStorage
    const newPurchase = {
      id: newInvoice.id,
      product: `${newInvoice.model || "Yunex E.Bike"} for ${newInvoice.userName}`,
      quantity: newInvoice.quantity,
      rate: newInvoice.rate,
      amount: newInvoice.total,
      date: newInvoice.date.toISOString(), // Store as ISO string
    };

    try {
      const existingPurchases = JSON.parse(localStorage.getItem('yunex-purchases') || '[]');
      const updatedPurchases = [newPurchase, ...existingPurchases];
      localStorage.setItem('yunex-purchases', JSON.stringify(updatedPurchases));
    } catch (error) {
      console.error("Failed to update purchases in localStorage", error);
    }
    
    form.reset();
    setTotalAmount(0);
    toast({
      title: "Invoice Generated!",
      description: "The new invoice has been added to history and purchase panel.",
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Sales Panel</h1>
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
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Create Sales Invoice</h2>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="userId" render={({ field }) => ( <FormItem> <FormLabel>User ID</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="userName" render={({ field }) => ( <FormItem> <FormLabel>User Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branch Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField control={form.control} name="branchName" render={({ field }) => ( <FormItem> <FormLabel>Branch Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField
                    control={form.control}
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
                              form.setValue("branchName", selectedBranch.district);
                              form.setValue("branchDistrict", selectedBranch.district);
                              form.setValue("branchCity", selectedBranch.district);
                              form.setValue("branchState", "Jharkhand");
                              form.setValue("branchAddress", "");
                              form.setValue("branchPinCode", "");
                              form.setValue("branchGstNo", "");
                              form.setValue("branchContact", "");
                            }
                          }}
                          defaultValue={field.value}
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
                  <FormField control={form.control} name="branchGstNo" render={({ field }) => ( <FormItem> <FormLabel>GST No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchContact" render={({ field }) => ( <FormItem> <FormLabel>Contact</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchAddress" render={({ field }) => ( <FormItem className="md:col-span-2"> <FormLabel>Address</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchCity" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchDistrict" render={({ field }) => ( <FormItem> <FormLabel>District</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchState" render={({ field }) => ( <FormItem> <FormLabel>State</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchPinCode" render={({ field }) => ( <FormItem> <FormLabel>Pin Code</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FormField control={form.control} name="model" render={({ field }) => ( <FormItem> <FormLabel>Model</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="noOfSeat" render={({ field }) => ( <FormItem> <FormLabel>No of Seat</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="chassisNo" render={({ field }) => ( <FormItem> <FormLabel>Chassis No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="motorNo" render={({ field }) => ( <FormItem> <FormLabel>Motor No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="controllerNo" render={({ field }) => ( <FormItem> <FormLabel>Controller No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="chargerNo1" render={({ field }) => ( <FormItem> <FormLabel>Charger No - 1</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="chargerNo2" render={({ field }) => ( <FormItem> <FormLabel>Charger No - 2</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryMaker" render={({ field }) => ( <FormItem> <FormLabel>Battery Maker</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryNo1" render={({ field }) => ( <FormItem> <FormLabel>Battery No-1</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryNo2" render={({ field }) => ( <FormItem> <FormLabel>Battery No-2</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryNo3" render={({ field }) => ( <FormItem> <FormLabel>Battery No-3</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryNo4" render={({ field }) => ( <FormItem> <FormLabel>Battery No-4</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryNo5" render={({ field }) => ( <FormItem> <FormLabel>Battery No-5</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="batteryNo6" render={({ field }) => ( <FormItem> <FormLabel>Battery No-6</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <FormField control={form.control} name="quantity" render={({ field }) => ( <FormItem> <FormLabel>Quantity</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="rate" render={({ field }) => ( <FormItem> <FormLabel>Rate (per item)</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <div className="text-right md:text-left pt-6">
                        <p className="text-sm text-muted-foreground">Total Invoice Value</p>
                        <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
                    </div>
                </CardContent>
              </Card>
              
              <Button type="submit" size="lg" className="w-full">Generate Bill</Button>
            </form>
          </Form>
        </FormProvider>

        <Card>
            <CardHeader>
                <CardTitle>Sales Invoice History</CardTitle>
                <CardDescription>View and manage previously generated invoices.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.branchName}</TableCell>
                                    <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">₹{invoice.total.toFixed(2)}</TableCell>
                                    <TableCell className="flex justify-center items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleView(invoice)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDownload(invoice)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No invoices generated yet.</TableCell>
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

    