
"use client";

import { useRouter } from "next/navigation";
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
  ArrowLeft,
  Phone,
  LogOut,
} from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";

const addMoneySchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  utrNumber: z.string().min(1, { message: "UTR/Bank Reference is required." }),
  screenshot: z.any().refine((files) => files?.length == 1, "Screenshot is required."),
});

export default function AddMoneyPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addMoneySchema>>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: { amount: 0, utrNumber: "" },
  });

  const onSubmit = (values: z.infer<typeof addMoneySchema>) => {
    console.log("Adding money:", values);
    toast({
      title: "Request Submitted!",
      description: `Your request to add $${values.amount.toFixed(2)} is being processed. It will reflect in your wallet after verification.`,
    });
    router.push("/dashboard/wallet");
  };

  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');
  const qrCodeImage = placeholderImages.placeholderImages.find(p => p.id === 'qr-code-placeholder');


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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Add Money</h2>
        </div>

        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Add Money to Wallet</CardTitle>
                <CardDescription>Scan the QR code to pay, then enter the details below.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    {qrCodeImage && (
                        <div className="p-4 bg-white rounded-lg">
                            <Image
                                src={qrCodeImage.imageUrl}
                                alt={qrCodeImage.description}
                                width={200}
                                height={200}
                                data-ai-hint={qrCodeImage.imageHint}
                            />
                        </div>
                    )}
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="utrNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>UTR Number / Bank Reference</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter transaction reference number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="screenshot"
                            render={({ field }) => <FileUpload field={field} label="Upload Screenshot" />}
                        />
                        <Button type="submit" className="w-full">Submit Request</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

    