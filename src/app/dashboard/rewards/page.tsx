"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, Users, Wallet, CalendarDays, Star } from "lucide-react";
import { AapkaPayLogo } from "@/components/aapka-pay-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { LogOut, Phone } from "lucide-react";

const rewardsData = [
  { level: 1, direct: 3, team: 3, income: 75, daily: 15, reward: 0 },
  { level: 2, direct: 0, team: 9, income: 45, daily: 15, reward: 0 },
  { level: 3, direct: 0, team: 27, income: 135, daily: 15, reward: 0 },
  { level: 4, direct: 0, team: 81, income: 405, daily: 15, reward: 0 },
  { level: 5, direct: 0, team: 243, income: 1215, daily: 15, reward: 5000 },
  { level: 6, direct: 0, team: 729, income: 3645, daily: 15, reward: 10000 },
  { level: 7, direct: 0, team: 2187, income: 10935, daily: 15, reward: 25000 },
  { level: 8, direct: 0, team: 6561, income: 32805, daily: 15, reward: 75000 },
];

export default function RewardsPage() {
  const router = useRouter();

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
            <AvatarImage src={placeholderImages.placeholderImages[0].imageUrl} alt="User avatar" data-ai-hint={placeholderImages.placeholderImages[0].imageHint} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} aria-label="Log Out">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Level / Rewords</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rewardsData.map((reward) => (
            <Card key={reward.level} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline">Level {reward.level}</CardTitle>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm flex-grow">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Direct</span>
                  <span>{reward.direct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Team</span>
                  <span>{reward.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Wallet className="h-4 w-4" /> Income</span>
                  <span className="font-semibold">₹{reward.income.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Daily</span>
                  <span className="font-semibold">₹{reward.daily.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Award className="h-4 w-4" /> Reward</span>
                  <span className="font-semibold">₹{reward.reward.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">View</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
