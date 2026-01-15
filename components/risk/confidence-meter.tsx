"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
    score: number; // 0 to 100
    isLoading?: boolean;
    className?: string;
    size?: number;
}

export function ConfidenceMeter({ score, isLoading, className, size = 120 }: ConfidenceMeterProps) {
    const getColor = (s: number) => {
        if (s >= 90) return "var(--success)"; 
        if (s >= 50) return "var(--caution)"; 
        return "var(--danger)"; 
    };

    const color = getColor(score);
    const radius = size / 2 - 8;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="var(--card-border)"
                    strokeWidth="6"
                    fill="transparent"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-10 h-10 rounded-full border border-[var(--card-border)] border-t-[var(--primary)]"
                        />
                    </div>
                ) : (
                    <>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={score}
                            className="text-4xl font-semibold tracking-tighter text-[var(--text-primary)]"
                        >
                            {score}
                        </motion.span>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mt-1">
                            Assurance
                        </span>
                    </>
                )}
            </div>

            {!isLoading && (
                <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-10 transition-colors duration-500"
                    style={{ background: color }}
                />
            )}
        </div>
    );
}
