"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function AnimatedCard({
  children,
  index = 0,
  className,
}: AnimatedCardProps) {
  return (
    <div
      style={{
        animationDelay: `${Math.min(index * 90, 540)}ms`,
        animationFillMode: "both",
      }}
      className={cn(
        "animate-in fade-in slide-in-from-bottom-6 duration-500 h-full",
        className
      )}
    >
      {children}
    </div>
  );
}
