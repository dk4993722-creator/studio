
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LogOut, Building, User, Car, Download, Eye, Printer } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, forwardRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const salesFormSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  gstNo: z.string().min(1, "GST No. is required"),
  address: z.string().min(1, "Address is required"),
  pinCode: z.string().min(1, "Pin code is required"),
  contactDetails: z.string().min(1, "Contact details are required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerCity: z.string().min(1, "City is required"),
  customerContact: z.string().min(1, "Contact is required"),
  customerAltContact: z.string().optional(),
  customerAge: z.coerce.number().positive().optional(),
  customerAadhar: z.string().optional(),
  customerPan: z.string().optional(),
  customerGst: z.string().optional(),
  modalNo: z.string().min(1, "Modal No. is required"),
  color: z.string().min(1, "Color is required"),
  noOfSeat: z.coerce.number().positive(),
  chassisNo: z.string().min(1, "Chassis No. is required"),
  controllerNo: z.string().min(1, "Controller No. is required"),
  chargerNo1: z.string().optional(),
  chargerNo2: z.string().optional(),
  typeOfBattery: z.string().min(1, "Battery type is required"),
  batteryNo1: z.string().optional(),
  batteryNo2: z.string().optional(),
  batteryNo3: z.string().optional(),
  batteryNo4: z.string().optional(),
  batteryNo5: z.string().optional(),
  batteryNo6: z.string().optional(),
});

type SalesFormData = z.infer<typeof salesFormSchema>;

interface Invoice extends SalesFormData {
  id: number;
  date: string;
}

