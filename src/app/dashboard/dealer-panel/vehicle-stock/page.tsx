
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
import { ArrowLeft, Phone, LogOut, Warehouse } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";

const stockData = [
  // Day 1: 2024-07-29
  { sNo: 1, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', openingStock: 50, sales: 5, closingStock: 45, date: '2024-07-29' },
  { sNo: 2, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', openingStock: 30, sales: 10, closingStock: 20, date: '2024-07-29' },
  { sNo: 3, branchCode: 'Yunex202601', eVehicle: 'Yunex-X2', openingStock: 40, sales: 0, closingStock: 40, date: '2024-07-29' },
  { sNo: 4, branchCode: 'Yunex202603', eVehicle: 'Yunex-X3', openingStock: 25, sales: 3, closingStock: 22, date: '2024-07-29' },

  // Day 2: 2024-07-30
  { sNo: 5, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', openingStock: 45, sales: 2, closingStock: 43, date: '2024-07-30' },
  { sNo: 6, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', openingStock: 20, sales: 5, closingStock: 15, date: '2024-07-30' },
  { sNo: 7, branchCode: 'Yunex202601', eVehicle: 'Yunex-X2', openingStock: 40, sales: 1, closingStock: 39, date: '2024-07-30' },

  // Day 3: 2024-07-31
  { sNo: 8, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', openingStock: 43, sales: 3, closingStock: 40, date: '2024-07-31' },
  { sNo: 9, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', openingStock: 15, sales: 0, closingStock: 15, date: '2024-07-31' },
  { sNo: 10, branchCode: 'Yunex202603', eVehicle: 'Yunex-X3', openingStock: 22, sales: 2, closingStock: 20, date: '2024-07-31' },
];

export default function VehicleStockPage() {
  const router = useRouter();

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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Vehicle Stock</h2>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Warehouse className="h-6 w-6" />
                    <span>Daily Vehicle Stock Transactions</span>
                </CardTitle>
                 <CardDescription>
                  A daily summary of your vehicle inventory transactions, including opening stock, sales, and closing stock.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S. No.</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead>E. Vehicle</TableHead>
                      <TableHead className="text-right">Opening Stock</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.map((item) => (
                      <TableRow key={item.sNo}>
                        <TableCell>{item.sNo}</TableCell>
                        <TableCell>{item.branchCode}</TableCell>
                        <TableCell className="font-medium">{item.eVehicle}</TableCell>
                        <TableCell className="text-right">{item.openingStock}</TableCell>
                        <TableCell className="text-right">{item.sales}</TableCell>
                        <TableCell className="text-right">{item.closingStock}</TableCell>
                        <TableCell>{item.date}</TableCell>
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
