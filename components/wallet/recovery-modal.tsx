"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Clock, CheckCircle2, AlertCircle, X, ChevronRight, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/lib/store/wallet-store";
import { cn } from "@/lib/utils";

export function RecoveryModal({ onClose }: { onClose: () => void }) {
    const { settings } = useWalletStore();
    const [step, setStep] = useState<"initial" | "requesting" | "waiting" | "complete">("initial");
    const [counts, setCounts] = useState(0);

    const startRecovery = () => {
        setStep("requesting");
        setTimeout(() => setStep("waiting"), 1500);
    };

    useEffect(() => {
        if (step === "waiting") {
            const timer = setInterval(() => {
                setCounts(prev => {
                    if (prev >= settings.guardianCount) {
                        clearInterval(timer);
                        setStep("complete");
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, settings.guardianCount]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--background)]/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--background)] border border-[var(--card-border)] shadow-2xl"
            >
                <div className="p-10 space-y-8 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between">
                        <Badge variant="neutral">Protocol Recovery</Badge>
                        <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            <X size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "initial" && (
                            <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Social Recovery Path</h2>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                        Lost your primary authentication device? Use your pre-configured guardians to regain access to your vault.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--icon-bg)] border border-[var(--card-border)] space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--text-secondary)]">Required Signatures</span>
                                        <span className="text-[var(--text-primary)] font-bold">{settings.guardianCount} of {settings.guardianCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--text-secondary)]">Primary Timelock</span>
                                        <span className="text-[var(--text-primary)] font-bold">48 Hours</span>
                                    </div>
                                </div>
                                <Button onClick={startRecovery} className="w-full h-14 text-base font-semibold" leftIcon={<Users size={20} />}>
                                    Initialize Recovery
                                </Button>
                            </motion.div>
                        )}

                        {step === "requesting" && (
                            <motion.div key="requesting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center space-y-6">
                                <div className="h-16 w-16 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
                                <p className="text-sm font-semibold text-[var(--text-primary)] animate-pulse">Contacting Protocol Guardians...</p>
                            </motion.div>
                        )}

                        {step === "waiting" && (
                            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">Collecting Signatures</h3>
                                    <p className="text-xs text-[var(--text-secondary)]">Waiting for hardware-enforced guardian approval.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[...Array(settings.guardianCount)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center space-y-2">
                                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                                                i < counts ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]" : "bg-[var(--icon-bg)] border-[var(--card-border)] text-[var(--text-secondary)]/20")}>
                                                <Fingerprint size={24} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]/40">G{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/10 flex items-center space-x-3">
                                    <Clock size={16} className="text-[var(--primary)]" />
                                    <p className="text-[11px] text-[var(--primary)]/80 font-medium italic">"The protocol will allow access once all guardians provide valid cryptographic proof."</p>
                                </div>
                            </motion.div>
                        )}

                        {step === "complete" && (
                            <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-6 text-center">
                                <div className="h-16 w-16 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center shadow-2xl shadow-[var(--success)]/20 border border-[var(--success)]/20">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Access Restored</h2>
                                    <p className="text-sm text-[var(--text-secondary)]">Protocol has verified social recovery. You may now generate a new primary key.</p>
                                </div>
                                <Button onClick={onClose} fullWidth className="h-14 bg-[var(--success)] text-white hover:bg-[var(--success)]/90 shadow-lg shadow-[var(--success)]/20">
                                    Finalize Recovery
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
