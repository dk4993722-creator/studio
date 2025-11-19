"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Users,
  WalletCards,
  Share2,
  MessageSquareWarning,
  Phone,
  Copy,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { AapkaPayLogo } from "@/components/aapka-pay-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import placeholderImages from "@/lib/placeholder-images.json";

export function DashboardClientPage() {
  const [balance, setBalance] = useState(1250.75);
  const [addAmount, setAddAmount] = useState("");
  const { toast } = useToast();
  const router = useRouter();

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

  const copyToClipboard = () => {
    const link = "https://aapkapay.example.com/join?ref=12345";
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  const handleComplainSubmit = (closeDialog: () => void) => {
    toast({
      title: "Submitted",
      description: "Your complaint has been submitted. We will get back to you shortly.",
    });
    closeDialog();
  };

  const features = [
    {
      title: "Team",
      description: "Contact our team",
      icon: <Users className="h-8 w-8 text-primary" />,
      dialog: (
        <>
          <DialogHeader>
            <DialogTitle className="font-headline">Our Team</DialogTitle>
            <DialogDescription>
              Meet the people behind Aapka Pay. We're here to help!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            <p>Our dedicated team works around the clock to ensure your transactions are safe and seamless.</p>
            <p className="mt-2">For support, please use the Complain section or call our helpline.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </>
      ),
    },
    {
      title: "Wallet",
      description: "Add funds to your wallet",
      icon: <WalletCards className="h-8 w-8 text-primary" />,
      dialog: (
        <DialogClose asChild>
          {(close) => (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline">Add to Wallet</DialogTitle>
                <DialogDescription>Enter the amount you wish to add.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
                  <Input id="amount" type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="e.g., 500" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleAddMoney(close as () => void)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Add to Wallet</Button>
              </DialogFooter>
            </>
          )}
        </DialogClose>
      ),
    },
    {
      title: "Share App",
      description: "Share with friends",
      icon: <Share2 className="h-8 w-8 text-primary" />,
      dialog: (
        <>
          <DialogHeader>
            <DialogTitle className="font-headline">Share Aapka Pay</DialogTitle>
            <DialogDescription>Share this app with your friends and earn rewards!</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input id="link" defaultValue="https://aapkapay.example.com/join?ref=12345" readOnly />
            <Button type="button" size="icon" className="bg-accent hover:bg-accent/90 shrink-0" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 text-accent-foreground" />
            </Button>
          </div>
        </>
      ),
    },
    {
      title: "Complain",
      description: "Submit a complaint",
      icon: <MessageSquareWarning className="h-8 w-8 text-primary" />,
      dialog: (
        <DialogClose asChild>
          {(close) => (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline">Submit a Complaint</DialogTitle>
                <DialogDescription>We are sorry for the inconvenience. Please describe your issue below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea placeholder="Type your message here." rows={6} />
              </div>
              <DialogFooter>
                <Button onClick={() => handleComplainSubmit(close as () => void)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Submit Complaint</Button>
              </DialogFooter>
            </>
          )}
        </DialogClose>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2">
          <AapkaPayLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary font-headline">AAPKA PAY</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Helpline:</span>
            <span>+91 1800 123 4567</span>
          </div>
          <Avatar>
            <AvatarImage src={placeholderImages.placeholderImages[0].imageUrl} alt="User avatar" data-ai-hint={placeholderImages.placeholderImages[0].imageHint} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, User!</h2>
          <Card className="w-full md:w-auto shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <span className="text-sm text-muted-foreground">INR</span>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹{balance.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">+2.1% from last 24 hours</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {features.map((feature) => (
            <Dialog key={feature.title}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground pt-0 pb-6">
                    {feature.description}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">{feature.dialog}</DialogContent>
            </Dialog>
          ))}
        </div>
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>A list of your recent wallet activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No recent transactions.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">Make a Payment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Feature not available</DialogTitle>
                        <DialogDescription>This is a demo application. This feature has not been implemented.</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
