"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-switch focus:outline-none"
            aria-label="Toggle Theme"
        >
            <motion.div
                className="theme-switch-thumb"
                initial={false}
                animate={{
                    x: theme === "dark" ? 32 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
            >
                {theme === "dark" ? (
                    <Moon size={14} className="text-white" strokeWidth={2.5} />
                ) : (
                    <Sun size={14} className="text-white" strokeWidth={2.5} />
                )}
            </motion.div>
        </button>
    );
}
