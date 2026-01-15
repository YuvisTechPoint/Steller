"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, ShieldCheck, Clock, CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, Fingerprint, LucideIcon, ArrowDown, Wallet } from "lucide-react";
import { useWalletStore } from "@/lib/store/wallet-store";
import { Button } from "@/components/ui/button";
import { ConfidenceMeter } from "@/components/risk/confidence-meter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";

export function TransactionGuard({ onClose }: { onClose: () => void }) {
    const { currentIntent, riskAnalysis, isAnalyzing, runAnalysis, clearTransaction, balance } = useWalletStore();
    const [complete, setComplete] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);

    useEffect(() => {
        runAnalysis();
    }, []);

    const handleClose = () => {
        clearTransaction();
        onClose();
    };

    const handleExecute = () => {
        setComplete(true);
        setTimeout(handleClose, 2500);
    };

    if (!currentIntent) return null;

    const getStatusInfo = () => {
        if (isAnalyzing) return { label: "Analyzing Interaction", color: "text-[var(--text-muted)]" };
        switch (riskAnalysis?.level) {
            case "SAFE": return { label: "Verified Safe", color: "text-[var(--success)]" };
            case "CAUTION": return { label: "Limited Confidence", color: "text-[var(--caution)]" };
            default: return { label: "Protection Alert", color: "text-[var(--danger)]" };
        }
    };

    const status = getStatusInfo();
    const mockAfterBalance = (parseFloat(balance) - parseFloat(currentIntent.value)).toFixed(2);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--background)]/80 backdrop-blur-xl"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--background)] border border-[var(--card-border)] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)]"
            >
                {complete ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-6 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="h-20 w-20 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Auth Successful</h3>
                            <p className="text-[var(--text-secondary)] text-sm">Transaction broadcasted to the network.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row min-h-[500px]">
                        {/* Simulation Visual */}
                        <div className="w-full md:w-5/12 bg-[var(--icon-bg)] p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--card-border)]">
                            <ConfidenceMeter
                                score={riskAnalysis?.score || 0}
                                isLoading={isAnalyzing}
                                size={180}
                                className="mb-8"
                            />
                            <div className="text-center space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Risk Assessment</p>
                                <p className={cn("text-lg font-bold transition-colors duration-500 pace-font", status.color)}>
                                    {status.label}
                                </p>
                            </div>

                            {!isAnalyzing && (
                                <button
                                    onClick={() => setShowSimulation(!showSimulation)}
                                    className="mt-8 text-[10px] uppercase font-bold tracking-widest text-[var(--primary)]/60 hover:text-[var(--primary)] transition-colors"
                                >
                                    {showSimulation ? "Hide Simulation" : "View Simulation"}
                                </button>
                            )}
                        </div>

                        {/* Details Area */}
                        <div className="w-full md:w-7/12 p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-none">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <Badge variant="neutral">Pre-Execution Scan</Badge>
                                    <button onClick={handleClose} className="p-2 -mr-2 rounded-full hover:bg-[var(--glass-bg)] text-[var(--text-secondary)] transition-all">
                                        <X size={20} strokeWidth={1.5} />
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {showSimulation ? (
                                        <motion.div
                                            key="simulation"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]/50">Outcome Prediction</h3>
                                            <div className="space-y-4">
                                                <div className="p-5 rounded-2xl bg-[var(--icon-bg)] border border-[var(--card-border)] space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center">
                                                                <Wallet size={16} className="text-[var(--text-secondary)]" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-[var(--text-primary)]">Current Balance</span>
                                                        </div>
                                                        <span className="text-sm font-mono text-[var(--text-secondary)]">{balance}</span>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <ArrowDown size={14} className="text-[var(--primary)]/40" />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                                                                <ArrowRight size={16} className="text-[var(--primary)]" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-[var(--text-primary)]">Prediction</span>
                                                        </div>
                                                        <span className="text-sm font-mono text-[var(--text-primary)] font-bold">{mockAfterBalance} ETH</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-[var(--success)]/5 border border-[var(--success)]/10">
                                                    <p className="text-[11px] text-[var(--success)]/80 leading-relaxed font-medium">
                                                        The protocol has simulated the state change. No unexpected asset outflows were detected outside of the intended value.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="findings"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">Guardian Review</h2>
                                                <p className="text-[var(--text-secondary)] font-mono text-[10px] mt-1.5 truncate opacity-40">
                                                    To: {currentIntent.to}
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                {riskAnalysis?.findings.map((finding) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        key={finding.id}
                                                        className="flex items-start space-x-3 p-4 rounded-xl bg-[var(--icon-bg)] border border-[var(--card-border)]"
                                                    >
                                                        <div className={cn("mt-0.5",
                                                            finding.type === "CRITICAL" || finding.type === "DANGER" ? "text-[var(--danger)]" :
                                                                finding.type === "CAUTION" ? "text-[var(--warning)]" : "text-[var(--success)]"
                                                        )}>
                                                            <ShieldAlert size={16} strokeWidth={1.5} />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <h4 className="text-xs font-semibold text-[var(--text-primary)]">{finding.title}</h4>
                                                            <p className="text-[11px] text-[var(--text-secondary)]/70 leading-relaxed">{finding.description}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {riskAnalysis && riskAnalysis.findings.length === 0 && !isAnalyzing && (
                                                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-[var(--success)]/5 border border-[var(--success)]/10">
                                                        <ShieldCheck size={16} className="text-[var(--success)]" />
                                                        <p className="text-xs text-[var(--success)]/80">No threats detected. Interaction verified safe.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-8 space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)]/50 uppercase tracking-[0.1em] px-1">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={12} strokeWidth={2} />
                                        {riskAnalysis?.action === "DELAY" ? "Authorized with 12h Delay" : "Instant Authentication"}
                                    </span>
                                    <span className="text-[var(--text-primary)]">{currentIntent.value} ETH</span>
                                </div>

                                {riskAnalysis?.action === "BLOCK" ? (
                                    <Button variant="danger" className="w-full h-14 text-sm font-bold" disabled>
                                        Protocol Blocked Interaction
                                    </Button>
                                ) : riskAnalysis?.action === "DELAY" ? (
                                    <SlideToConfirm
                                        onConfirm={handleExecute}
                                        label="Slide to Authorize (12h Delay)"
                                        className="h-16"
                                    />
                                ) : (
                                    <Button
                                        onClick={handleExecute}
                                        isLoading={isAnalyzing}
                                        disabled={isAnalyzing}
                                        className="w-full h-14 text-base font-semibold transition-all shadow-lg shadow-[var(--primary)]/10"
                                        leftIcon={<Fingerprint size={20} />}
                                    >
                                        Authenticate Interaction
                                    </Button>
                                )}
                                <button onClick={handleClose} className="w-full py-2 text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--text-secondary)]/40 hover:text-[var(--text-secondary)] transition-colors">
                                    Abandon Interaction
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
