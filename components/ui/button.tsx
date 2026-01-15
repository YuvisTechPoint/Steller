"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
    primary: "bg-[var(--primary)] text-white shadow-sm hover:brightness-110",
    secondary: "bg-[var(--icon-bg)] text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)] border border-[var(--card-border)]",
    outline: "bg-transparent text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--icon-bg)]",
    ghost: "hover:bg-[var(--icon-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    danger: "bg-[var(--danger)] text-white hover:brightness-110",
    success: "bg-[var(--success)] text-white hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-xs rounded-lg",
    md: "h-11 px-6 text-sm rounded-xl",
    lg: "h-14 px-10 text-base rounded-2xl",
    icon: "h-11 w-11 rounded-xl flex items-center justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                    "btn-tactile inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && leftIcon && <span className="mr-2 opacity-80">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2 opacity-80">{rightIcon}</span>}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
