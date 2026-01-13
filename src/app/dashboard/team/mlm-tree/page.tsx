"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { LogOut, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type TreeNodeData = {
  id: string;
  name: string;
  children?: TreeNodeData[];
};

const treeData: TreeNodeData = {
  id: '1',
  name: 'You',
  children: [
    {
      id: 'l1-1', name: 'User A',
      children: [
        { id: 'l2-1', name: 'User A1' },
        { id: 'l2-2', name: 'User A2' },
        { id: 'l2-3', name: 'User A3' },
      ]
    },
    {
      id: 'l1-2', name: 'User B',
      children: [
        { id: 'l2-4', name: 'User B1' },
        { id: 'l2-5', name: 'User B2' },
      ]
    },
    {
      id: 'l1-3', name: 'User C',
      children: [
        { id: 'l2-6', name: 'User C1' },
        { id: 'l2-7', name: 'User C2' },
        { id: 'l2-8', name: 'User C3' },
        { id: 'l2-9', name: 'User C4' },
      ]
    }
  ],
};


const TreeNode = ({ node }: { node: TreeNodeData }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li className="flex flex-col items-center relative">
      <div 
        className="flex flex-col items-center justify-center p-2 m-0.5 rounded-lg text-primary-foreground w-24 h-20 bg-primary/90"
      >
        <User className="w-5 h-5 mb-1" />
        <span className="font-semibold text-xs leading-tight text-center">{node.name}</span>
        <span className="text-[10px] opacity-80">ID: {node.id}</span>
      </div>
      {hasChildren && (
        <>
          <div className="absolute top-[100%] w-0.5 h-4 bg-border"></div>
          <ul className="flex justify-center pt-4 relative 
                         before:content-[''] before:absolute before:top-0 before:h-0.5 before:bg-border
                         before:left-[calc(50%_-_(var(--child-count)_-_1)_*_50%_/_var(--child-count)_+_var(--child-count)_*_0.25rem/_var(--child-count))] 
                         before:right-[calc(50%_-_(var(--child-count)_-_1)_*_50%_/_var(--child-count)_+_var(--child-count)_*_0.25rem/_var(--child-count))]
                         "
              style={{ '--child-count': node.children.length } as React.CSSProperties}
          >
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
};


export default function MlmTreePage() {
  const router = useRouter();
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'electric-scooter-hero-1');


  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-foreground font-headline">YUNEX</h1>
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
          <h2 className="text-3xl font-bold tracking-tight font-headline">MLM Tree</h2>
        </div>
        <Card className="overflow-x-auto bg-card">
            <CardContent className="p-6">
                <div className="flex justify-center">
                    <ul className="flex flex-col items-center">
                        <TreeNode node={treeData} />
                    </ul>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
