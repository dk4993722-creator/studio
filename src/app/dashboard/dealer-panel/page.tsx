
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, TrendingUp, ShoppingCart, ClipboardList, BadgeCheck, Warehouse, Wrench } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const verificationSchema = z.object({
  branchCode: z.string().min(1, "Branch/Dealer code is required."),
  pin: z.string().length(6, "PIN must be 6 digits."),
});

export default function DealerPanelPage() {
  const router = useRouter();
  const { toast } = useToast();

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      branchCode: "",
      pin: "",
    },
  });

  const onVerificationSubmit = (values: z.infer<typeof verificationSchema>) => {
    console.log("Verification submitted:", values);
    toast({
      title: "Verification Request Sent",
      description: `Verification for ${values.branchCode} is being processed.`,
    });
    verificationForm.reset();
  };

  const dealerFeatures = [
    { title: "Account Section", icon: <ClipboardList className="h-10 w-10 text-primary" />, onClick: () => router.push("/dashboard/dealer-panel/accounts"), description: "Manage account details." },
    { title: "E. Vehicle Stock", icon: <Warehouse className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/dashboard/dealer-panel/vehicle-stock"), description: "Manage vehicle inventory." },
    { title: "Spare Parts Stock", icon: <Wrench className="h-10 w-10 text-primary" />, onClick: () => router.push("/admin/dashboard/dealer-panel/spare-parts-stock"), description: "Manage spare parts inventory." },
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Dealer Panel</h2>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-6 w-6" />
                    <span>Branch/Dealer Verification</span>
                </CardTitle>
                <CardDescription>Verify a branch or dealer using their code and PIN.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...verificationForm}>
                    <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <FormField
                            control={verificationForm.control}
                            name="branchCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch/Dealer Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={verificationForm.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>6-Digit PIN</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••" {...field} maxLength={6} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dealerFeatures.map(feature => (
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
