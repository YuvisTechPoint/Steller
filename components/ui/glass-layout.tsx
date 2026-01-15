"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("relative min-h-screen w-full overflow-x-hidden bg-background text-foreground", className)}>
            {/* Ambient Background Effects - Ultra Rich */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Moving Mesh Gradients */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[var(--primary)]/10 blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -45, 0],
                        x: [0, -150, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--success)]/5 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px]"
                />
            </div>

            {/* Content Container */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 container mx-auto px-6 py-12 lg:px-8 max-w-6xl"
            >
                {children}
            </motion.main>
        </div>
    );
}

