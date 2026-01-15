
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
  { sNo: 1, eVehicle: 'Yunex-X1', openingStock: 50, closingStock: 45, date: '2024-07-29' },
  { sNo: 2, eVehicle: 'Yunex-S1', openingStock: 30, closingStock: 20, date: '2024-07-29' },
  { sNo: 3, eVehicle: 'Yunex-X2', openingStock: 40, closingStock: 40, date: '2024-07-29' },
  { sNo: 4, eVehicle: 'Yunex-X3', openingStock: 25, closingStock: 22, date: '2024-07-29' },
];

export default function VehicleStockPage() {
  const router = useRouter();
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');

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
                    <span>Vehicle Stock</span>
                </CardTitle>
                 <CardDescription>
                  A summary of your vehicle inventory including opening and closing stock.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S. No.</TableHead>
                      <TableHead>E. Vehicle</TableHead>
                      <TableHead className="text-right">Opening Stock Qty</TableHead>
                      <TableHead className="text-right">Closing Stock</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.map((item) => (
                      <TableRow key={item.sNo}>
                        <TableCell>{item.sNo}</TableCell>
                        <TableCell className="font-medium">{item.eVehicle}</TableCell>
                        <TableCell className="text-right">{item.openingStock}</TableCell>
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
