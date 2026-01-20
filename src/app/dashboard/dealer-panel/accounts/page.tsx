
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, ClipboardList, Download } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const accountData = [
  { date: "2024-07-31", particulars: "Sales - YUNEX-X1", debit: "", credit: "3500.00", balance: "3500.00 Cr" },
  { date: "2024-07-30", particulars: "Wallet Top-up", debit: "5000.00", credit: "", balance: "1500.00 Dr" },
  { date: "2024-07-29", particulars: "Purchase - Brake Pads", debit: "2000.00", credit: "", balance: "3500.00 Dr" },
  { date: "2024-07-28", particulars: "Opening Balance", debit: "", credit: "5500.00", balance: "5500.00 Cr" },
];

export default function AccountsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
        title: "Feature Not Implemented",
        description: "Downloading statements is not yet available.",
    });
  }

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Accounts</h1>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Account Section</h2>
        </div>

        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-6 w-6" />
                        <span>Account Statement</span>
                    </CardTitle>
                    <CardDescription>View your account transactions and balance.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Statement
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Particulars</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="font-medium">{row.particulars}</TableCell>
                          <TableCell className="text-right text-red-500">{row.debit ? `₹${row.debit}` : ''}</TableCell>
                          <TableCell className="text-right text-green-500">{row.credit ? `₹${row.credit}` : ''}</TableCell>
                          <TableCell className="text-right font-semibold">{row.balance}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
