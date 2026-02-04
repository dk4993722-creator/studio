"use client";
export const dynamic = 'force-dynamic';

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  Clipboard,
  Phone,
  LogOut,
  Edit,
} from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, Suspense } from "react";

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState({
    name: 'Sanjay Kumar',
    email: 'sanjay@example.com',
    phone: '+91 98765 43210',
    avatarUrl: placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '',
    avatarHint: placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1')?.imageHint || '',
  });

  useEffect(() => {
    const userName = searchParams.get('name');
    if (userName) {
      setUser(prev => ({...prev, name: decodeURIComponent(userName)}));
    }
  }, [searchParams]);

  const profileFeatures = [
    {
      title: "Welcome Letter",
      icon: <Mail className="h-10 w-10 text-primary" />,
      onClick: () => router.push(`/dashboard/profile/welcome-letter?name=${encodeURIComponent(user.name)}`),
    },
    {
      title: "ID Card",
      icon: <Clipboard className="h-10 w-10 text-primary" />,
      onClick: () => router.push(`/dashboard/profile/id-card?name=${encodeURIComponent(user.name)}`),
    }
  ];

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
              src={user.avatarUrl}
              alt="User avatar"
              data-ai-hint={user.avatarHint}
            />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">My Profile</h2>
        </div>
        
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <CardDescription>
                    This functionality is for demonstration purposes and is not yet implemented.
                  </CardDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground w-20">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground w-20">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground w-20">Phone:</span>
                <span>{user.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          <Card onClick={() => router.push('/dashboard/profile/kyc')} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
            <BadgeCheck className="h-10 w-10 text-primary" />
            <p className="mt-2 font-semibold text-sm">KYC</p>
          </Card>
          {profileFeatures.map((feature) => (
            <Card key={feature.title} onClick={feature.onClick} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 h-full">
              {feature.icon}
              <p className="mt-2 font-semibold text-sm">{feature.title}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}

