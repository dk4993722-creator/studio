
"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Phone, LogOut, Printer, FileDown, PlusCircle, Trash2, Eye } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const salesInvoiceSchema = z.object({
  invoiceNo: z.string().min(1, "Invoice number is required."),
  invoiceDate: z.string().min(1, "Invoice date is required."),
  customer: z.object({
    name: z.string().min(1, "Customer name is required."),
    address: z.string().min(1, "Address is required."),
    city: z.string().min(1, "City is required."),
    contactNumber: z.string().min(1, "Contact number is required."),
    alternateContact: z.string().optional(),
    age: z.coerce.number().optional(),
    aadhar: z.string().optional(),
    pan: z.string().optional(),
    gst: z.string().optional(),
    financedBy: z.string().optional(),
  }),
  executive: z.object({
    name: z.string().optional(),
    state: z.string().optional(),
  }),
  vehicle: z.object({
    model: z.string().optional(),
    color: z.string().optional(),
    seats: z.coerce.number().optional(),
    chassisNo: z.string().optional(),
    motorNo: z.string().optional(),
    controllerNo: z.string().optional(),
    charger1No: z.string().optional(),
    charger2No: z.string().optional(),
    bookletNo: z.string().optional(),
    batteryType: z.string().optional(),
    batteryMake: z.string().optional(),
    battery1No: z.string().optional(),
    battery2No: z.string().optional(),
    battery3No: z.string().optional(),
    battery4No: z.string().optional(),
    battery5No: z.string().optional(),
    battery6No: z.string().optional(),
  }),
  pricing: z.object({
    exShowroom: z.coerce.number().positive("Ex-showroom price is required."),
    steelGuard: z.coerce.number().min(0).default(0),
    sgstRate: z.coerce.number().min(0).default(2.5),
    cgstRate: z.coerce.number().min(0).default(2.5),
    igstRate: z.coerce.number().min(0).default(5),
  })
});

type SalesInvoiceFormValues = z.infer<typeof salesInvoiceSchema>;

type FullInvoiceData = SalesInvoiceFormValues & {
    sgstAmount: number;
    cgstAmount: number;
    igstAmount: number;
    totalInvoiceValue: number;
    netPayableAmount: number;
};

