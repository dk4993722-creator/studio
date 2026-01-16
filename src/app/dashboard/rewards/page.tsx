
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { LogOut, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const levelData = [
    { level: 1, totalMember: 3, reward: "" },
    { level: 2, totalMember: 9, reward: "" },
    { level: 3, totalMember: 27, reward: "6 E.V. Scooter / Cash 70%" },
    { level: 4, totalMember: 81, reward: "" },
    { level: 5, totalMember: 243, reward: "20 E.V. Scooter / Cash 70%" },
    { level: 6, totalMember: 729, reward: "" },
    { level: 7, totalMember: 2187, reward: "" },
    { level: 8, totalMember: 6561, reward: "40 E.V. Scooter / Cash 70%" },
    { level: 9, totalMember: 19683, reward: "" },
    { level: 10, totalMember: 59049, reward: "120 E.V. Scooter / Cash 70%" },
];


export default function RewardsPage() {
  const router = useRouter();

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">Level</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Total Member</TableHead>
                  <TableHead>Rewords</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levelData.map((row) => (
                  <TableRow key={row.level}>
                    <TableCell>{row.level}</TableCell>
                    <TableCell>{row.totalMember}</TableCell>
                    <TableCell>{row.reward}</TableCell>
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
