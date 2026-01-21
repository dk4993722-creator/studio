
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LogOut, Car, Edit, Trash2, PlusCircle } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const initialVehicleModels = [
  { sNo: 1, eVehicleModel: 'Yunex-X1', price: 75000, date: '2024-07-29' },
  { sNo: 2, eVehicleModel: 'Yunex-S1', price: 68000, date: '2024-07-29' },
  { sNo: 3, eVehicleModel: 'Yunex-X2', price: 82000, date: '2024-07-30' },
];

const vehicleModelSchema = z.object({
  eVehicleModel: z.string().min(1, "Model name is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
});

export default function EVehicleModelsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [models, setModels] = useState(initialVehicleModels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof vehicleModelSchema>>({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: {
      eVehicleModel: "",
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof vehicleModelSchema>) {
    const newModel = {
      sNo: models.length > 0 ? Math.max(...models.map(m => m.sNo)) + 1 : 1,
      ...values,
      date: new Date().toISOString().split('T')[0],
    };
    setModels(prev => [...prev, newModel]);
    toast({
      title: "Model Added",
      description: `Model "${values.eVehicleModel}" has been successfully added.`,
    });
    form.reset();
    setIsAddDialogOpen(false);
  }

  const handleDelete = (sNo: number) => {
    setModels(models.filter(model => model.sNo !== sNo));
    toast({
      title: "Model Deleted",
      description: "The vehicle model has been removed.",
    });
  }

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Admin</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={placeholderImages.placeholderImages[0].imageUrl}
              alt="Admin avatar"
              data-ai-hint={placeholderImages.placeholderImages[0].imageHint}
            />
            <AvatarFallback>A</AvatarFallback>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">E. Vehicle Models</h2>
        </div>
        
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><Car className="h-6 w-6" />Manage E. Vehicle Models</CardTitle>
              <CardDescription>Add, edit, and remove E. Vehicle models from here.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                   <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Model
                   </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Add New Vehicle Model</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new model.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="eVehicleModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E. Vehicle Model</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Yunex-Z1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 75000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Save Model</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S. No.</TableHead>
                  <TableHead>E. Vehicle Model</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map(model => (
                  <TableRow key={model.sNo}>
                    <TableCell>{model.sNo}</TableCell>
                    <TableCell className="font-medium">{model.eVehicleModel}</TableCell>
                    <TableCell className="text-right">₹{model.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{model.date}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Model: {model.eVehicleModel}</DialogTitle>
                            <DialogDescription>
                              This functionality is for demonstration purposes and is not yet implemented.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                         <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Model: {model.eVehicleModel}?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. Are you sure you want to permanently delete this model?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                             <DialogClose asChild>
                              <Button variant="destructive" onClick={() => handleDelete(model.sNo)}>Delete</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
