
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, Gift, Calendar, Tag } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";

const specialOffers = [
  {
    id: 1,
    title: "Monsoon Bonanza: Free Insurance",
    description: "Get free first-party insurance on every purchase of the Yunex-X1 model. This offer is valid for a limited time only.",
    validity: "July 1, 2024 - August 31, 2024",
    code: "MONSOON24",
  },
  {
    id: 2,
    title: "Festive Season Discount",
    description: "Enjoy a flat ₹2000 discount on all e-scooter models during the festive season. Boost your sales with this amazing deal.",
    validity: "October 1, 2024 - November 15, 2024",
    code: "FESTIVE2K",
  },
  {
    id: 3,
    title: "Bulk Purchase Offer",
    description: "Dealers purchasing more than 10 units in a single invoice will get an additional 5% discount on the total amount.",
    validity: "Ongoing",
    code: "BULKDEAL5",
  },
  {
    id: 4,
    title: "Spare Parts Combo",
    description: "Get a free toolkit worth ₹500 with every purchase of spare parts worth ₹10,000 or more.",
    validity: "July 15, 2024 - September 15, 2024",
    code: "TOOLKITFREE",
  },
];

export default function SpecialOfferPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Dealer</h1>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Special Offers</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {specialOffers.map((offer) => (
            <Card key={offer.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-primary" />
                  {offer.title}
                </CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Validity: {offer.validity}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>Code: <span className="font-mono text-foreground bg-muted px-2 py-1 rounded">{offer.code}</span></span>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
