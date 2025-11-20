"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  BadgeCheck,
  Mail,
  Clipboard,
  FilePenLine,
  Phone,
  LogOut,
} from "lucide-react";
import { AapkaPayLogo } from "@/components/aapka-pay-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useState } from "react";

const FeatureDialog = ({ title, description }: { title: string, description: string }) => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
          <DialogClose asChild>
              <Button>Close</Button>
          </DialogClose>
      </DialogFooter>
    </DialogContent>
  );

export default function ProfilePage() {
  const router = useRouter();

  const profileFeatures = [
    {
      title: "Welcome Letter",
      icon: <Mail className="h-10 w-10 text-primary" />,
      dialog: <FeatureDialog title="Welcome Letter" description="This feature is under development." />,
    },
    {
      title: "ID Card",
      icon: <Clipboard className="h-10 w-10 text-primary" />,
      dialog: <FeatureDialog title="ID Card" description="This feature is under development." />,
    }
  ];

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">My Profile</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          <Card onClick={() => router.push('/dashboard/profile/kyc')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
            <BadgeCheck className="h-10 w-10 text-primary" />
            <p className="mt-2 font-semibold text-sm">KYC</p>
          </Card>
          {profileFeatures.map((feature) => (
            <Dialog key={feature.title}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
                  {feature.icon}
                  <p className="mt-2 font-semibold text-sm">{feature.title}</p>
                </Card>
              </DialogTrigger>
              {feature.dialog}
            </Dialog>
          ))}
        </div>
      </main>
    </div>
  );
}
