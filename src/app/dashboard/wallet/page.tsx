
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
  ArrowLeft,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Phone,
  LogOut,
  User,
  PlusCircle,
  CheckCircle,
  Package,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(1250.75);
  
  const walletFeatures = [];

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">My Wallet</h2>
        </div>
        
        <Card className="w-full shadow-lg bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-6 w-6 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">₹{balance.toLocaleString("en-IN")}</div>
            <p className="text-sm text-primary-foreground/80">+2.1% from last 24 hours</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            <Card onClick={() => router.push('/dashboard/wallet/add')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <PlusCircle className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Add Money</p>
            </Card>

            <Card onClick={() => router.push('/dashboard/wallet/buy-package')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <Package className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Buy Package</p>
            </Card>

            <Card onClick={() => router.push('/dashboard/wallet/sales-income')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <DollarSign className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Sales Income</p>
            </Card>

            <Card onClick={() => router.push('/dashboard/wallet/non-working-income')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <Briefcase className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Non Working Income</p>
            </Card>

            <Card onClick={() => router.push('/dashboard/wallet/send')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <ArrowUpCircle className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Send</p>
            </Card>
            
            <Card onClick={() => router.push('/dashboard/wallet/received')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <ArrowDownCircle className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Transaction History</p>
            </Card>
            
            <Card onClick={() => router.push('/dashboard/wallet/withdraw')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <CreditCard className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Withdraw</p>
            </Card>

          {walletFeatures.map((feature) => (
            <Dialog key={feature.title}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                  {feature.icon}
                  <p className="mt-2 font-semibold text-sm">{feature.title}</p>
                </Card>
              </DialogTrigger>
              {feature.dialog}
            </Dialog>
          ))}
          <Card onClick={() => router.push('/dashboard/profile')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
              <User className="h-10 w-10 text-primary" />
              <p className="mt-2 font-semibold text-sm">Profile</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
