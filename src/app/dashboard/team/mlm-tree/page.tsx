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
import { cn } from "@/lib/utils";

type TreeNodeData = {
  id: string;
  name: string;
  children?: TreeNodeData[];
};

const treeData: TreeNodeData = {
  id: 'YNX26A0001',
  name: 'Yunex',
  children: [
    { id: 'YNX26A0002', name: 'Ram', children: [] },
    { id: 'YNX26A0003', name: 'Shiu', children: [] },
    { id: 'YNX26A0004', name: 'Krishna', children: [] },
  ],
};

const TreeNode = ({ node, level = 0 }: { node: TreeNodeData, level?: number }) => {
  const hasChildren = node.children && node.children.length > 0;

  // Define size classes for different levels
  const nodeSizeClasses = [
    "w-24 h-20", // level 0 (You)
    "w-20 h-16", // level 1 (User A, B, C)
    "w-16 h-14", // level 2 (User A1, A2...)
  ];
  
  const iconSizeClasses = [
    "w-5 h-5",    // level 0
    "w-4 h-4",    // level 1
    "w-3 h-3",    // level 2
  ];

  const textSizeClasses = [
    "text-xs",      // level 0
    "text-[11px]",  // level 1
    "text-[10px]",  // level 2
  ];

  const idTextSizeClasses = [
    "text-[10px]",  // level 0
    "text-[9px]",   // level 1
    "text-[8px]",   // level 2
  ];

  const currentLevel = Math.min(level, nodeSizeClasses.length - 1);


  return (
    <li className="flex flex-col items-center relative">
      <div 
        className={cn(
            "flex flex-col items-center justify-center p-1 m-0.5 rounded-lg text-primary-foreground bg-primary/90",
            nodeSizeClasses[currentLevel]
        )}
      >
        <User className={cn("mb-1", iconSizeClasses[currentLevel])} />
        <span className={cn("font-semibold leading-tight text-center", textSizeClasses[currentLevel])}>{node.name}</span>
        <span className={cn("opacity-80", idTextSizeClasses[currentLevel])}>ID: {node.id}</span>
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
              <TreeNode key={child.id} node={child} level={level + 1}/>
            ))}
          </ul>
        </>
      )}
    </li>
  );
};


export default function MlmTreePage() {
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
