
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Phone, LogOut, Shirt } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";

const priceData = [
  { sNo: 1, product: "Shirts", marketPrice: "450-650", yunexPrice: "50-80" },
  { sNo: 2, product: "Jeans", marketPrice: "1200-1500", yunexPrice: "150-200" },
  { sNo: 3, product: "T-shirts", marketPrice: "700-800", yunexPrice: "110-130" },
];

const garmentCategories = [
    { title: "Men's Wear", icon: <Shirt className="h-8 w-8 text-primary" /> },
];

export default function GarmentsProjectPage() {
  const router = useRouter();
  const scooterImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Garments Project</h2>
        </div>

        {scooterImage && (
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={scooterImage.imageUrl}
              alt={scooterImage.description}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={scooterImage.imageHint}
            />
          </div>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shirt className="h-6 w-6" />
                        <span>Your Garments (Men's Wear)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This is the page for the Garments Project. You can add content and features related to this project here.</p>
                </CardContent>
            </Card>
            {garmentCategories.map((category) => (
                <Card key={category.title} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                        {category.icon}
                        <CardTitle className="mt-4 font-headline">{category.title}</CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>

        <Card>
          <CardHeader>
              <CardTitle>Price List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S. No.</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Market Price</TableHead>
                  <TableHead>YUNEX</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceData.map((item) => (
                  <TableRow key={item.sNo}>
                    <TableCell>{item.sNo}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.marketPrice}</TableCell>
                    <TableCell>{item.yunexPrice}</TableCell>
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
