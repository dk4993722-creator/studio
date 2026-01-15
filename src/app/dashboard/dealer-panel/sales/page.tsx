
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, TrendingUp, Building } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SalesPanelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
            <Avatar>
                <AvatarImage src={placeholderImages.placeholderImages[0].imageUrl} alt="User avatar" data-ai-hint={placeholderImages.placeholderImages[0].imageHint} />
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
            <h2 className="text-3xl font-bold tracking-tight font-headline">
                Sales Panel
            </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span>Branch Details</span>
            </CardTitle>
            <CardDescription>Enter the details for the branch.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input id="branch-name" placeholder="Enter branch name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst-no">GST No.</Label>
                <Input id="gst-no" placeholder="Enter GST number" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter branch address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin-code">Pin Code</Label>
                <Input id="pin-code" placeholder="Enter pin code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-details">Contact Details</Label>
                <Input id="contact-details" placeholder="Enter contact number" />
              </div>
            </div>
          </CardContent>
        </Card>
        
      </main>
    </div>
  );
}
