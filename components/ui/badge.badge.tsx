"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "safe" | "caution" | "danger" | "neutral";

export function Badge({
    className,
    variant = "default",
    children
}: {
    className?: string;
    variant?: BadgeVariant;
    children: React.ReactNode;
}) {
    const variants: Record<BadgeVariant, string> = {
        default: "bg-[#5B6CFF]/10 text-[#5B6CFF] border-[#5B6CFF]/10",
        safe: "bg-[#4FD1C5]/10 text-[#4FD1C5] border-[#4FD1C5]/10",
        caution: "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/10",
        danger: "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/10",
        neutral: "bg-white/[0.03] text-[#9AA3B2] border-white/5",
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
