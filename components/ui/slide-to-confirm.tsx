"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideToConfirmProps {
    onConfirm: () => void;
    label?: string;
    successLabel?: string;
    className?: string;
}

export function SlideToConfirm({ onConfirm, label = "Slide to Authenticate", successLabel = "Verified", className }: SlideToConfirmProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Bounds calculation
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth - 64); // Thumb is 56px + 8px padding
        }
    }, [width]);

    const opacity = useTransform(x, [0, width * 0.5], [1, 0]);
    // Use semi-static colors if the interpolation values are hard to map to CSS variables dynamically
    const background = useTransform(x, [0, width], ["#5B6CFF", "#10B981"]);
    const scale = useTransform(x, [0, width], [1, 1.05]);

    const handleDragEnd = () => {
        if (x.get() >= width - 10) {
            setIsConfirmed(true);
            onConfirm();
        } else {
            x.set(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-16 w-full rounded-2xl p-1 overflow-hidden transition-all duration-300",
                isConfirmed ? "bg-[var(--success)]" : "bg-[var(--icon-bg)] border border-[var(--card-border)]",
                className
            )}
        >
            <AnimatePresence mode="wait">
                {!isConfirmed ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full w-full flex items-center justify-center"
                    >
                        <motion.span
                            style={{ opacity }}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]/60 select-none"
                        >
                            {label}
                        </motion.span>

                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: width }}
                            dragElastic={0}
                            style={{ x, background }}
                            onDragEnd={handleDragEnd}
                            className="absolute left-1 h-14 w-14 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10"
                        >
                            <Lock size={20} className="text-white" strokeWidth={2.5} />
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full w-full flex items-center justify-center space-x-2"
                    >
                        <ShieldCheck size={20} className="text-white" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                            {successLabel}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hinting track */}
            {!isConfirmed && (
                <div className="absolute inset-0 flex items-center px-4 -z-0">
                    <div className="h-1 w-full bg-[var(--background)]/10 rounded-full overflow-hidden">
                        <motion.div
                            style={{ width: x }}
                            className="h-full bg-[var(--primary)]/20"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
