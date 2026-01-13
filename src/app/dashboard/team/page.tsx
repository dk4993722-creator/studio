"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users2, Award, Network } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function TeamPage() {
  const router = useRouter();
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  const teamFeatures = [
    {
      title: "My Team",
      description: "View and manage your team members.",
      icon: <Users2 className="h-12 w-12 text-primary" />,
      onClick: () => setShowTeamDetails(true),
    },
    {
      title: "Level",
      description: "Check your current level and progress.",
      icon: <Award className="h-12 w-12 text-primary" />,
      onClick: () => router.push("/dashboard/rewards"),
    },
    {
      title: "MLM Tree",
      description: "Visualize your network structure.",
      icon: <Network className="h-12 w-12 text-primary" />,
      onClick: () => router.push("/dashboard/team/mlm-tree"),
    },
  ];
  
  const teamData = [
    { level: 1, totalMember: 3, myTeam: 3, remarks: "Complete" },
    { level: 2, totalMember: 9, myTeam: 9, remarks: "Complete" },
    { level: 3, totalMember: 27, myTeam: 27, remarks: "Complete" },
    { level: 4, totalMember: 81, myTeam: 81, remarks: "Complete" },
    { level: 5, totalMember: 243, myTeam: 5, remarks: "Incomplete" },
    { level: 6, totalMember: 729, myTeam: "", remarks: "" },
    { level: 7, totalMember: 2187, myTeam: "", remarks: "" },
    { level: 8, totalMember: 6561, myTeam: "", remarks: "" },
    { level: 9, totalMember: 19683, myTeam: "", remarks: "" },
    { level: 10, totalMember: 59049, myTeam: "", remarks: "" },
  ];

  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');


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
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Team Management</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {teamFeatures.map((feature) => (
            <Card key={feature.title} onClick={feature.onClick} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
         {showTeamDetails && (
            <div className="mt-4">
            <Card>
                <CardHeader>
                <CardTitle>Team Details</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Total Member</TableHead>
                        <TableHead>My Team</TableHead>
                        <TableHead>Remarks</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {teamData.map((row) => (
                        <TableRow key={row.level}>
                          <TableCell className="font-medium">{row.level}</TableCell>
                          <TableCell>{row.totalMember}</TableCell>
                          <TableCell>{row.myTeam}</TableCell>
                          <TableCell>
                              {row.remarks && (
                                <Badge variant={row.remarks === 'Complete' ? 'default' : 'destructive'} className={row.remarks === 'Complete' ? 'bg-green-500/20 text-green-500 border-green-500/40' : 'bg-red-500/20 text-red-500 border-red-500/40'}>
                                  {row.remarks}
                                </Badge>
                              )}
                          </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </div>
         )}
      </main>
    </div>
  );
}
