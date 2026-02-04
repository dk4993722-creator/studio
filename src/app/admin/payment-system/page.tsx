"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, LogOut, CreditCard, Check, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type PaymentRequest = {
  id: string;
  dealerId: string;
  amount: number;
  utrNumber: string;
  screenshotName: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export default function PaymentSystemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

  useEffect(() => {
    try {
      const storedRequests = localStorage.getItem('yunex-payment-requests');
      if (storedRequests) {
        setPaymentRequests(JSON.parse(storedRequests));
      }
    } catch (error) {
      console.error("Failed to load payment requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load payment requests.",
      });
    }
  }, [toast]);

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    const updatedRequests = paymentRequests.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setPaymentRequests(updatedRequests);
    try {
      localStorage.setItem('yunex-payment-requests', JSON.stringify(updatedRequests));
      toast({
        title: "Success",
        description: `Payment request has been ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Failed to update payment status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update payment status.",
      });
      setPaymentRequests(paymentRequests);
    }
  };

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Payment System</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-6 w-6" />Payment Verification</CardTitle>
            <CardDescription>Review and approve or reject payment requests from dealers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Dealer ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>UTR Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRequests.length > 0 ? (
                  paymentRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>{req.dealerId}</TableCell>
                      <TableCell>{new Date(req.date).toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.utrNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            req.status === 'Approved' ? 'default' :
                            req.status === 'Rejected' ? 'destructive' :
                            'secondary'
                          }
                          className={
                            req.status === 'Approved' ? 'bg-green-500/20 text-green-700 border-green-500/40' :
                            req.status === 'Rejected' ? 'bg-red-500/20 text-red-700 border-red-500/40' :
                            ''
                          }
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {req.status === 'Pending' && (
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleStatusChange(req.id, 'Approved')}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleStatusChange(req.id, 'Rejected')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No payment requests found.
                    </TableCell>
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
