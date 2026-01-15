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
        default: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/10",
        safe: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/10",
        caution: "bg-[var(--caution)]/10 text-[var(--caution)] border-[var(--caution)]/10",
        danger: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/10",
        neutral: "bg-[var(--icon-bg)] text-[var(--text-muted)] border-[var(--card-border)]",
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
