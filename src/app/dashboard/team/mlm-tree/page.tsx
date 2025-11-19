"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AapkaPayLogo } from "@/components/aapka-pay-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { LogOut, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

type TreeNodeData = {
  id: string;
  name: string;
  children?: TreeNodeData[];
};

const treeData: TreeNodeData = {
  id: '1',
  name: '3',
  children: [
    {
      id: '2', name: '9',
      children: [
        { id: '3', name: '27' },
        { id: '4', name: '81' },
        { id: '5', name: '243' },
      ],
    },
    {
      id: '6', name: '729',
      children: [
        { id: '7', name: '2187' },
        { id: '8', name: '6561' },
      ],
    },
    {
        id: '9', name: '19683',
        children: [
            { id: '10', name: '59049' }
        ]
    }
  ],
};


const TreeNode = ({ node }: { node: TreeNodeData }) => {
  return (
    <li className="flex flex-col items-center">
      <div className="flex flex-col items-center p-4 m-2 rounded-lg bg-card text-card-foreground shadow-lg min-w-[100px]">
        <User className="w-8 h-8 mb-2 text-primary" />
        <span className="font-bold">{node.name}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="flex justify-center gap-4 pt-4 relative 
                       before:content-[''] before:absolute before:left-1/2 before:-top-4 before:w-px before:h-4 before:bg-border
                       after:content-[''] after:absolute after:left-0 after:right-0 after:top-0 after:h-px after:bg-border
                       after:w-[calc(100%_-_2rem)] after:mx-auto">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};


export default function MlmTreePage() {
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">MLM Tree</h2>
        </div>
        <Card className="overflow-x-auto">
            <CardContent className="p-6">
                <div className="flex justify-center">
                    <ul className="flex">
                        <TreeNode node={treeData} />
                    </ul>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
