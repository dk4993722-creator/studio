
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, TrendingUp, Building, User, Car } from "lucide-react";
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <span>Customer Details</span>
            </CardTitle>
            <CardDescription>Enter the details for the customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input id="customer-name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customer-address">Address</Label>
                <Textarea id="customer-address" placeholder="Enter customer address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-city">City</Label>
                <Input id="customer-city" placeholder="Enter city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-contact">Contact</Label>
                <Input id="customer-contact" placeholder="Enter contact number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-alt-contact">Alternate No.</Label>
                <Input id="customer-alt-contact" placeholder="Enter alternate contact number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-age">Age</Label>
                <Input id="customer-age" placeholder="Enter age" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-aadhar">Aadhar No.</Label>
                <Input id="customer-aadhar" placeholder="Enter Aadhar number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-pan">Pan No.</Label>
                <Input id="customer-pan" placeholder="Enter PAN number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-gst">GST No.</Label>
                <Input id="customer-gst" placeholder="Enter GST number (if applicable)" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-6 w-6" />
              <span>Vehicle Details</span>
            </CardTitle>
            <CardDescription>Enter the details for the vehicle.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="modal-no">Modal No.</Label>
                <Input id="modal-no" placeholder="Enter modal number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="Enter vehicle color" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no-of-seat">No Of Seat</Label>
                <Input id="no-of-seat" placeholder="Enter number of seats" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassis-no">Chassis No.</Label>
                <Input id="chassis-no" placeholder="Enter chassis number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="controller-no">Controller No</Label>
                <Input id="controller-no" placeholder="Enter controller number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charger-no-1">Charger No-1</Label>
                <Input id="charger-no-1" placeholder="Enter charger number 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charger-no-2">Charger No-2</Label>
                <Input id="charger-no-2" placeholder="Enter charger number 2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type-of-battery">Type of Battery</Label>
                <Input id="type-of-battery" placeholder="Enter battery type" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-no-1">Battery No 1</Label>
                <Input id="battery-no-1" placeholder="Enter battery number 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-no-2">Battery No 2</Label>
                <Input id="battery-no-2" placeholder="Enter battery number 2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-no-3">Battery No 3</Label>
                <Input id="battery-no-3" placeholder="Enter battery number 3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-no-4">Battery No 4</Label>
                <Input id="battery-no-4" placeholder="Enter battery number 4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-no-5">Battery No 5</Label>
                <Input id="battery-no-5" placeholder="Enter battery number 5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-no-6">Battery No 6</Label>
                <Input id="battery-no-6" placeholder="Enter battery number 6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
