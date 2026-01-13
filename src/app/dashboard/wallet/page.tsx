
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
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FeatureDialog = ({ title, description }: { title: string, description: string }) => (
  <DialogContent className="bg-card/80 backdrop-blur-sm border-white/10">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <DialogClose asChild>
            <Button>Close</Button>
        </DialogClose>
    </DialogFooter>
  </DialogContent>
);

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(1250.75);
  const [addAmount, setAddAmount] = useState("");
  const { toast } = useToast();

  const handleAddMoney = (closeDialog: () => void) => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setBalance((prev) => prev + amount);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-bold">Success!</span>
          </div>
        ),
        description: `₹${amount.toFixed(2)} has been added to your wallet.`,
      });
      setAddAmount("");
      closeDialog();
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
      });
    }
  };

  const walletFeatures = [
    {
      title: "Withdraw",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      dialog: <FeatureDialog title="Withdraw" description="This feature is under development." />,
    },
  ];

  const galaxyImage = placeholderImages.placeholderImages.find(p => p.id === 'galaxy-background-5');
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');


  return (
    <div className="flex min-h-screen w-full flex-col relative">
      {galaxyImage && (
        <Image
          src={galaxyImage.imageUrl}
          alt={galaxyImage.description}
          fill
          style={{ objectFit: 'cover' }}
          className="-z-10"
          data-ai-hint={galaxyImage.imageHint}
        />
      )}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary font-headline">YUNEX</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Helpline:</span>
            <span className="text-white">+91 1800 123 4567</span>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline text-white">My Wallet</h2>
        </div>
        
        <Card className="w-full shadow-lg bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white">₹{balance.toLocaleString("en-IN")}</div>
            <p className="text-sm text-muted-foreground">+2.1% from last 24 hours</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer bg-card/60 backdrop-blur-sm border-white/10 hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                  <PlusCircle className="h-10 w-10 text-primary" />
                  <p className="mt-2 font-semibold text-sm">Add Money</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-sm border-white/10">
                <DialogClose asChild>
                  {(close) => (
                  <>
                    <DialogHeader>
                      <DialogTitle className="font-headline">Add Money to Wallet</DialogTitle>
                      <DialogDescription>Enter the amount you want to add.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid items-center gap-4">
                        <Label htmlFor="amount" className="text-left">
                          Amount (₹)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          placeholder="0.00"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleAddMoney(close as () => void)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Add Money</Button>
                    </DialogFooter>
                  </>
                  )}
                </DialogClose>
              </DialogContent>
            </Dialog>

            <Card onClick={() => router.push('/dashboard/wallet/send')} className="cursor-pointer bg-card/60 backdrop-blur-sm border-white/10 hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <ArrowUpCircle className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Send</p>
            </Card>
            
            <Card onClick={() => router.push('/dashboard/wallet/received')} className="cursor-pointer bg-card/60 backdrop-blur-sm border-white/10 hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                <ArrowDownCircle className="h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-sm">Transaction History</p>
            </Card>

          {walletFeatures.map((feature) => (
            <Dialog key={feature.title}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer bg-card/60 backdrop-blur-sm border-white/10 hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                  {feature.icon}
                  <p className="mt-2 font-semibold text-sm">{feature.title}</p>
                </Card>
              </DialogTrigger>
              {feature.dialog}
            </Dialog>
          ))}
          <Card onClick={() => router.push('/dashboard/profile')} className="cursor-pointer bg-card/60 backdrop-blur-sm border-white/10 hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
              <User className="h-10 w-10 text-primary" />
              <p className="mt-2 font-semibold text-sm">Profile</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
