
"use client";

import { useRef, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const itemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  hsn: z.string().min(1, "HSN is required."),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  rateIncTax: z.coerce.number().positive("Rate must be positive."),
  discount: z.coerce.number().min(0).max(100).default(0),
});

const salesInvoiceSchema = z.object({
  billingFrom: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    gstin: z.string().min(1),
    state: z.string().min(1),
    stateCode: z.string().min(1)
  }),
  shippingFrom: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    gstin: z.string().min(1),
    state: z.string().min(1),
    stateCode: z.string().min(1)
  }),
  billedTo: z.object({
    name: z.string().min(1, "Receiver name is required."),
    address: z.string().min(1, "Receiver address is required."),
    gstin: z.string().min(1, "Receiver GSTIN is required."),
    state: z.string().min(1, "Receiver state is required."),
    stateCode: z.string().min(1, "Receiver state code is required."),
    placeOfSupply: z.string().min(1, "Place of supply is required.")
  }),
  shippedTo: z.object({
    name: z.string().min(1, "Shipping name is required."),
    address: z.string().min(1, "Shipping address is required."),
    gstin: z.string().min(1, "Shipping GSTIN is required."),
    state: z.string().min(1, "Shipping state is required."),
    stateCode: z.string().min(1, "Shipping state code is required.")
  }),
  invoiceNo: z.string().min(1, "Invoice number is required."),
  invoiceDate: z.string().min(1, "Invoice date is required."),
  paymentTerms: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required."),
  gstRate: z.coerce.number().min(0, "GST Rate cannot be negative").default(18),
  insuranceCharges: z.coerce.number().min(0).default(0),
  transportCharges: z.coerce.number().min(0).default(0),
  roundOff: z.coerce.number().default(0),
  termsAndCondition: z.string().optional(),
  bankDetails: z.object({
    bankName: z.string(),
    accountName: z.string(),
    accountNo: z.string(),
    ifscCode: z.string(),
  }),
  sameAsBilledTo: z.boolean().default(true),
});

type SalesInvoiceFormValues = z.infer<typeof salesInvoiceSchema>;
type FullInvoiceData = SalesInvoiceFormValues & {
    sno?: number;
    items: (z.infer<typeof itemSchema> & { sno: number; rate: number; amount: number; taxableValue: number; })[];
    totalValue: number;
    taxableValue: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalTax: number;
    totalAmount: number;
    amountInWords: string;
};

const numberToWords = (num: number) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const transform = (n: string) => {
        let str = '';
        const [whole, decimal] = n.split('.');
        if (parseInt(whole) > 0) {
            str += convert(whole) + 'Rupees ';
        }
        if (decimal && parseInt(decimal) > 0) {
            str += 'and ' + convert(decimal.substring(0,2)) + 'Paise ';
        }
        return str.trim() + ' Only';
    };
    const convert = (n: string) => {
        if (n.length > 9) return 'overflow';
        const num = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!num) return '';
        let str = '';
        str += (parseInt(num[1]) !== 0) ? (a[Number(num[1])] || b[num[1][0]] + ' ' + a[num[1][1]]) + 'Crore ' : '';
        str += (parseInt(num[2]) !== 0) ? (a[Number(num[2])] || b[num[2][0]] + ' ' + a[num[2][1]]) + 'Lakh ' : '';
        str += (parseInt(num[3]) !== 0) ? (a[Number(num[3])] || b[num[3][0]] + ' ' + a[num[3][1]]) + 'Thousand ' : '';
        str += (parseInt(num[4]) !== 0) ? (a[Number(num[4])] || b[num[4][0]] + ' ' + a[num[4][1]]) + 'Hundred ' : '';
        str += (parseInt(num[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(num[5])] || b[num[5][0]] + ' ' + a[num[5][1]]) : '';
        return str;
    };
    return transform(num.toFixed(2));
};


