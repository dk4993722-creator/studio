
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

const vehicleModelSchema = z.object({
  eVehicleModel: z.string().min(1, "Model name is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  noOfSeat: z.string().optional(),
  chassisNo: z.string().optional(),
  motorNo: z.string().optional(),
  controllerNo: z.string().optional(),
  chargerNo1: z.string().optional(),
  chargerNo2: z.string().optional(),
  batteryMaker: z.string().optional(),
  batteryNo1: z.string().optional(),
  batteryNo2: z.string().optional(),
  batteryNo3: z.string().optional(),
  batteryNo4: z.string().optional(),
  batteryNo5: z.string().optional(),
  batteryNo6: z.string().optional(),
});

type VehicleModel = z.infer<typeof vehicleModelSchema> & {
  sNo: number;
  date: string;
};

const initialVehicleModels: VehicleModel[] = [
  { sNo: 1, eVehicleModel: 'Yunex-X1', price: 75000, date: '2024-07-29', noOfSeat: '2', chassisNo: 'CHX1-001', motorNo: 'MOTX1-001', controllerNo: 'CONX1-001', chargerNo1: 'CHG1-001', chargerNo2: '', batteryMaker: 'Yunex', batteryNo1: 'B1', batteryNo2: 'B2', batteryNo3: 'B3', batteryNo4: 'B4', batteryNo5: '', batteryNo6: '' },
  { sNo: 2, eVehicleModel: 'Yunex-S1', price: 68000, date: '2024-07-29', noOfSeat: '1', chassisNo: 'CHS1-001', motorNo: 'MOTS1-001', controllerNo: 'CONS1-001', chargerNo1: 'CHG2-001', chargerNo2: '', batteryMaker: 'Yunex', batteryNo1: 'C1', batteryNo2: 'C2', batteryNo3: 'C3', batteryNo4: 'C4', batteryNo5: 'C5', batteryNo6: 'C6' },
  { sNo: 3, eVehicleModel: 'Yunex-X2', price: 82000, date: '2024-07-30', noOfSeat: '2', chassisNo: 'CHX2-001', motorNo: 'MOTX2-001', controllerNo: 'CONX2-001', chargerNo1: 'CHG3-001', chargerNo2: '', batteryMaker: 'Other', batteryNo1: 'D1', batteryNo2: 'D2', batteryNo3: 'D3', batteryNo4: 'D4', batteryNo5: '', batteryNo6: '' },
];


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
      noOfSeat: "",
      chassisNo: "",
      motorNo: "",
      controllerNo: "",
      chargerNo1: "",
      chargerNo2: "",
      batteryMaker: "",
      batteryNo1: "",
      batteryNo2: "",
      batteryNo3: "",
      batteryNo4: "",
      batteryNo5: "",
      batteryNo6: "",
    },
  });

  function onSubmit(values: z.infer<typeof vehicleModelSchema>) {
    const newModel: VehicleModel = {
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
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                    <DialogTitle>Add New Vehicle Model</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new model.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
                          <FormField control={form.control} name="eVehicleModel" render={({ field }) => (<FormItem><FormLabel>E. Vehicle Model</FormLabel><FormControl><Input placeholder="e.g., Yunex-Z1" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" placeholder="e.g., 75000" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="noOfSeat" render={({ field }) => (<FormItem><FormLabel>No of Seat</FormLabel><FormControl><Input placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="chassisNo" render={({ field }) => (<FormItem><FormLabel>Chassis No.</FormLabel><FormControl><Input placeholder="Enter chassis number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="motorNo" render={({ field }) => (<FormItem><FormLabel>Motor No.</FormLabel><FormControl><Input placeholder="Enter motor number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="controllerNo" render={({ field }) => (<FormItem><FormLabel>Controller No.</FormLabel><FormControl><Input placeholder="Enter controller number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="chargerNo1" render={({ field }) => (<FormItem><FormLabel>Charger No - 1</FormLabel><FormControl><Input placeholder="Enter charger 1 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="chargerNo2" render={({ field }) => (<FormItem><FormLabel>Charger No - 2</FormLabel><FormControl><Input placeholder="Enter charger 2 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryMaker" render={({ field }) => (<FormItem><FormLabel>Battery Maker</FormLabel><FormControl><Input placeholder="Enter battery maker" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryNo1" render={({ field }) => (<FormItem><FormLabel>Battery No - 1</FormLabel><FormControl><Input placeholder="Enter battery 1 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryNo2" render={({ field }) => (<FormItem><FormLabel>Battery No - 2</FormLabel><FormControl><Input placeholder="Enter battery 2 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryNo3" render={({ field }) => (<FormItem><FormLabel>Battery No - 3</FormLabel><FormControl><Input placeholder="Enter battery 3 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryNo4" render={({ field }) => (<FormItem><FormLabel>Battery No - 4</FormLabel><FormControl><Input placeholder="Enter battery 4 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryNo5" render={({ field }) => (<FormItem><FormLabel>Battery No - 5</FormLabel><FormControl><Input placeholder="Enter battery 5 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          <FormField control={form.control} name="batteryNo6" render={({ field }) => (<FormItem><FormLabel>Battery No - 6</FormLabel><FormControl><Input placeholder="Enter battery 6 number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        </div>
                        <DialogFooter className="pt-4">
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
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Chassis No.</TableHead>
                  <TableHead>Motor No.</TableHead>
                  <TableHead>Controller No.</TableHead>
                  <TableHead>Charger 1</TableHead>
                  <TableHead>Charger 2</TableHead>
                  <TableHead>Battery Maker</TableHead>
                  <TableHead>Batt. 1</TableHead>
                  <TableHead>Batt. 2</TableHead>
                  <TableHead>Batt. 3</TableHead>
                  <TableHead>Batt. 4</TableHead>
                  <TableHead>Batt. 5</TableHead>
                  <TableHead>Batt. 6</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map(model => (
                  <TableRow key={model.sNo}>
                    <TableCell>{model.sNo}</TableCell>
                    <TableCell className="font-medium">{model.eVehicleModel}</TableCell>
                    <TableCell>₹{model.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{model.date}</TableCell>
                    <TableCell>{model.noOfSeat || 'N/A'}</TableCell>
                    <TableCell>{model.chassisNo || 'N/A'}</TableCell>
                    <TableCell>{model.motorNo || 'N/A'}</TableCell>
                    <TableCell>{model.controllerNo || 'N/A'}</TableCell>
                    <TableCell>{model.chargerNo1 || 'N/A'}</TableCell>
                    <TableCell>{model.chargerNo2 || 'N/A'}</TableCell>
                    <TableCell>{model.batteryMaker || 'N/A'}</TableCell>
                    <TableCell>{model.batteryNo1 || 'N/A'}</TableCell>
                    <TableCell>{model.batteryNo2 || 'N/A'}</TableCell>
                    <TableCell>{model.batteryNo3 || 'N/A'}</TableCell>
                    <TableCell>{model.batteryNo4 || 'N/A'}</TableCell>
                    <TableCell>{model.batteryNo5 || 'N/A'}</TableCell>
                    <TableCell>{model.batteryNo6 || 'N/A'}</TableCell>
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
