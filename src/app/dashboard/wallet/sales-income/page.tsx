
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Phone,
  LogOut,
} from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import Image from "next/image";

const salesData = [
    { sNo: 1, evModelNo: "YUNEX-X1", motorChassisNo: "MTRCH12345XYZ", dated: "2024-07-28", totalIncome: 3500.00 },
    { sNo: 2, evModelNo: "YUNEX-S1", motorChassisNo: "MTRCH67890ABC", dated: "2024-07-27", totalIncome: 7000.00 },
    { sNo: 3, evModelNo: "YUNEX-X1", motorChassisNo: "MTRCH54321DEF", dated: "2024-07-26", totalIncome: 3500.00 },
];

const products = [
    { name: "YUNEX-X1", price: 45000 },
    { name: "YUNEX-X2", price: 40000 },
    { name: "YUNEX-X3", price: 35000 },
    { name: "YUNEX-X4", price: 33500 },
];

export default function SalesIncomePage() {
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
        {heroImage && (
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={heroImage.imageHint}
            />
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Sales Income</h2>
        </div>

        <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tight font-headline mb-4">Products</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <Card key={product.name}>
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">${product.price.toLocaleString('en-US')}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Sales Income History</CardTitle>
                <CardDescription>A list of your sales income.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S.No.</TableHead>
                            <TableHead>E.V. Model No</TableHead>
                            <TableHead>Motor Chassis No.</TableHead>
                            <TableHead>Dated</TableHead>
                            <TableHead className="text-right">Total Income</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesData.map((transaction) => (
                            <TableRow key={transaction.sNo}>
                                <TableCell className="font-medium">{transaction.sNo}</TableCell>
                                <TableCell>{transaction.evModelNo}</TableCell>
                                <TableCell>{transaction.motorChassisNo}</TableCell>
                                <TableCell>{transaction.dated}</TableCell>
                                <TableCell className="text-right text-green-500">+ ${transaction.totalIncome.toFixed(2)}</TableCell>
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

    