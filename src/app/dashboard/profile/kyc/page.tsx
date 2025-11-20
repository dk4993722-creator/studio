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
import { ArrowLeft, Phone, LogOut, Upload } from "lucide-react";
import { AapkaPayLogo } from "@/components/aapka-pay-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

const kycSchema = z.object({
  aadharNumber: z.string().length(12, "Aadhar number must be 12 digits."),
  aadharFront: z.any().refine((files) => files?.length == 1, "Aadhar card (Front) is required."),
  aadharBack: z.any().refine((files) => files?.length == 1, "Aadhar card (Back) is required."),
  panNumber: z.string().length(10, "PAN number must be 10 characters."),
  pan: z.any().refine((files) => files?.length == 1, "PAN card is required."),
  accountHolderName: z.string().min(1, "Account holder name is required."),
  bankName: z.string().min(1, "Bank name is required."),
  accountNumber: z.string().min(1, "Account number is required."),
  ifscCode: z.string().min(1, "IFSC code is required."),
});

const FileUpload = ({ field, label }: { field: any, label: string }) => {
    const [fileName, setFileName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            field.onChange(event.target.files);
        }
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div 
                    className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    onClick={() => inputRef.current?.click()}
                >
                    <Input
                        type="file"
                        ref={inputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {fileName ? (
                        <p className="text-sm text-foreground">{fileName}</p>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <p className="mt-2 text-sm">Click to upload</p>
                        </div>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default function KycPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof kycSchema>>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      aadharNumber: "",
      panNumber: "",
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
  });

  const onSubmit = (values: z.infer<typeof kycSchema>) => {
    console.log("KYC details submitted:", values);
    toast({
      title: "Success!",
      description: "Your KYC details have been submitted for verification.",
    });
    router.push("/dashboard/profile");
  };

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">KYC Verification</h2>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Submit Your Documents</CardTitle>
            <CardDescription>
              Please provide your Aadhar, PAN, and bank details for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your 12-digit Aadhar number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="aadharFront"
                      render={({ field }) => <FileUpload field={field} label="Upload Aadhar Card (Front)" />}
                  />
                  <FormField
                      control={form.control}
                      name="aadharBack"
                      render={({ field }) => <FileUpload field={field} label="Upload Aadhar Card (Back)" />}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your 10-character PAN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => <FileUpload field={field} label="Upload PAN Card" />}
                />
                
                <h3 className="text-lg font-medium pt-4 border-t">Bank Details</h3>

                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., State Bank of India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your bank's IFSC code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Submit for Verification</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
