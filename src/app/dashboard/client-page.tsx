"use client";

export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import {
  Users,
  WalletCards,
  Share2,
  MessageSquareWarning,
  Phone,
  Copy,
  LogOut,
  CheckCircle,
  Network,
  Award,
  Users2,
  Wind,
  Droplets,
  Shirt,
  CircuitBoard,
  Sparkle,
  Armchair,
  User,
  HandPlatter,
  BedDouble,
  Lamp,
  ToyBrick,
  Car,
  Building,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { YunexLogo } from "@/components/yunex-logo";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DashboardClientPage() {
  const [balance, setBalance] = useState(1250.75);
  const [addAmount, setAddAmount] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('User');
  const userId = 'YUNEX12345'; // Example User ID

  useEffect(() => {
    const userName = searchParams.get('name');
    if (userName) {
      setName(decodeURIComponent(userName));
    }
  }, [searchParams]);

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
    const link = "https://yunex.example.com/join?ref=12345";
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  const handleComplainSubmit = () => {
    toast({
      title: "Submitted",
      description: "Your complaint has been submitted. We will get back to you shortly.",
    });
  };
  
  const notImplementedDialog = (
    <>
      <DialogHeader>
        <DialogTitle>Feature Not Implemented</DialogTitle>
        <DialogDescription>This feature is not yet available in this demo.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );

  const features = [
    {
      title: "Share App",
      description: "Share with friends",
      icon: <Share2 className="h-8 w-8 text-primary" />,
      dialog: (
        <>
          <DialogHeader>
            <DialogTitle className="font-headline">Share YUNEX</DialogTitle>
            <DialogDescription>Share this app with your friends and earn rewards!</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input id="link" defaultValue="https://yunex.example.com/join?ref=12345" readOnly />
            <Button type="button" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </>
      ),
    },
    {
      title: "Complain",
      description: "Submit a complaint",
      icon: <MessageSquareWarning className="h-8 w-8 text-primary" />,
      dialog: (
        <>
          <DialogHeader>
            <DialogTitle className="font-headline">Submit a Complaint</DialogTitle>
            <DialogDescription>We are sorry for the inconvenience. Please describe your issue below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="complaint-user-id">User ID</Label>
              <Input id="complaint-user-id" value={userId} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="complaint-description">Complaint</Label>
              <Textarea id="complaint-description" placeholder="Type your message here." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button onClick={handleComplainSubmit}>Submit</Button>
            </DialogClose>
          </DialogFooter>
        </>
      ),
    },
  ];
  
  const otherFeatures = [
    {
      title: "Dealer Panel",
      description: "Access dealer tools",
      icon: <Building className="h-8 w-8 text-primary" />,
      onClick: () => router.push("/dashboard/dealer-panel"),
    },
  ]

  const garmentCategories = [
    { title: "Man's Wear", icon: <Shirt className="h-8 w-8 text-primary" />, page: "/dashboard/projects/garments" },
    { title: "Women's Wear", icon: <Shirt className="h-8 w-8 text-primary" />, page: "/dashboard/projects/garments" },
    { title: "Kids Wear", icon: <Shirt className="h-8 w-8 text-primary" />, page: "/dashboard/projects/garments" },
];

  const furnitureCategories = [
    { title: "Furniture", icon: <Armchair className="h-8 w-8 text-primary" />, page: "/dashboard/projects/furniture" },
    { title: "Kitchen & Dining", icon: <HandPlatter className="h-8 w-8 text-primary" />, page: "/dashboard/projects/furniture" },
    { title: "Bedroom Furniture", icon: <BedDouble className="h-8 w-8 text-primary" />, page: "/dashboard/projects/furniture" },
    { title: "Home Decor", icon: <Lamp className="h-8 w-8 text-primary" />, page: "/dashboard/projects/furniture" },
    { title: "Kids Furniture", icon: <ToyBrick className="h-8 w-8 text-primary" />, page: "/dashboard/projects/furniture" },
];

const electronicsCategories = [
    { title: "Electric Car", icon: <Car className="h-8 w-8 text-primary" />, page: "/dashboard/projects/electronics" },
];


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
            <AvatarImage src={placeholderImages.placeholderImages[0].imageUrl} alt="User avatar" data-ai-hint={placeholderImages.placeholderImages[0].imageHint} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {name}!</h2>
        <Card className="mb-4">
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1')?.imageUrl} alt="User avatar" data-ai-hint={placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1')?.imageHint} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-bold">{name}</p>
              <p className="text-sm text-muted-foreground">Rank: Associate</p>
              <p className="text-sm text-muted-foreground">ID: {userId}</p>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 md:gap-8">
            <Card onClick={() => router.push('/dashboard/profile')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                <User className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4 font-headline">Profile</CardTitle>
              </CardHeader>
               <CardContent className="text-center text-sm text-muted-foreground pt-0 pb-6">
                    View your profile
                </CardContent>
            </Card>

          <Card onClick={() => router.push('/dashboard/team')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
              <Users2 className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4 font-headline">My Team</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground pt-0 pb-6">
              View team members &amp; level
            </CardContent>
          </Card>

          <Card onClick={() => router.push('/dashboard/wallet')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
              <WalletCards className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4 font-headline">Wallet</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground pt-0 pb-6">
              Add funds to your wallet
            </CardContent>
          </Card>

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
          {otherFeatures.map((feature) => (
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

        <div className="mt-8">
            <h2 className="text-3xl font-bold tracking-tight font-headline text-center">Garments Project</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-8 mt-4">
                {garmentCategories.map((category) => (
                    <Card key={category.title} onClick={() => router.push(category.page)} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                            {category.icon}
                            <CardTitle className="mt-4 font-headline">{category.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>

        <div className="mt-8">
            <h2 className="text-3xl font-bold tracking-tight font-headline text-center">Furniture Projects</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-8 mt-4">
                {furnitureCategories.map((category) => (
                    <Card key={category.title} onClick={() => router.push(category.page)} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                            {category.icon}
                            <CardTitle className="mt-4 font-headline">{category.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>

        <div className="mt-8">
            <h2 className="text-3xl font-bold tracking-tight font-headline text-center">Electronics Project</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-8 mt-4">
                {electronicsCategories.map((category) => (
                    <Card key={category.title} onClick={() => router.push(category.page)} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="flex flex-col items-center justify-center text-center p-6 flex-grow">
                            {category.icon}
                            <CardTitle className="mt-4 font-headline">{category.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}

    
export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <clientpageContent />
    </Suspense>
  );
}
