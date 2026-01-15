
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LogOut, Building, User, Car } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";


const salesFormSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  gstNo: z.string().min(1, "GST No. is required"),
  address: z.string().min(1, "Address is required"),
  pinCode: z.string().min(1, "Pin code is required"),
  contactDetails: z.string().min(1, "Contact details are required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerCity: z.string().min(1, "City is required"),
  customerContact: z.string().min(1, "Contact is required"),
  customerAltContact: z.string().optional(),
  customerAge: z.coerce.number().positive().optional(),
  customerAadhar: z.string().optional(),
  customerPan: z.string().optional(),
  customerGst: z.string().optional(),
  modalNo: z.string().min(1, "Modal No. is required"),
  color: z.string().min(1, "Color is required"),
  noOfSeat: z.coerce.number().positive(),
  chassisNo: z.string().min(1, "Chassis No. is required"),
  controllerNo: z.string().min(1, "Controller No. is required"),
  chargerNo1: z.string().optional(),
  chargerNo2: z.string().optional(),
  typeOfBattery: z.string().min(1, "Battery type is required"),
  batteryNo1: z.string().optional(),
  batteryNo2: z.string().optional(),
  batteryNo3: z.string().optional(),
  batteryNo4: z.string().optional(),
  batteryNo5: z.string().optional(),
  batteryNo6: z.string().optional(),
});


export default function SalesPanelPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof salesFormSchema>>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      branchName: "",
      gstNo: "",
      address: "",
      pinCode: "",
      contactDetails: "",
      customerName: "",
      customerAddress: "",
      customerCity: "",
      customerContact: "",
      customerAltContact: "",
      customerAge: undefined,
      customerAadhar: "",
      customerPan: "",
      customerGst: "",
      modalNo: "",
      color: "",
      noOfSeat: undefined,
      chassisNo: "",
      controllerNo: "",
      chargerNo1: "",
      chargerNo2: "",
      typeOfBattery: "",
      batteryNo1: "",
      batteryNo2: "",
      batteryNo3: "",
      batteryNo4: "",
      batteryNo5: "",
      batteryNo6: "",
    },
  });

  function onSubmit(values: z.infer<typeof salesFormSchema>) {
    console.log(values);
    toast({
      title: "Bill Generated!",
      description: "Invoice data has been logged to the console.",
    });
    // Here you would typically handle the bill generation logic,
    // like creating an invoice component or PDF.
  }

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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormField
                    control={form.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter branch name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gstNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter GST number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter branch address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pin Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pin code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                   <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter customer address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerAltContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alternate contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter age" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerAadhar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Aadhar number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pan No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PAN number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerGst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter GST number (if applicable)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="modalNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modal No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter modal number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter vehicle color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noOfSeat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No Of Seat</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number of seats" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chassisNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chassis No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter chassis number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="controllerNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Controller No</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter controller number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chargerNo1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charger No-1</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter charger number 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chargerNo2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charger No-2</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter charger number 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typeOfBattery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Battery</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batteryNo1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery No 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery number 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="batteryNo2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery No 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery number 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="batteryNo3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery No 3</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery number 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="batteryNo4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery No 4</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery number 4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="batteryNo5"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery No 5</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery number 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="batteryNo6"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery No 6</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter battery number 6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-8">
                <Button size="lg" type="submit">Generate Bill</Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}

    