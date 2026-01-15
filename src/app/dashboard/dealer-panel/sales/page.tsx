
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
import 'jspdf-autotable';

const invoiceSchema = z.object({
  // Branch Details
  branchName: z.string().min(1, "Branch name is required"),
  branchGstNo: z.string().optional(),
  branchContact: z.string().min(1, "Contact is required"),
  branchAddress: z.string().min(1, "Address is required"),
  branchCity: z.string().min(1, "City is required"),
  branchDistrict: z.string().min(1, "District is required"),
  branchState: z.string().min(1, "State is required"),
  branchPinCode: z.string().min(1, "Pin code is required"),

  // Customer Details
  customerName: z.string().min(1, "Customer name is required"),
  customerAddress: z.string().min(1, "Address is required"),
  customerCity: z.string().min(1, "City is required"),
  customerDistrict: z.string().min(1, "District is required"),
  customerState: z.string().min(1, "State is required"),
  customerPinCode: z.string().min(1, "Pin code is required"),
  customerContact: z.string().min(1, "Contact is required"),
  customerAlternateNo: z.string().optional(),
  customerAadharNo: z.string().optional(),
  customerPanNo: z.string().optional(),
  customerGstNo: z.string().optional(),

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

export default function SalesPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      branchName: "",
      branchGstNo: "",
      branchContact: "",
      branchAddress: "",
      branchCity: "",
      branchDistrict: "",
      branchState: "",
      branchPinCode: "",
      customerName: "",
      customerAddress: "",
      customerCity: "",
      customerDistrict: "",
      customerState: "",
      customerPinCode: "",
      customerContact: "",
      customerAlternateNo: "",
      customerAadharNo: "",
      customerPanNo: "",
      customerGstNo: "",
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

  const { watch, setValue } = form;
  const quantity = watch("quantity");
  const rate = watch("rate");

  useEffect(() => {
    const amount = (quantity || 0) * (rate || 0);
    setTotalAmount(amount);
  }, [quantity, rate]);

  const generatePDF = (invoiceData: Invoice) => {
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Sales Invoice', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.autoTable({
        startY: 25,
        theme: 'plain',
        body: [
            [
                { content: 'Branch Details', styles: { fontStyle: 'bold' } },
                { content: 'Customer Details', styles: { fontStyle: 'bold' } },
            ],
            [
                `Name: ${invoiceData.branchName}\nGST No: ${invoiceData.branchGstNo}\nContact: ${invoiceData.branchContact}\nAddress: ${invoiceData.branchAddress}, ${invoiceData.branchCity}, ${invoiceData.branchDistrict}, ${invoiceData.branchState} - ${invoiceData.branchPinCode}`,
                `Name: ${invoiceData.customerName}\nAddress: ${invoiceData.customerAddress}, ${invoiceData.customerCity}, ${invoiceData.customerDistrict}, ${invoiceData.customerState} - ${invoiceData.customerPinCode}\nContact: ${invoiceData.customerContact}\nAlt. Contact: ${invoiceData.customerAlternateNo}\nAadhar: ${invoiceData.customerAadharNo}\nPAN: ${invoiceData.customerPanNo}\nGST: ${invoiceData.customerGstNo}`,
            ],
        ],
    });

    const tableColumn = ["S. No.", "Description", "Particular", "Qty", "Rate", "Amount"];
    const tableRows = [];

    const productRow = ['', 'Yunex - E.Bike', '', invoiceData.quantity, invoiceData.rate.toFixed(2), invoiceData.total.toFixed(2)];
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
        { desc: 'Battery No-1', value: invoiceData.batteryNo1 },
        { desc: 'Battery No-2', value: invoiceData.batteryNo2 },
        { desc: 'Battery No-3', value: invoiceData.batteryNo3 },
        { desc: 'Battery No-4', value: invoiceData.batteryNo4 },
        { desc: 'Battery No-5', value: invoiceData.batteryNo5 },
        { desc: 'Battery No-6', value: invoiceData.batteryNo6 },
    ];

    specs.forEach((spec, index) => {
        const row = [index + 1, spec.desc, spec.value || '', '', '', ''];
        tableRows.push(row);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: (doc as any).lastAutoTable.finalY + 5,
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === 0) {
                 doc.setFont('helvetica', 'bold');
            }
        },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL INVOICE VALUE (IN Rs.): ${invoiceData.total.toFixed(2)}`, 14, finalY + 15);
    
    return doc;
  };

  const handleDownload = (invoice: Invoice) => {
    try {
        const doc = generatePDF(invoice);
        doc.save(`invoice-${invoice.id}.pdf`);
        toast({ title: "Success", description: "PDF downloaded successfully." });
    } catch(e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF." });
    }
  };

  const handleView = (invoice: Invoice) => {
     try {
        const doc = generatePDF(invoice);
        window.open(doc.output('bloburl'), '_blank');
    } catch(e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF." });
    }
  };

  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    const newInvoice: Invoice = {
      ...data,
      id: `YUNEX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date(),
      total: data.quantity * data.rate,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    form.reset();
    toast({
      title: "Invoice Generated!",
      description: "The new invoice has been added to the history.",
    });
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
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Sales Panel</h2>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Branch Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField control={form.control} name="branchName" render={({ field }) => ( <FormItem> <FormLabel>Branch Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchGstNo" render={({ field }) => ( <FormItem> <FormLabel>GST No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchContact" render={({ field }) => ( <FormItem> <FormLabel>Contact</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchAddress" render={({ field }) => ( <FormItem className="md:col-span-2 lg:col-span-3"> <FormLabel>Address</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchCity" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchDistrict" render={({ field }) => ( <FormItem> <FormLabel>District</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchState" render={({ field }) => ( <FormItem> <FormLabel>State</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="branchPinCode" render={({ field }) => ( <FormItem> <FormLabel>Pin Code</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="customerName" render={({ field }) => ( <FormItem> <FormLabel>Customer Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerAddress" render={({ field }) => ( <FormItem className="md:col-span-2"> <FormLabel>Address</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerCity" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerDistrict" render={({ field }) => ( <FormItem> <FormLabel>District</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerState" render={({ field }) => ( <FormItem> <FormLabel>State</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerPinCode" render={({ field }) => ( <FormItem> <FormLabel>Pin Code</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerContact" render={({ field }) => ( <FormItem> <FormLabel>Contact</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerAlternateNo" render={({ field }) => ( <FormItem> <FormLabel>Alternate No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerAadharNo" render={({ field }) => ( <FormItem> <FormLabel>Aadhar No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerPanNo" render={({ field }) => ( <FormItem> <FormLabel>Pan Card No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="customerGstNo" render={({ field }) => ( <FormItem> <FormLabel>GST No.</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
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
                            <TableHead>Customer</TableHead>
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
                                    <TableCell>{invoice.customerName}</TableCell>
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

    