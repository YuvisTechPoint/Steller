"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, interactive = true, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={interactive ? { y: -2, backgroundColor: "var(--card-hover-bg)" } : {}}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                    "premium-card relative overflow-hidden",
                    className
                )}
                {...props}
            >
                <div className="relative z-10 h-full">{children as React.ReactNode}</div>
            </motion.div>
        );
    }
);
Card.displayName = "Card";

export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("mb-4 flex flex-col space-y-1.5", className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <h3 className={cn("text-xl font-semibold tracking-tight text-[var(--text-primary)]", className)}>{children}</h3>
);

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <p className={cn("text-sm text-[var(--text-secondary)] leading-relaxed", className)}>{children}</p>
);

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("p-0 h-full", className)}>{children}</div>
);

export const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("mt-6 flex items-center p-0", className)}>{children}</div>
);
