
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Phone, LogOut, Eye, EyeOff } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState, useEffect } from "react";

const buyPackageSchema = z.object({
  packageId: z.string().min(1, { message: "Please select a package." }),
  pin: z.string().length(6, { message: "PIN must be 6 digits." }),
});

const packages = [
    { id: 'starter', name: 'Starter Package', amount: 15000 },
    { id: 'pro', name: 'Pro Package', amount: 1500 },
    { id: 'business', name: 'Business Package', amount: 5000 },
];

export default function BuyPackagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [name, setName] = useState('User');
  const [userId, setUserId] = useState('YUNEX12345');
  const [payableAmount, setPayableAmount] = useState(0);
  const [showPin, setShowPin] = useState(false);


  useEffect(() => {
    const userName = searchParams.get('name');
    if (userName) {
      setName(decodeURIComponent(userName));
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof buyPackageSchema>>({
    resolver: zodResolver(buyPackageSchema),
    defaultValues: {
        pin: "",
    }
  });

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(p => p.id === packageId);
    setPayableAmount(selectedPackage ? selectedPackage.amount : 0);
    form.setValue("packageId", packageId);
  };

  const onSubmit = (values: z.infer<typeof buyPackageSchema>) => {
    console.log("Buying package with PIN:", values);
    const selectedPackage = packages.find(p => p.id === values.packageId);
    toast({
      title: "Package Purchase Successful!",
      description: `You have purchased the ${selectedPackage?.name} for $${selectedPackage?.amount.toFixed(2)} and your ID is activated.`,
    });
    router.push("/dashboard/wallet");
  };

  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');

  return (
    <>
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
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Buy Package</h2>
        </div>

        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Select a Package</CardTitle>
                <CardDescription>Choose a package to purchase and activate your ID.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <FormLabel>User ID</FormLabel>
                            <Input value={userId} readOnly disabled />
                        </div>
                        <div className="space-y-2">
                            <FormLabel>User Name</FormLabel>
                            <Input value={name} readOnly disabled />
                        </div>

                        <FormField
                            control={form.control}
                            name="packageId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Package</FormLabel>
                                    <Select onValueChange={handlePackageChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a package" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {packages.map(pkg => (
                                                <SelectItem key={pkg.id} value={pkg.id}>
                                                    {pkg.name} - ${pkg.amount.toLocaleString('en-US')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="space-y-2">
                            <FormLabel>Payable Amount</FormLabel>
                            <Input value={`$${payableAmount.toLocaleString('en-US')}`} readOnly disabled />
                        </div>
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>PIN</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Input
                                    type={showPin ? "text" : "password"}
                                    placeholder="Enter your 6-digit PIN"
                                    {...field}
                                    maxLength={6}
                                    />
                                    <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                    onClick={() => setShowPin(!showPin)}
                                    >
                                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={!form.watch('packageId')}>Purchase & Activate</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
}

    