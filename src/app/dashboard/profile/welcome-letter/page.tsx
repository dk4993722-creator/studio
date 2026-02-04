"use client";

export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, LogOut, Download } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { useEffect, useState, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

function WelcomeLetterPageContent() {
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

  const userAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar-1');

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
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="hidden md:flex" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome Letter</h2>
            </div>
            <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </div>

        <div className="flex justify-center items-start">
            <Card className="w-full max-w-4xl text-card-foreground p-4 sm:p-8">
                <CardContent className="p-0">
                    <div className="border-8 border-primary p-4 sm:p-8 text-foreground bg-background relative">
                        <div className="absolute inset-2 border-2 border-primary"></div>
                        <div className="relative z-10 text-center">
                            <header className="flex flex-col items-center mb-8">
                                <YunexLogo className="h-24 w-24 mb-4" />
                                <h1 className="text-5xl font-bold text-primary font-headline tracking-widest">YUNEX</h1>
                                <p className="text-muted-foreground text-lg">Innovate Your Future</p>
                            </header>

                            <div className="mb-8">
                                <p className="text-2xl font-semibold mb-2">Certificate of Association</p>
                                <p className="text-lg">This is to certify that</p>
                            </div>
                            
                            <div className="my-8">
                                <h2 className="text-4xl font-headline font-bold text-primary tracking-wide">{name}</h2>
                                <hr className="w-48 mx-auto mt-2 border-primary" />
                            </div>

                            <div className="space-y-4 text-lg leading-relaxed max-w-2xl mx-auto">
                                <p>
                                    has been welcomed into the YUNEX community as an official Associate.
                                </p>
                                <p>
                                    Your unique User ID is <strong className="text-primary font-mono">{userId}</strong>.
                                </p>
                                <p>
                                    Date of Joining: <strong>{joiningDate}</strong>
                                </p>
                                <p className="mt-8">
                                   We are thrilled to have you with us and look forward to a successful journey together.
                                </p>
                            </div>

                            <footer className="mt-16 flex justify-between items-center w-full max-w-2xl mx-auto">
                                <div className="text-center">
                                    <p className="font-bold font-headline text-primary text-xl mt-2">The YUNEX Team</p>
                                    <hr className="w-32 mx-auto mt-1 border-foreground/50"/>
                                    <p className="text-sm text-muted-foreground">Authorized Signature</p>
                                </div>
                                <div className="text-center">
                                   <p className="text-sm font-semibold">Ref: YUNEX/{new Date().getFullYear()}/{userId}</p>
                                    <hr className="w-32 mx-auto mt-1 border-foreground/50"/>
                                   <p className="text-sm text-muted-foreground">Reference ID</p>
                                </div>
                            </footer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

export default function WelcomeLetterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <WelcomeLetterPageContent />
    </Suspense>
  );
}


export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <pageContent />
    </Suspense>
  );
}