export default function SalesPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoiceData, setInvoiceData] = useState<FullInvoiceData | null>(null);
  const [invoiceHistory, setInvoiceHistory] = useState<FullInvoiceData[]>([]);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const defaultValues: SalesInvoiceFormValues = {
    invoiceNo: `HE${new Date().getFullYear().toString().slice(-2)}${new Date().getMonth()+1}${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    customer: {
        name: "", address: "", city: "", contactNumber: "",
        alternateContact: "0", age: 0, aadhar: "", pan: "0", gst: "0", financedBy: ""
    },
    executive: { name: "YOGESH PRASAD", state: "JHARKHAND" },
    vehicle: { 
        model: "NEU", color: "SILVER", seats: 2, chassisNo: "", motorNo: "", controllerNo: "",
        charger1No: "", charger2No: "NIL", bookletNo: "0", batteryType: "LEAD ACID BATTERY",
        batteryMake: "MAA LUXMI E-VEHICLE PVT.LTD", battery1No: "", battery2No: "", battery3No: "",
        battery4No: "", battery5No: "", battery6No: "0"
    },
    pricing: { exShowroom: 0, steelGuard: 0, sgstRate: 2.5, cgstRate: 2.5, igstRate: 5 }
  };

  const form = useForm<SalesInvoiceFormValues>({
    resolver: zodResolver(salesInvoiceSchema),
    defaultValues,
  });

  const processInvoiceData = (data: SalesInvoiceFormValues): FullInvoiceData => {
    const exShowroom = data.pricing.exShowroom;
    const isIntraState = true; // Assuming intra-state for this example. Logic can be added to determine this.

    let sgstAmount = 0;
    let cgstAmount = 0;
    let igstAmount = 0;

    if (isIntraState) {
        sgstAmount = exShowroom * (data.pricing.sgstRate / 100);
        cgstAmount = exShowroom * (data.pricing.cgstRate / 100);
    } else {
        igstAmount = exShowroom * (data.pricing.igstRate / 100);
    }
    
    const totalInvoiceValue = exShowroom + sgstAmount + cgstAmount + igstAmount;
    const netPayableAmount = totalInvoiceValue + data.pricing.steelGuard;
    
    return {
      ...data,
      sgstAmount,
      cgstAmount,
      igstAmount,
      totalInvoiceValue,
      netPayableAmount
    };
  };

  const onSubmit = (data: SalesInvoiceFormValues) => {
    const newInvoice = processInvoiceData(data);
    setInvoiceData(newInvoice);
    setInvoiceHistory(prev => [newInvoice, ...prev]);
    toast({ title: "Success", description: "Invoice generated successfully." });
    form.reset({
        ...defaultValues,
        invoiceNo: `HE${new Date().getFullYear().toString().slice(-2)}${new Date().getMonth()+1}${Math.floor(1000 + Math.random() * 9000)}`,
        customer: { name: "", address: "", city: "", contactNumber: "", alternateContact: "0", age: 0, aadhar: "", pan: "0", gst: "0", financedBy: "" },
        vehicle: { ...defaultValues.vehicle, chassisNo: "", motorNo: "", controllerNo: "", charger1No: "", battery1No: "", battery2No: "", battery3No: "", battery4No: "", battery5No: "" },
        pricing: { ...defaultValues.pricing, exShowroom: 0, steelGuard: 0 }
    });
  };
  
  const generateAndDownloadPdf = (invoiceToDownload: FullInvoiceData) => {
    const originalInvoiceData = invoiceData;
    setInvoiceData(invoiceToDownload);

    setTimeout(() => {
        const input = invoiceRef.current;
        if (input) {
            html2canvas(input, { scale: 3 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4', true);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 0;
                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save(`invoice-${invoiceToDownload.invoiceNo}.pdf`);
                setInvoiceData(originalInvoiceData);
            });
        } else {
            setInvoiceData(originalInvoiceData);
        }
    }, 100);
  };
  
  const handleDownloadPdf = () => {
    if (invoiceData) {
        generateAndDownloadPdf(invoiceData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background print:bg-white">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1] print:hidden">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
            <Avatar>
                <AvatarImage src={placeholderImages.placeholderImages[0].imageUrl} alt="User avatar" data-ai-hint={placeholderImages.placeholderImages[0].imageHint} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out">
                <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between print:hidden">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => invoiceData ? setInvoiceData(null) : router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight font-headline">
                    {invoiceData ? "Invoice Preview" : "Create Sales Invoice"}
                </h2>
            </div>
            {invoiceData && (
              <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                  <Button onClick={handleDownloadPdf}><FileDown className="mr-2 h-4 w-4" /> Download</Button>
              </div>
            )}
        </div>

        {!invoiceData ? (
          <>
            <Card className="p-6 md:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="invoiceNo" render={({ field }) => ( <FormItem><FormLabel>Invoice No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="invoiceDate" render={({ field }) => ( <FormItem><FormLabel>Invoice Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <Separator />
                        <h3 className="text-lg font-medium mb-4">Customer Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="customer.name" render={({ field }) => (<FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Textarea {...form.register('customer.address')} /></FormControl><FormMessage /></FormItem>
                            <FormField control={form.control} name="customer.city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.contactNumber" render={({ field }) => (<FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.alternateContact" render={({ field }) => (<FormItem><FormLabel>Alternate No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.aadhar" render={({ field }) => (<FormItem><FormLabel>Aadhar Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.pan" render={({ field }) => (<FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.gst" render={({ field }) => (<FormItem><FormLabel>GST No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="customer.financedBy" render={({ field }) => (<FormItem><FormLabel>If Financed By</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                        <Separator />
                        <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {Object.keys(defaultValues.vehicle).map((key) => (
                             <FormField key={key} control={form.control} name={`vehicle.${key as keyof typeof defaultValues.vehicle}`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace('No', 'No.')}</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                             )} />
                          ))}
                        </div>

                        <Separator />
                        <h3 className="text-lg font-medium mb-4">Pricing</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="pricing.exShowroom" render={({ field }) => (<FormItem><FormLabel>Ex-showroom Price (Rs.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pricing.steelGuard" render={({ field }) => (<FormItem><FormLabel>Steel Guard (Rs.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pricing.cgstRate" render={({ field }) => (<FormItem><FormLabel>CGST Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pricing.sgstRate" render={({ field }) => (<FormItem><FormLabel>SGST Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pricing.igstRate" render={({ field }) => (<FormItem><FormLabel>IGST Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Generate Invoice</Button>
                        </div>
                    </form>
                </Form>
            </Card>

            {invoiceHistory.length > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Invoice History</CardTitle>
                        <CardDescription>View or download previously generated invoices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice No.</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoiceHistory.map((inv) => (
                                    <TableRow key={inv.invoiceNo}>
                                        <TableCell className="font-medium">{inv.invoiceNo}</TableCell>
                                        <TableCell>{new Date(inv.invoiceDate).toLocaleDateString('en-GB')}</TableCell>
                                        <TableCell>{inv.customer.name}</TableCell>
                                        <TableCell className="text-right">₹{inv.netPayableAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" onClick={() => setInvoiceData(inv)}><Eye className="h-4 w-4" /></Button>
                                                <Button variant="secondary" size="icon" onClick={() => generateAndDownloadPdf(inv)}><FileDown className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
          </>
        ) : (
          <div className="print-container">
            <Card className="p-2 md:p-4 text-xs print:shadow-none print:border-none" ref={invoiceRef}>
              <CardContent className="p-2 border border-black">
                <div className="text-center mb-2">
                    <h1 className="font-bold text-lg underline">INVOICE</h1>
                </div>
                <div className="grid grid-cols-3 items-start mb-2">
                    <div className="col-span-1">
                        <p className="font-bold">M/S SharmaG Eco Motors, Jamtara</p>
                        <p><span className="font-bold">GST NO.:</span> 20AYFPP3491F2ZK</p>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <YunexLogo className="h-20 w-20" />
                    </div>
                    <div className="col-span-1 text-xs">
                        <p>PLOT NO 273, APPT TO JB NO.8/KA, MOUZA TILABAD</p>
                        <p>MIHIJAM ROAD, VILL.TILABAD PO.JAMTARA</p>
                        <p><span className="font-bold">CITY:</span> JAMTARA</p>
                        <p><span className="font-bold">STATE:</span> JHARKHAND <span className="font-bold">PIN CODE:</span> 815351</p>
                        <p><span className="font-bold">CONTACT NO.:</span> 8010184617</p>
                        <p><span className="font-bold">E-MAIL:</span> 815351.sha.eco@gmail.com</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 border-t-2 border-b-2 border-black text-xs">
                    <div className="pr-2 border-r border-black">
                        <div className="flex"><p className="w-1/3 font-bold">CUSTOMER NAME:</p><p className="w-2/3">{invoiceData.customer.name}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">ADDRESS:</p><p className="w-2/3">{invoiceData.customer.address}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">CITY:</p><p className="w-2/3">{invoiceData.customer.city}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">CONTACT NUMBER:</p><p className="w-2/3">{invoiceData.customer.contactNumber}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">ALTERNATE NO.:</p><p className="w-2/3">{invoiceData.customer.alternateContact}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">AGE(eg.45 years):</p><p className="w-2/3">{invoiceData.customer.age}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">AADHAR CARD:</p><p className="w-2/3">{invoiceData.customer.aadhar}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">PAN NUMBER:</p><p className="w-2/3">{invoiceData.customer.pan}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">GST NO.:</p><p className="w-2/3">{invoiceData.customer.gst}</p></div>
                        <div className="flex"><p className="w-1/3 font-bold">IF FINANCED BY:</p><p className="w-2/3">{invoiceData.customer.financedBy}</p></div>
                    </div>
                    <div className="pl-2">
                        <div className="flex"><p className="w-1/2 font-bold">INVOICE NO.:</p><p className="w-1/2">{invoiceData.invoiceNo}</p></div>
                        <div className="flex"><p className="w-1/2 font-bold">INVOICE DATE:</p><p className="w-1/2">{new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}</p></div>
                        <div className="flex"><p className="w-1/2 font-bold">VBD(use for executive only):</p><p className="w-1/2">{new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}</p></div>
                        <div className="flex"><p className="w-1/2 font-bold">BILL FOR(use for executive only):</p><p className="w-1/2">J</p></div>
                        <div className="flex"><p className="w-1/2 font-bold">Handled By Executive:</p><p className="w-1/2">{invoiceData.executive.name}</p></div>
                        <div className="flex"><p className="w-1/2 font-bold">STATE:</p><p className="w-1/2">{invoiceData.executive.state}</p></div>
                        <div className="mt-4">
                            <p className="font-bold">12 MONTH WARRANTY</p>
                            <p>BATTERY, MOTOR, CHARGER, CONTROLER</p>
                            <p>BATTERY FULNE KI WARRANTY NAHI HAI</p>
                        </div>
                    </div>
                </div>

                <div className="my-2">
                    <Table className="border-collapse border border-black text-xs">
                        <TableHeader>
                            <TableRow className="bg-white">
                                <TableHead className="border border-black p-1 w-[5%]">S.No.</TableHead>
                                <TableHead className="border border-black p-1 w-[60%]" colSpan={2}>DESCRIPTION</TableHead>
                                <TableHead className="border border-black p-1 text-right w-[15%]">RATE</TableHead>
                                <TableHead className="border border-black p-1 text-right w-[20%]">AMOUNT</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow><TableCell className="border border-black p-1">1</TableCell><TableCell className="border-l border-black p-1 font-bold">MODEL</TableCell><TableCell colSpan={2} className="p-1 text-right border-l border-black">{invoiceData.vehicle.model}</TableCell><TableCell className="border-l border-black p-1 text-right">₹{invoiceData.pricing.exShowroom.toFixed(2)}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">2</TableCell><TableCell className="border-l border-black p-1 font-bold">COLOR</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.color}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">3</TableCell><TableCell className="border-l border-black p-1 font-bold">NO. OF SEAT</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.seats}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">4</TableCell><TableCell className="border-l border-black p-1 font-bold">CHASSIS NO.</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.chassisNo}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">5</TableCell><TableCell className="border-l border-black p-1 font-bold">MOTOR NO.</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.motorNo}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">6</TableCell><TableCell className="border-l border-black p-1 font-bold">CONTROLLER NO.</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.controllerNo}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">7</TableCell><TableCell className="border-l border-black p-1 font-bold">CHARGER NO.:1</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.charger1No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">8</TableCell><TableCell className="border-l border-black p-1 font-bold">CHARGER NO.:2</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.charger2No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">9</TableCell><TableCell className="border-l border-black p-1 font-bold">BOOKLET (OWNERS MANUAL) NO.</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.bookletNo}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1"></TableCell><TableCell className="border-l border-black p-1 font-bold">TYPE OF BATTERY:</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.batteryType}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">10</TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY MAKE:</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.batteryMake}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">11</TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY NO. 1</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.battery1No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">12</TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY NO. 2</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.battery2No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1">13</TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY NO. 3</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.battery3No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1"></TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY NO. 4</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.battery4No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1"></TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY NO. 5</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.battery5No}</TableCell></TableRow>
                            <TableRow><TableCell className="border border-black p-1"></TableCell><TableCell className="border-l border-black p-1 font-bold">BATTERY NO. 6</TableCell><TableCell colSpan={3} className="p-1 text-right border-l border-black">{invoiceData.vehicle.battery6No}</TableCell></TableRow>
                            
                            <TableRow className="border-t-2 border-black">
                                <TableCell colSpan={4} className="p-1 text-right font-bold">TOTAL INVOICE VALUE (IN Rs.)</TableCell>
                                <TableCell className="p-1 text-right font-bold">₹{invoiceData.pricing.exShowroom.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                
                <div className="grid grid-cols-2 text-xs">
                    <div></div>
                    <div className="space-y-1">
                        {invoiceData.sgstAmount > 0 && <div className="flex justify-between border-t border-black pt-1"><p>{invoiceData.pricing.sgstRate}% SGST</p><p>₹{invoiceData.sgstAmount.toFixed(2)}</p></div>}
                        {invoiceData.cgstAmount > 0 && <div className="flex justify-between"><p>{invoiceData.pricing.cgstRate}% CGST</p><p>₹{invoiceData.cgstAmount.toFixed(2)}</p></div>}
                        {invoiceData.igstAmount > 0 && <div className="flex justify-between border-t border-black pt-1"><p>{invoiceData.pricing.igstRate}% IGST</p><p>₹{invoiceData.igstAmount.toFixed(2)}</p></div>}
                        <div className="flex justify-between font-bold border-t border-black pt-1"><p>Ex-showroom Price (Rs.)</p><p>₹{invoiceData.totalInvoiceValue.toFixed(2)}</p></div>
                        <div className="flex justify-between"><p>STEEL GUARD</p><p>₹{invoiceData.pricing.steelGuard.toFixed(2)}</p></div>
                        <div className="flex justify-between font-bold text-sm border-t-2 border-black pt-1"><p>Net Payable Amount (in Rs.)</p><p>₹{invoiceData.netPayableAmount.toFixed(2)}</p></div>
                    </div>
                </div>

              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; font-size: 10px; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
          .print-container .text-lg { font-size: 1rem; }
          .print-container table, .print-container tr, .print-container td, .print-container th {
             border-color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
