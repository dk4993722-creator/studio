"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, Download } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WelcomeLetterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [name, setName] = useState('User');
  const [userId, setUserId] = useState('YUNEX12345');
  const [joiningDate, setJoiningDate] = useState('');

  useEffect(() => {
    const userName = searchParams.get('name');
    if (userName) {
      setName(decodeURIComponent(userName));
    }
    setJoiningDate(new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    }));
  }, [searchParams]);

  const handleDownload = () => {
    toast({
      title: "Feature Not Implemented",
      description: "PDF download is not yet available.",
    });
  };

  const galaxyImage = placeholderImages.placeholderImages.find(p => p.id === 'galaxy-background-3');
  const userAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1');

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
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="hidden md:flex" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight font-headline text-white">Welcome Letter</h2>
            </div>
            <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </div>

        <div className="flex justify-center items-start">
            <Card className="w-full max-w-4xl bg-card/90 text-card-foreground p-4 sm:p-8">
                <CardContent className="p-2 sm:p-4">
                    <div className="border-4 border-primary p-4 sm:p-8 text-white">
                        <header className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <YunexLogo className="h-16 w-16" />
                                <div>
                                    <h1 className="text-3xl font-bold text-primary font-headline">YUNEX</h1>
                                    <p className="text-muted-foreground">Innovate Your Future</p>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <p>Ref: YUNEX/{new Date().getFullYear()}/{userId}</p>
                                <p>Date: {joiningDate}</p>
                            </div>
                        </header>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Subject: Welcome to the YUNEX Family!</h3>
                            <p className="font-semibold mb-4">Dear {name},</p>
                        </div>
                        
                        <div className="space-y-4 text-lg leading-relaxed">
                            <p>
                                It is with great pleasure that we welcome you to YUNEX! We are thrilled to have you join our community of forward-thinkers and innovators. Your journey with us begins today, and we are excited about the potential you bring.
                            </p>
                            <p>
                                Your unique User ID is <strong className="text-primary">{userId}</strong>. Please keep this ID safe as it will be your primary identifier within the YUNEX ecosystem.
                            </p>
                            <p>
                                At YUNEX, we are committed to empowering our associates through innovative projects and a supportive network. We believe in mutual growth and success, and we are confident that your association with us will be a rewarding one.
                            </p>
                            <p>
                                We encourage you to explore your dashboard, familiarize yourself with our projects, and start building your network. Should you have any questions, our support team is always available to assist you.
                            </p>
                            <p>
                                Welcome aboard! We look forward to achieving great things together.
                            </p>
                        </div>

                        <footer className="mt-12 text-left">
                            <p className="font-semibold">Warm Regards,</p>
                            <p className="font-bold font-headline text-primary text-xl mt-2">The YUNEX Team</p>
                            <p className="text-sm text-muted-foreground">www.yunex.example.com</p>
                        </footer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
