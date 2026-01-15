
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, Download } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Purchase = {
  id: string; // Changed to string to match invoice ID
  product: string;
  quantity: number;
  rate: number;
  amount: number;
  date: Date;
};

export default function PurchasePanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    try {
      const storedPurchases = JSON.parse(localStorage.getItem('yunex-purchases') || '[]');
      // Convert date string back to Date object
      const formattedPurchases = storedPurchases.map((p: any) => ({
        ...p,
        date: new Date(p.date),
      }));
      setPurchases(formattedPurchases);
    } catch (error) {
      console.error("Failed to load purchases from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load purchase history.",
      });
    }
  }, []);

  const handleDownload = () => {
    if (purchases.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "There is no purchase history to download.",
      });
      return;
    }

    const headers = ["S. No.", "Product", "Date", "Quantity", "Rate (₹)", "Amount (₹)"];
    const csvContent = [
      headers.join(","),
      ...purchases.map((p, index) => [
        purchases.length - index,
        `"${p.product.replace(/"/g, '""')}"`, // Handle quotes in product name
        p.date.toLocaleDateString(),
        p.quantity,
        p.rate.toFixed(2),
        p.amount.toFixed(2),
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "purchase-history.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Started",
        description: "Your purchase history is being downloaded as a CSV file.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Purchase Panel</h1>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Purchase Panel</h2>
        </div>

        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>This is a read-only view of all recorded purchases from the sales panel.</CardDescription>
                </div>
                <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S. No.</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.length > 0 ? (
                            purchases.map((purchase, index) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">{purchases.length - index}</TableCell>
                                    <TableCell>{purchase.product}</TableCell>
                                    <TableCell>{purchase.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{purchase.quantity}</TableCell>
                                    <TableCell className="text-right">₹{purchase.rate.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">₹{purchase.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No purchases recorded yet.</TableCell>
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