const InvoiceComponent = forwardRef<HTMLDivElement, { invoiceData: Invoice }>(({ invoiceData }, ref) => {
    return (
        <div ref={ref} className="p-8 bg-white text-black">
            <h1 className="text-2xl font-bold text-center mb-4">INVOICE</h1>
            <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
                <div>
                    <h2 className="font-bold">Branch Details</h2>
                    <p>{invoiceData.branchName}</p>
                    <p>{invoiceData.address}, {invoiceData.pinCode}</p>
                    <p>GST: {invoiceData.gstNo}</p>
                    <p>Contact: {invoiceData.contactDetails}</p>
                </div>
                <div>
                    <h2 className="font-bold">Invoice Details</h2>
                    <p>Invoice #: {invoiceData.id}</p>
                    <p>Date: {invoiceData.date}</p>
                </div>
            </div>
            <div className="border-b pb-4 mb-4">
                <h2 className="font-bold">Customer Details</h2>
                <p>{invoiceData.customerName}</p>
                <p>{invoiceData.customerAddress}, {invoiceData.customerCity}</p>
                <p>Contact: {invoiceData.customerContact}</p>
                {invoiceData.customerAltContact && <p>Alt Contact: {invoiceData.customerAltContact}</p>}
                {invoiceData.customerAge && <p>Age: {invoiceData.customerAge}</p>}
                {invoiceData.customerAadhar && <p>Aadhar: {invoiceData.customerAadhar}</p>}
                {invoiceData.customerPan && <p>PAN: {invoiceData.customerPan}</p>}
                {invoiceData.customerGst && <p>GST: {invoiceData.customerGst}</p>}
            </div>
            <div>
                <h2 className="font-bold mb-2">Vehicle Details</h2>
                <table className="w-full text-sm">
                    <tbody>
                        <tr><td className="font-semibold pr-4">Modal No:</td><td>{invoiceData.modalNo}</td></tr>
                        <tr><td className="font-semibold pr-4">Color:</td><td>{invoiceData.color}</td></tr>
                        <tr><td className="font-semibold pr-4">No of Seats:</td><td>{invoiceData.noOfSeat}</td></tr>
                        <tr><td className="font-semibold pr-4">Chassis No:</td><td>{invoiceData.chassisNo}</td></tr>
                        <tr><td className="font-semibold pr-4">Controller No:</td><td>{invoiceData.controllerNo}</td></tr>
                        <tr><td className="font-semibold pr-4">Charger No-1:</td><td>{invoiceData.chargerNo1}</td></tr>
                        <tr><td className="font-semibold pr-4">Charger No-2:</td><td>{invoiceData.chargerNo2}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery Type:</td><td>{invoiceData.typeOfBattery}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery No 1:</td><td>{invoiceData.batteryNo1}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery No 2:</td><td>{invoiceData.batteryNo2}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery No 3:</td><td>{invoiceData.batteryNo3}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery No 4:</td><td>{invoiceData.batteryNo4}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery No 5:</td><td>{invoiceData.batteryNo5}</td></tr>
                        <tr><td className="font-semibold pr-4">Battery No 6:</td><td>{invoiceData.batteryNo6}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
});
InvoiceComponent.displayName = 'InvoiceComponent';


export default function SalesPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof salesFormSchema>>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      branchName: "",
      gstNo: "",
      address: "",
      pinCode: "",
      contactDetails: "",
      customerName: "",
      customerAddress: "",
      customerCity: "",
      customerContact: "",
      customerAltContact: "",
      customerAge: undefined,
      customerAadhar: "",
      customerPan: "",
      customerGst: "",
      modalNo: "",
      color: "",
      noOfSeat: undefined,
      chassisNo: "",
      controllerNo: "",
      chargerNo1: "",
      chargerNo2: "",
      typeOfBattery: "",
      batteryNo1: "",
      batteryNo2: "",
      batteryNo3: "",
      batteryNo4: "",
      batteryNo5: "",
      batteryNo6: "",
    },
  });

  function onSubmit(values: z.infer<typeof salesFormSchema>) {
    const newInvoice: Invoice = {
      ...values,
      id: invoiceHistory.length + 1,
      date: new Date().toLocaleDateString('en-IN'),
    };
    setInvoiceHistory(prev => [...prev, newInvoice]);
    toast({
      title: "Bill Generated!",
      description: `Invoice #${newInvoice.id} for ${newInvoice.customerName} has been created.`,
    });
    form.reset();
  }

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`invoice-${selectedInvoice?.id}-${selectedInvoice?.customerName}.pdf`);
    toast({
        title: "Download Started",
        description: "Your invoice PDF is being downloaded.",
    });
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-col relative bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
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
          <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-3xl font-bold tracking-tight font-headline">
                  Sales Panel
              </h2>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-6 w-6" />
                    <span>Branch Details</span>
                  </CardTitle>
                  <CardDescription>Enter the details for the branch.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="branchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter branch name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter GST number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter branch address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pinCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pin code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Details</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6" />
                    <span>Customer Details</span>
                  </CardTitle>
                  <CardDescription>Enter the details for the customer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter customer name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter customer address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerAltContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter alternate contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter age" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerAadhar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Aadhar number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerPan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pan No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter PAN number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerGst"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter GST number (if applicable)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-6 w-6" />
                    <span>Vehicle Details</span>
                  </CardTitle>
                  <CardDescription>Enter the details for the vehicle.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="modalNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modal No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter modal number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter vehicle color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noOfSeat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No Of Seat</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number of seats" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chassisNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chassis No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter chassis number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="controllerNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Controller No</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter controller number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chargerNo1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Charger No-1</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter charger number 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chargerNo2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Charger No-2</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter charger number 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="typeOfBattery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Battery</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batteryNo1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery No 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery number 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batteryNo2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery No 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery number 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batteryNo3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery No 3</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery number 3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batteryNo4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery No 4</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery number 4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batteryNo5"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery No 5</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery number 5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batteryNo6"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery No 6</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter battery number 6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end mt-8">
                  <Button size="lg" type="submit">Generate Bill</Button>
              </div>
            </form>
          </Form>

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
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => {
                                setSelectedInvoice(invoice);
                                setTimeout(handleDownload, 100);
                           }}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

        </main>
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice #{selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && <InvoiceComponent ref={invoiceRef} invoiceData={selectedInvoice} />}
          <DialogFooter>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden component for PDF generation */}
      <div className="absolute -z-10 -left-[9999px] top-0">
          {selectedInvoice && <InvoiceComponent ref={invoiceRef} invoiceData={selectedInvoice} />}
      </div>
    </>
  );
}
