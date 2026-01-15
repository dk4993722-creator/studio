
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, ShoppingCart, Plus } from "lucide-react";
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
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const purchaseSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
});

type Purchase = z.infer<typeof purchaseSchema> & {
  id: number;
  date: Date;
  amount: number;
};

export default function PurchasePanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      product: "",
      quantity: 1,
      rate: 0,
    },
  });

  const { watch } = form;
  const quantity = watch("quantity");
  const rate = watch("rate");

  useEffect(() => {
    const amount = (quantity || 0) * (rate || 0);
    setTotalAmount(amount);
  }, [quantity, rate]);

  const onSubmit = (data: z.infer<typeof purchaseSchema>) => {
    const newPurchase: Purchase = {
      ...data,
      id: purchases.length + 1,
      date: new Date(),
      amount: data.quantity * data.rate,
    };
    setPurchases(prev => [newPurchase, ...prev]);
    form.reset();
    toast({
      title: "Purchase Added!",
      description: `${data.product} has been added to your purchase history.`,
    });
  };

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Purchase Panel</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Purchase</CardTitle>
            <CardDescription>Fill in the details to record a new purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate (per item)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
                    </div>
                    <Button type="submit">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Purchase
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>View all recorded purchases.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S. No.</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.length > 0 ? (
                            purchases.map((purchase, index) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">{purchases.length - index}</TableCell>
                                    <TableCell>{purchase.product}</TableCell>
                                    <TableCell>{purchase.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{purchase.quantity}</TableCell>
                                    <TableCell className="text-right">₹{purchase.rate.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">₹{purchase.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No purchases recorded yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