export default function SalesPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoiceData, setInvoiceData] = useState<FullInvoiceData | null>(null);
  const [invoiceHistory, setInvoiceHistory] = useState<FullInvoiceData[]>([]);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const defaultValues = {
    billingFrom: {
      name: "Maa Luxmi E-Vehicles Private Limited",
      address: "Purba Memari, Bardhaman-713146, IN",
      gstin: "19AANCM0950F1ZD",
      state: "West Bengal",
      stateCode: "19",
    },
    shippingFrom: {
      name: "West Bengal Warehouse",
      address: "Bagila More, GT Road, Memari, Purba, Bardhaman-713146",
      gstin: "19AANCM0950F1ZD",
      state: "West Bengal",
      stateCode: "19",
    },
    billedTo: { name: "", address: "", gstin: "", state: "", stateCode: "", placeOfSupply: ""},
    shippedTo: { name: "", address: "", gstin: "", state: "", stateCode: ""},
    invoiceNo: `WB-PI/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: "Net-30",
    items: [{ description: "", hsn: "", quantity: 1, rateIncTax: 0, discount: 0 }],
    gstRate: 5,
    insuranceCharges: 0,
    transportCharges: 0,
    roundOff: 0,
    termsAndCondition: "The order will be confirmed upon receipt of a 30% payment.\nProduction will begin after the remaining 70% payment is made against the Proforma Invoice.\nDelivery time is a minimum of 15 days for fewer than 20 vehicles and 7 to 10 days for 20 or more vehicles.",
    bankDetails: {
      bankName: "AXIS Bank Ltd",
      accountName: "Maa Luxmi E-Vehicles Pvt Ltd",
      accountNo: "920020040809860",
      ifscCode: "UTIB0000609"
    },
    sameAsBilledTo: true,
  }

  const form = useForm<SalesInvoiceFormValues>({
    resolver: zodResolver(salesInvoiceSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const sameAsBilledTo = form.watch("sameAsBilledTo");
  const billedToValues = form.watch("billedTo");

  React.useEffect(() => {
    if (sameAsBilledTo) {
      form.setValue("shippedTo", billedToValues);
    } else {
        form.setValue("shippedTo", { name: "", address: "", gstin: "", state: "", stateCode: "" });
    }
  }, [sameAsBilledTo, billedToValues, form]);


  const processInvoiceData = (data: SalesInvoiceFormValues): FullInvoiceData => {
    const gstRate = data.gstRate / 100;

    const itemsWithCalculations = data.items.map((item, index) => {
      const rate = item.rateIncTax / (1 + gstRate);
      const grossAmount = rate * item.quantity;
      const discountAmount = grossAmount * (item.discount / 100);
      const amount = grossAmount - discountAmount;
      return {
        ...item,
        sno: index + 1,
        rate: rate,
        amount: amount,
        taxableValue: amount,
      };
    });

    const totalValue = itemsWithCalculations.reduce((acc, item) => acc + item.amount, 0);

    const taxableValue = totalValue + data.insuranceCharges + data.transportCharges;
    
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    const isIntraState = data.billingFrom.stateCode === data.billedTo.stateCode;

    if(isIntraState) {
        cgstAmount = (taxableValue * (gstRate/2));
        sgstAmount = (taxableValue * (gstRate/2));
    } else {
        igstAmount = taxableValue * gstRate;
    }
    
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const totalAmount = taxableValue + totalTax + data.roundOff;
    const amountInWords = numberToWords(totalAmount);

    return {
      ...data,
      items: itemsWithCalculations,
      totalValue,
      taxableValue,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalTax,
      totalAmount,
      amountInWords,
    };
  };

  const onSubmit = (data: SalesInvoiceFormValues) => {
    const newInvoice = processInvoiceData(data);
    setInvoiceData(newInvoice);
    setInvoiceHistory(prev => [newInvoice, ...prev]);
    toast({ title: "Success", description: "Proforma invoice generated successfully." });
    form.reset({
        ...defaultValues,
        invoiceNo: `WB-PI/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`,
        billedTo: { name: "", address: "", gstin: "", state: "", stateCode: "", placeOfSupply: ""},
        shippedTo: { name: "", address: "", gstin: "", state: "", stateCode: ""},
        items: [{ description: "", hsn: "", quantity: 1, rateIncTax: 0, discount: 0 }],
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
                pdf.save(`proforma-invoice-${invoiceToDownload.invoiceNo}.pdf`);
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
        <div className="flex items-center justify-between print:hidden">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => invoiceData ? setInvoiceData(null) : router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight font-headline">
                    {invoiceData ? "Proforma Invoice" : "Create Proforma Invoice"}
                </h2>
            </div>
            {invoiceData && (
              <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" /> Print
                  </Button>
                  <Button onClick={handleDownloadPdf}>
                      <FileDown className="mr-2 h-4 w-4" /> Download
                  </Button>
              </div>
            )}
        </div>

        {!invoiceData ? (
          <>
            <Card className="p-6 md:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="invoiceNo" render={({ field }) => ( <FormItem><FormLabel>Proforma Invoice No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="invoiceDate" render={({ field }) => ( <FormItem><FormLabel>Proforma Invoice Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-4">Receiver Details (Billed To)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="billedTo.name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} placeholder="M/S Sharmag Eco Motors" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="billedTo.gstin" render={({ field }) => ( <FormItem><FormLabel>GSTIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Textarea {...form.register('billedTo.address')} placeholder="Vill Tilabad Po. Jamtara..." /></FormControl><FormMessage /></FormItem>
                                <FormField control={form.control} name="billedTo.state" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} placeholder="Jharkhand" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="billedTo.stateCode" render={({ field }) => ( <FormItem><FormLabel>State Code</FormLabel><FormControl><Input {...field} placeholder="20" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="billedTo.placeOfSupply" render={({ field }) => ( <FormItem className="md:col-span-2"><FormLabel>Place of Supply</FormLabel><FormControl><Input {...field} placeholder="Jharkhand" /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </div>

                        <Separator />

                        <div>
                          <Controller
                              control={form.control}
                              name="sameAsBilledTo"
                              render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                          <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                          />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                          <FormLabel>Shipping address is same as billing address</FormLabel>
                                      </div>
                                  </FormItem>
                              )}
                          />
                        </div>
                        
                        {!sameAsBilledTo && (
                          <>
                          <Separator />
                          <div>
                              <h3 className="text-lg font-medium mb-4">Shipping Details (Shipped To)</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                  <FormField control={form.control} name="shippedTo.name" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="shippedTo.gstin" render={({ field }) => ( <FormItem><FormLabel>GSTIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Textarea {...form.register('shippedTo.address')} /></FormControl><FormMessage /></FormItem>
                                  <FormField control={form.control} name="shippedTo.state" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="shippedTo.stateCode" render={({ field }) => ( <FormItem><FormLabel>State Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              </div>
                          </div>
                          </>
                        )}


                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-4">Items</h3>
                            <div className="space-y-4">
                                {fields.map((item, index) => (
                                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                                        <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem className="md:col-span-4"><FormLabel className={index !== 0 ? 'hidden md:block' : ''}>Description</FormLabel><FormControl><Input {...field} placeholder="Item description" /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`items.${index}.hsn`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className={index !== 0 ? 'hidden md:block' : ''}>HSN/SAC</FormLabel><FormControl><Input {...field} placeholder="HSN code" /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel className={index !== 0 ? 'hidden md:block' : ''}>Qty</FormLabel><FormControl><Input type="number" {...field} placeholder="1" /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`items.${index}.rateIncTax`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className={index !== 0 ? 'hidden md:block' : ''}>Rate (Inc. Tax)</FormLabel><FormControl><Input type="number" {...field} placeholder="0.00" /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`items.${index}.discount`} render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel className={index !== 0 ? 'hidden md:block' : ''}>Disc %</FormLabel><FormControl><Input type="number" {...field} placeholder="0" /></FormControl><FormMessage /></FormItem>)} />
                                        <div className="md:col-span-1">
                                            <FormLabel className={index !== 0 ? 'hidden' : 'hidden md:block'}>&nbsp;</FormLabel>
                                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", hsn: "", quantity: 1, rateIncTax: 0, discount: 0 })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-4">Charges & Taxes</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField control={form.control} name="gstRate" render={({ field }) => ( <FormItem><FormLabel>GST Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="insuranceCharges" render={({ field }) => ( <FormItem><FormLabel>Insurance Charges</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="transportCharges" render={({ field }) => ( <FormItem><FormLabel>Transport Charges</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="roundOff" render={({ field }) => ( <FormItem><FormLabel>Round Off</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="paymentTerms" render={({ field }) => ( <FormItem><FormLabel>Payment Terms</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
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
                                    <TableHead>Buyer Name</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoiceHistory.map((inv) => (
                                    <TableRow key={inv.invoiceNo}>
                                        <TableCell className="font-medium">{inv.invoiceNo}</TableCell>
                                        <TableCell>{new Date(inv.invoiceDate).toLocaleDateString('en-GB')}</TableCell>
                                        <TableCell>{inv.billedTo.name}</TableCell>
                                        <TableCell className="text-right">₹{inv.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" onClick={() => setInvoiceData(inv)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="secondary" size="icon" onClick={() => generateAndDownloadPdf(inv)}>
                                                    <FileDown className="h-4 w-4" />
                                                </Button>
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
            <Card className="p-4 md:p-6 text-sm print:shadow-none print:border-none" ref={invoiceRef}>
              <CardContent className="p-0">
                    <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2">
                        <div className="w-2/3">
                            <h2 className="text-2xl font-bold">{invoiceData.billingFrom.name}</h2>
                            <p>{invoiceData.billingFrom.address}</p>
                            <p>Ph.No: Email: finance@yakuzaev.com</p>
                            <p>Website: www.yakuzaev.com</p>
                            <p>PAN No.: {invoiceData.billingFrom.gstin.substring(2, 12)} GSTIN: {invoiceData.billingFrom.gstin}</p>
                        </div>
                        <div className="w-1/3 flex flex-col items-center">
                            <h3 className="text-lg font-bold">Proforma Invoice</h3>
                            <p className="text-xs">For Customer</p>
                            <YunexLogo className="h-20 w-20 mt-2"/>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <p><span className="font-bold">Proforma Invoice No:</span> {invoiceData.invoiceNo}</p>
                        <p><span className="font-bold">Proforma Invoice Date:</span> {new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-l border-r">
                        <div className="p-2 border-r">
                            <p className="font-bold">Name & Address of (Billing From):</p>
                            <p className="font-bold">{invoiceData.billingFrom.name}</p>
                            <p>{invoiceData.billingFrom.address}</p>
                            <p>IN GSTIN No.: {invoiceData.billingFrom.gstin}</p>
                            <p>State Name: {invoiceData.billingFrom.state} State Code: {invoiceData.billingFrom.stateCode}</p>
                        </div>
                        <div className="p-2">
                            <p className="font-bold">Name & Address of Receiver (Billed To):</p>
                            <p className="font-bold">{invoiceData.billedTo.name}</p>
                            <p>{invoiceData.billedTo.address}</p>
                            <p>GSTIN No.: {invoiceData.billedTo.gstin}</p>
                            <p>State Name: {invoiceData.billedTo.state} State Code: {invoiceData.billedTo.stateCode}</p>
                            <p>Place of Supply: {invoiceData.billedTo.placeOfSupply}</p>
                        </div>
                        <div className="p-2 border-t border-r">
                            <p className="font-bold">Name & Address of (Shipping From):</p>
                            <p className="font-bold">{invoiceData.shippingFrom.name}</p>
                            <p>{invoiceData.shippingFrom.address}</p>
                            <p>GSTIN No.: {invoiceData.shippingFrom.gstin}</p>
                            <p>State Name: {invoiceData.shippingFrom.state} State Code: {invoiceData.shippingFrom.stateCode}</p>
                        </div>
                         <div className="p-2 border-t">
                            <p className="font-bold">Name & Address of Receiver (Shipped To):</p>
                            <p className="font-bold">{invoiceData.shippedTo.name}</p>
                            <p>{invoiceData.shippedTo.address}</p>
                            <p>GSTIN No.: {invoiceData.shippedTo.gstin}</p>
                            <p>State Name: {invoiceData.shippedTo.state} State Code: {invoiceData.shippedTo.stateCode}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto my-4">
                      <Table className="border text-xs">
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="p-1">SNO.</TableHead>
                                  <TableHead className="p-1">Description of Goods</TableHead>
                                  <TableHead className="p-1">HSN/SAC</TableHead>
                                  <TableHead className="p-1 text-right">Quantity</TableHead>
                                  <TableHead className="p-1">UOM</TableHead>
                                  <TableHead className="p-1 text-right">Rate (Inc. of Tax)</TableHead>
                                  <TableHead className="p-1 text-right">Rate</TableHead>
                                  <TableHead className="p-1 text-right">Disc. (%)</TableHead>
                                  <TableHead className="p-1 text-right">Amount</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {invoiceData.items.map((item: any) => (
                                  <TableRow key={item.sno}>
                                      <TableCell className="p-1">{item.sno}</TableCell>
                                      <TableCell className="p-1">{item.description}</TableCell>
                                      <TableCell className="p-1">{item.hsn}</TableCell>
                                      <TableCell className="p-1 text-right">{item.quantity.toFixed(2)}</TableCell>
                                      <TableCell className="p-1">NOS</TableCell>
                                      <TableCell className="p-1 text-right">₹{item.rateIncTax.toFixed(2)}</TableCell>
                                      <TableCell className="p-1 text-right">₹{item.rate.toFixed(2)}</TableCell>
                                      <TableCell className="p-1 text-right">{item.discount.toFixed(2)}</TableCell>
                                      <TableCell className="p-1 text-right">₹{item.amount.toFixed(2)}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                    </div>
                  
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p><span className="font-bold">Destination:</span> {invoiceData.billedTo.state}</p>
                            <p><span className="font-bold">Terms of Payment:</span> {invoiceData.paymentTerms}</p>
                            <div className="mt-2">
                                <p className="font-bold">Terms & Condition:</p>
                                <p className="whitespace-pre-line">{invoiceData.termsAndCondition}</p>
                            </div>
                             <div className="mt-2">
                                <p className="font-bold">Total in Words:</p>
                                <p>{invoiceData.amountInWords}</p>
                            </div>
                        </div>
                        <div className="border p-1">
                            <div className="flex justify-between"><p>Total Value</p><p>₹{invoiceData.totalValue.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>Round Off</p><p>₹{invoiceData.roundOff.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>Transport Charges</p><p>₹{invoiceData.transportCharges.toFixed(2)}</p></div>
                            <div className="flex justify-between border-b pb-1"><p>Insurance Charges</p><p>₹{invoiceData.insuranceCharges.toFixed(2)}</p></div>
                            <div className="flex justify-between font-bold"><p>Taxable Value</p><p>₹{invoiceData.taxableValue.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>CGST</p><p>₹{invoiceData.cgstAmount.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>SGST</p><p>₹{invoiceData.sgstAmount.toFixed(2)}</p></div>
                            <div className="flex justify-between border-b pb-1"><p>IGST</p><p>₹{invoiceData.igstAmount.toFixed(2)}</p></div>
                            <div className="flex justify-between font-bold text-sm"><p>Total Value</p><p>₹{invoiceData.totalAmount.toFixed(2)}</p></div>
                        </div>
                    </div>
                    
                    <div className="text-xs mt-2">
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="p-1">HSN</TableHead>
                                    <TableHead className="p-1">GST %</TableHead>
                                    <TableHead className="p-1">SGST</TableHead>
                                    <TableHead className="p-1">CGST</TableHead>
                                    <TableHead className="p-1">IGST</TableHead>
                                    <TableHead className="p-1">Taxable Value</TableHead>
                                    <TableHead className="p-1">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="p-1">{invoiceData.items[0]?.hsn}</TableCell>
                                    <TableCell className="p-1">{invoiceData.gstRate.toFixed(2)}%</TableCell>
                                    <TableCell className="p-1">₹{invoiceData.sgstAmount.toFixed(2)}</TableCell>
                                    <TableCell className="p-1">₹{invoiceData.cgstAmount.toFixed(2)}</TableCell>
                                    <TableCell className="p-1">₹{invoiceData.igstAmount.toFixed(2)}</TableCell>
                                    <TableCell className="p-1">₹{invoiceData.taxableValue.toFixed(2)}</TableCell>
                                    <TableCell className="p-1">₹{invoiceData.totalTax.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="text-xs mt-2">
                        <p><span className="font-bold">E-Way-Bill No:</span></p>
                        <p><span className="font-bold">E-Way-Date:</span></p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <p className="font-bold">Bank Details:</p>
                            <p><span className="font-bold">Bank Name:</span> {invoiceData.bankDetails.bankName}</p>
                            <p><span className="font-bold">Account Name:</span> {invoiceData.bankDetails.accountName}</p>
                            <p><span className="font-bold">Account No.:</span> {invoiceData.bankDetails.accountNo}</p>
                            <p><span className="font-bold">IFSC Code:</span> {invoiceData.bankDetails.ifscCode}</p>
                        </div>
                        <div className="flex flex-col justify-between items-center text-center">
                            <p className="font-bold">For {invoiceData.billingFrom.name}</p>
                            <div className="h-16"></div>
                            <p className="border-t w-full pt-1">Authorized Signatory</p>
                        </div>
                    </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            font-size: 8px;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-container .text-2xl { font-size: 1.2rem; }
          .print-container .text-lg { font-size: 0.9rem; }
          .print-container .text-sm { font-size: 0.7rem; }
          .print-container .text-xs { font-size: 0.6rem; }

        }
      `}</style>
    </div>
  );
}

