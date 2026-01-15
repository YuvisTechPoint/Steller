"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, error, ...props }, ref) => {
        return (
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA3B2]/40 peer-focus:text-[#5B6CFF] transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9AA3B2]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6CFF]/50 focus-visible:border-[#5B6CFF]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
                        icon && "pl-12",
                        error && "border-[#FF6B6B] focus-visible:ring-[#FF6B6B]/50 text-[#FF6B6B]",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5B6CFF]/10 to-[#4FD1C5]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10 blur-xl" />
            </div>
        );
    }
);
Input.displayName = "Input";
