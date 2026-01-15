
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Phone, LogOut, Printer, FileDown, PlusCircle, Trash2 } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const itemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  hsn: z.string().min(1, "HSN is required."),
  qty: z.coerce.number().positive("Quantity must be positive."),
  rate: z.coerce.number().positive("Rate must be positive."),
});

const salesInvoiceSchema = z.object({
  buyer: z.object({
    name: z.string().min(1, "Buyer name is required."),
    address: z.string().min(1, "Buyer address is required."),
    gstin: z.string().min(1, "Buyer GSTIN is required."),
    state: z.string().min(1, "Buyer state is required."),
  }),
  invoiceNo: z.string().min(1, "Invoice number is required."),
  invoiceDate: z.string().min(1, "Invoice date is required."),
  deliveryNote: z.string().optional(),
  paymentTerms: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required."),
});

type SalesInvoiceFormValues = z.infer<typeof salesInvoiceSchema>;

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
            str += 'and ' + convert(decimal) + 'Paise ';
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
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const defaultInvoice = {
    seller: {
      name: "YUNEX",
      address: "Near D.C. Office, Satyam Nagar, Dhanbad, Jharkhand, INDIA. 826004",
      gstin: "20AAAAA0000A1Z5",
      state: "Jharkhand (Code: 20)",
    },
  };

  const form = useForm<SalesInvoiceFormValues>({
    resolver: zodResolver(salesInvoiceSchema),
    defaultValues: {
      buyer: { name: "", address: "", gstin: "", state: "Jharkhand (Code: 20)" },
      invoiceNo: `YUNEX-${Math.floor(100 + Math.random() * 900)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentTerms: "Due on Receipt",
      items: [{ description: "", hsn: "", qty: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: SalesInvoiceFormValues) => {
    const itemsWithAmount = data.items.map((item, index) => ({
      ...item,
      sno: index + 1,
      amount: item.qty * item.rate,
    }));

    const taxableValue = itemsWithAmount.reduce((acc, item) => acc + item.amount, 0);
    const cgstRate = 9;
    const sgstRate = 9;
    const cgstAmount = (taxableValue * cgstRate) / 100;
    const sgstAmount = (taxableValue * sgstRate) / 100;
    const totalTax = cgstAmount + sgstAmount;
    const totalAmount = taxableValue + totalTax;
    const amountInWords = numberToWords(totalAmount);

    setInvoiceData({
      ...defaultInvoice,
      ...data,
      items: itemsWithAmount,
      taxableValue,
      cgstRate,
      sgstRate,
      cgstAmount,
      sgstAmount,
      totalTax,
      totalAmount,
      amountInWords,
    });

    toast({ title: "Success", description: "Sales invoice generated successfully." });
  };
  
  const handleDownloadPdf = () => {
    const input = invoiceRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`invoice-${invoiceData.invoiceNo}.pdf`);
      });
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
                    {invoiceData ? "Sales Invoice" : "Create Sales Invoice"}
                </h2>
            </div>
            {invoiceData && (
              <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}>
                      <Printer className="mr-2" /> Print
                  </Button>
                  <Button onClick={handleDownloadPdf}>
                      <FileDown className="mr-2" /> Download
                  </Button>
              </div>
            )}
        </div>

        {!invoiceData ? (
          <Card className="p-6 md:p-8">
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                          <div>
                              <h3 className="text-lg font-medium mb-4">Buyer Details</h3>
                              <div className="space-y-4">
                                  <FormField control={form.control} name="buyer.name" render={({ field }) => ( <FormItem><FormLabel>Buyer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="buyer.address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="buyer.gstin" render={({ field }) => ( <FormItem><FormLabel>GSTIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="buyer.state" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              </div>
                          </div>
                          <div>
                              <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
                              <div className="space-y-4">
                                  <FormField control={form.control} name="invoiceNo" render={({ field }) => ( <FormItem><FormLabel>Invoice No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="invoiceDate" render={({ field }) => ( <FormItem><FormLabel>Invoice Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="deliveryNote" render={({ field }) => ( <FormItem><FormLabel>Delivery Note (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                  <FormField control={form.control} name="paymentTerms" render={({ field }) => ( <FormItem><FormLabel>Payment Terms (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              </div>
                          </div>
                      </div>

                      <Separator />

                      <div>
                          <h3 className="text-lg font-medium mb-4">Items</h3>
                          <div className="space-y-4">
                              {fields.map((item, index) => (
                                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-10 gap-2 items-start">
                                      <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem className="md:col-span-3"><FormLabel className={index !== 0 ? 'hidden' : ''}>Description</FormLabel><FormControl><Input {...field} placeholder="Item description" /></FormControl><FormMessage /></FormItem>)} />
                                      <FormField control={form.control} name={`items.${index}.hsn`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className={index !== 0 ? 'hidden' : ''}>HSN/SAC</FormLabel><FormControl><Input {...field} placeholder="HSN code" /></FormControl><FormMessage /></FormItem>)} />
                                      <FormField control={form.control} name={`items.${index}.qty`} render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel className={index !== 0 ? 'hidden' : ''}>Qty</FormLabel><FormControl><Input type="number" {...field} placeholder="1" /></FormControl><FormMessage /></FormItem>)} />
                                      <FormField control={form.control} name={`items.${index}.rate`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className={index !== 0 ? 'hidden' : ''}>Rate</FormLabel><FormControl><Input type="number" {...field} placeholder="0.00" /></FormControl><FormMessage /></FormItem>)} />
                                      <div className="md:col-span-1">
                                          <FormLabel className={index !== 0 ? 'hidden' : 'hidden md:block'}>&nbsp;</FormLabel>
                                          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-4 w-4" /></Button>
                                      </div>
                                  </div>
                              ))}
                              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", hsn: "", qty: 1, rate: 0 })}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                              </Button>
                          </div>
                      </div>

                      <div className="flex justify-end pt-4">
                          <Button type="submit">Generate Invoice</Button>
                      </div>
                  </form>
              </Form>
          </Card>
        ) : (
          <div className="print-container">
            <Card className="p-6 md:p-8 print:shadow-none print:border-none" ref={invoiceRef}>
              <CardContent className="p-0">
                  <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                          <YunexLogo className="h-16 w-16" />
                          <div>
                              <h3 className="text-2xl font-bold font-headline">{invoiceData.seller.name}</h3>
                              <p className="text-sm text-muted-foreground">{invoiceData.seller.address}</p>
                              <p className="text-sm text-muted-foreground">GSTIN: {invoiceData.seller.gstin}</p>
                          </div>
                      </div>
                      <div className="text-center">
                          <h2 className="text-2xl font-bold text-primary">TAX INVOICE</h2>
                          <p className="text-sm">(Original for Recipient)</p>
                      </div>
                  </div>

                  <Separator className="my-4"/>

                  <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                          <p className="font-semibold">Billed To:</p>
                          <p className="font-bold">{invoiceData.buyer.name}</p>
                          <p>{invoiceData.buyer.address}</p>
                          <p>GSTIN: {invoiceData.buyer.gstin}</p>
                          <p>State: {invoiceData.buyer.state}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <p className="font-semibold">Invoice No:</p>
                          <p>{invoiceData.invoiceNo}</p>
                          <p className="font-semibold">Invoice Date:</p>
                          <p>{new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}</p>
                          {invoiceData.deliveryNote && <>
                            <p className="font-semibold">Delivery Note:</p>
                            <p>{invoiceData.deliveryNote}</p>
                          </>}
                          {invoiceData.paymentTerms && <>
                            <p className="font-semibold">Payment Terms:</p>
                            <p>{invoiceData.paymentTerms}</p>
                          </>}
                      </div>
                  </div>

                  <div className="overflow-x-auto">
                      <Table className="border">
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="w-[50px]">S.No</TableHead>
                                  <TableHead>Description of Goods</TableHead>
                                  <TableHead>HSN/SAC</TableHead>
                                  <TableHead className="text-right">Qty</TableHead>
                                  <TableHead className="text-right">Rate</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {invoiceData.items.map((item: any) => (
                                  <TableRow key={item.sno}>
                                      <TableCell>{item.sno}</TableCell>
                                      <TableCell>{item.description}</TableCell>
                                      <TableCell>{item.hsn}</TableCell>
                                      <TableCell className="text-right">{item.qty}</TableCell>
                                      <TableCell className="text-right">₹{item.rate.toFixed(2)}</TableCell>
                                      <TableCell className="text-right">₹{item.amount.toFixed(2)}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1 text-sm">
                          <p><span className="font-semibold">Amount in words:</span> {invoiceData.amountInWords}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                              <p>Taxable Value</p>
                              <p className="font-semibold">₹{invoiceData.taxableValue.toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>CGST @{invoiceData.cgstRate}%</p>
                              <p>₹{invoiceData.cgstAmount.toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>SGST @{invoiceData.sgstRate}%</p>
                              <p>₹{invoiceData.sgstAmount.toFixed(2)}</p>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-base">
                              <p>Total Amount</p>
                              <p>₹{invoiceData.totalAmount.toFixed(2)}</p>
                          </div>
                      </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-xs text-muted-foreground">
                      <p className="font-semibold">Terms & Conditions:</p>
                      <ol className="list-decimal list-inside">
                          <li>Goods once sold will not be taken back.</li>
                          <li>Interest @18% p.a. will be charged on overdue bills.</li>
                          <li>This is a computer-generated invoice.</li>
                      </ol>
                  </div>

                  <div className="mt-8 flex justify-between items-end">
                      <div>
                          <p>Bank Details:</p>
                          <p className="text-sm">Bank Name: State Bank of India</p>
                          <p className="text-sm">A/C No: 1234567890</p>
                          <p className="text-sm">IFSC: SBIN0001234</p>
                      </div>
                      <div className="text-center">
                          <p className="font-bold">For YUNEX</p>
                          <div className="h-16"></div>
                          <p className="border-t pt-1">Authorised Signatory</p>
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
        }
      `}</style>
    </div>
  );
}
