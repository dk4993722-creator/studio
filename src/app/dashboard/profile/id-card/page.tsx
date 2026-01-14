"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useEffect, useState } from "react";

export default function IdCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('User');
  const [userId, setUserId] = useState('YUNEX12345');
  const [joinDate, setJoinDate] = useState('01/01/24');
  const [phone, setPhone] = useState('+91 9876543210');


  useEffect(() => {
    const userName = searchParams.get('name');
    if (userName) {
      setName(decodeURIComponent(userName));
    }
  }, [searchParams]);

  const userAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1');
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');


  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
              src={userAvatar?.imageUrl}
              alt="User avatar"
              data-ai-hint={userAvatar?.imageHint}
            />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {heroImage && (
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={heroImage.imageHint}
            />
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="hidden md:flex" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">My ID Card</h2>
        </div>

        <div className="flex justify-center items-start py-8">
            <Card className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden font-sans bg-white relative">
                <div className="absolute top-0 left-0 w-full h-[180px] bg-[#0057b7] rounded-b-[50%]"></div>
                <CardContent className="relative z-10 p-6 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-white mb-8">
                        <YunexLogo className="h-8 w-8" />
                        <span className="font-bold text-lg">YUNEX</span>
                    </div>

                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={userAvatar?.imageUrl} alt={name} data-ai-hint={userAvatar?.imageHint} />
                        <AvatarFallback className="text-4xl text-primary">{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="text-center mt-6">
                        <h2 className="text-2xl font-bold text-slate-800 uppercase">{name}</h2>
                        <p className="text-slate-500 font-semibold text-md mt-1">Associate</p>
                        <p className="text-slate-400 text-sm mt-1">ID: {userId}</p>
                    </div>

                    <div className="mt-8 flex flex-col items-center text-center w-full pt-4">
                      <Image 
                        src="https://storage.googleapis.com/aip-dev-product-326615.appspot.com/326615/5129665d-c0ba-4700-a681-31a69a4e09fd.png"
                        alt="barcode"
                        width={200}
                        height={40}
                        data-ai-hint="barcode"
                        className="object-contain"
                      />
                      <div className="w-full h-8 border-b-4 border-[#0057b7] mt-4"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
