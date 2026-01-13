"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, QrCode } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useEffect, useState } from "react";

export default function IdCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('User');
  const [userId, setUserId] = useState('YUNEX12345');

  useEffect(() => {
    const userName = searchParams.get('name');
    if (userName) {
      setName(decodeURIComponent(userName));
    }
  }, [searchParams]);

  const galaxyImage = placeholderImages.placeholderImages.find(p => p.id === 'galaxy-background-5');
  const userAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1');
  const qrCodeImage = placeholderImages.placeholderImages.find(p => p.id === 'qr-code-placeholder');


  return (
    <div className="flex min-h-screen w-full flex-col relative">
      {galaxyImage && (
        <Image
          src={galaxyImage.imageUrl}
          alt={galaxyImage.description}
          fill
          style={{ objectFit: 'cover' }}
          className="-z-10"
          data-ai-hint={galaxyImage.imageHint}
        />
      )}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary font-headline">YUNEX</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Helpline:</span>
            <span className="text-white">+91 1800 123 4567</span>
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="hidden md:flex" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline text-white">My ID Card</h2>
        </div>

        <div className="flex justify-center items-start">
            <Card className="w-full max-w-sm bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-lg border-primary/50 shadow-2xl shadow-primary/20 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-6">
                        <YunexLogo className="h-12 w-12" />
                        <h3 className="text-2xl font-bold font-headline text-primary">YUNEX</h3>
                    </div>

                    <div className="relative mb-4">
                        <Avatar className="w-32 h-32 border-4 border-primary">
                            <AvatarImage src={userAvatar?.imageUrl} alt={name} data-ai-hint={userAvatar?.imageHint} />
                            <AvatarFallback className="text-4xl">{name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-card">
                            Verified
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
                    <p className="text-primary font-semibold mb-4">Associate</p>
                    
                    <div className="bg-white/10 rounded-lg p-4 w-full text-center mb-6">
                        <p className="text-sm text-muted-foreground mb-1">USER ID</p>
                        <p className="text-lg font-mono tracking-widest text-white">{userId}</p>
                    </div>

                    <div className="w-full flex justify-center mb-4">
                        {qrCodeImage ? (
                             <Image src={qrCodeImage.imageUrl} alt="QR Code" width={128} height={128} className="rounded-lg bg-white p-1" data-ai-hint={qrCodeImage.imageHint} />
                        ) : (
                            <div className="w-32 h-32 bg-white flex items-center justify-center rounded-lg">
                                <QrCode className="w-24 h-24 text-black" />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Scan this code to verify</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
