
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
import { LogOut, Users, Building2, Car, CreditCard, Receipt } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";

export default function AdminDashboardPage() {
  const router = useRouter();

  const adminFeatures = [
    { title: "User Management", icon: <Users className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/users"), description: "Edit and manage user data." },
    { title: "Branch Details", icon: <Building2 className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/branches"), description: "Manage branch information." },
    { title: "E. Vehicle Models", icon: <Car className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/e-vehicle-models"), description: "Manage E. Vehicle models." },
    { title: "Payment System", icon: <CreditCard className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/payment-system"), description: "Configure payment settings." },
    { title: "Bill Panel", icon: <Receipt className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/bill-panel"), description: "Manage bills and invoices." },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Admin</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={placeholderImages.placeholderImages[0].imageUrl}
              alt="Admin avatar"
              data-ai-hint={placeholderImages.placeholderImages[0].imageHint}
            />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminFeatures.map(feature => (
            <Card key={feature.title} onClick={feature.onClick} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                {feature.icon}
                <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground pt-0 pb-6">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>

      </main>
    </div>
  );
}
