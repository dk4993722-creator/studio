import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function YunexLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      {...props}
      className={cn("text-primary", props.className)}
    >
      <circle cx="50" cy="50" r="48" fill="currentColor" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fill="hsl(var(--primary-foreground))"
        fontSize="48"
        className="font-headline font-bold"
      >
        YU
      </text>
    </svg>
  );
}
