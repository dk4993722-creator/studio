
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Phone, LogOut, Printer, FileDown } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Separator } from "@/components/ui/separator";

export default function SalesPanelPage() {
  const router = useRouter();

  const invoice = {
    seller: {
      name: "YUNEX",
      address: "Near D.C. Office, Satyam Nagar, Dhanbad, Jharkhand, INDIA. 826004",
      gstin: "20AAAAA0000A1Z5",
      state: "Jharkhand (Code: 20)",
    },
    buyer: {
      name: "ABC Motors",
      address: "123, Main Road, Ranchi, Jharkhand, 834001",
      gstin: "20BBBBB1111B2Z6",
      state: "Jharkhand (Code: 20)",
    },
    invoiceNo: "YUNEX-00123",
    invoiceDate: "30-Jul-2024",
    deliveryNote: "DN-456",
    paymentTerms: "Due on Receipt",
    items: [
      {
        sno: 1,
        description: "YUNEX-X1 Electric Scooter",
        hsn: "8711",
        qty: 2,
        rate: 45000,
        amount: 90000,
      },
      {
        sno: 2,
        description: "Helmet",
        hsn: "6506",
        qty: 2,
        rate: 800,
        amount: 1600,
      },
    ],
    taxableValue: 91600,
    cgstRate: 9,
    sgstRate: 9,
    cgstAmount: 8244,
    sgstAmount: 8244,
    totalTax: 16488,
    totalAmount: 108088,
    amountInWords: "One Lakh Eight Thousand Eighty-Eight Only",
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
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Sales Invoice</h2>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">
                    <Printer className="mr-2" /> Print
                </Button>
                <Button>
                    <FileDown className="mr-2" /> Download
                </Button>
            </div>
        </div>

        <Card className="p-6 md:p-8">
            <CardContent className="p-0">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <YunexLogo className="h-16 w-16" />
                        <div>
                            <h3 className="text-2xl font-bold font-headline">{invoice.seller.name}</h3>
                            <p className="text-sm text-muted-foreground">{invoice.seller.address}</p>
                            <p className="text-sm text-muted-foreground">GSTIN: {invoice.seller.gstin}</p>
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
                        <p className="font-bold">{invoice.buyer.name}</p>
                        <p>{invoice.buyer.address}</p>
                        <p>GSTIN: {invoice.buyer.gstin}</p>
                        <p>State: {invoice.buyer.state}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p className="font-semibold">Invoice No:</p>
                        <p>{invoice.invoiceNo}</p>
                        <p className="font-semibold">Invoice Date:</p>
                        <p>{invoice.invoiceDate}</p>
                        <p className="font-semibold">Delivery Note:</p>
                        <p>{invoice.deliveryNote}</p>
                        <p className="font-semibold">Payment Terms:</p>
                        <p>{invoice.paymentTerms}</p>
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
                            {invoice.items.map(item => (
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
                        <p><span className="font-semibold">Amount in words:</span> {invoice.amountInWords}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <p>Taxable Value</p>
                            <p className="font-semibold">₹{invoice.taxableValue.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>CGST @{invoice.cgstRate}%</p>
                            <p>₹{invoice.cgstAmount.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>SGST @{invoice.sgstRate}%</p>
                            <p>₹{invoice.sgstAmount.toFixed(2)}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                            <p>Total Amount</p>
                            <p>₹{invoice.totalAmount.toFixed(2)}</p>
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
      </main>
    </div>
  );
}
