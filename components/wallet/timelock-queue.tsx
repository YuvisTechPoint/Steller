"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    X,
    Timer,
    CheckCircle2,
    XCircle,
    ArrowRight,
    AlertTriangle,
    ShieldCheck,
    Trash2,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/lib/store/wallet-store";
import { cn } from "@/lib/utils";

interface TimelockQueueProps {
    onClose: () => void;
}

export function TimelockQueue({ onClose }: TimelockQueueProps) {
    const { pendingTransactions, cancelPendingTransaction, executePendingTransaction } = useWalletStore();
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeRemaining = (executeAt: number) => {
        const remaining = Math.max(0, executeAt - now);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        if (remaining === 0) return "Ready";
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };

    const getProgress = (createdAt: number, executeAt: number) => {
        const total = executeAt - createdAt;
        const elapsed = now - createdAt;
        return Math.min(100, (elapsed / total) * 100);
    };

    const pendingCount = pendingTransactions.filter(tx => tx.status === "pending").length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--background)]/90 backdrop-blur-xl"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--background)] border border-[var(--card-border)] shadow-2xl"
            >
                <div className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between sticky top-0 bg-[var(--background)] z-10 -m-1 p-1">
                        <div className="space-y-1">
                            <Badge variant="default">Timelock Queue</Badge>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">Pending Transactions</h2>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]">
                            <X size={20} />
                        </button>
                    </div>

                    {pendingCount > 0 && (
                        <div className="flex items-center space-x-2 p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                            <Clock size={16} className="text-[var(--primary)]" />
                            <p className="text-sm text-[var(--primary)]">
                                {pendingCount} transaction{pendingCount !== 1 ? "s" : ""} in queue
                            </p>
                        </div>
                    )}

                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {pendingTransactions.length === 0 ? (
                            <div className="py-12 flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-[var(--icon-bg)] flex items-center justify-center">
                                    <Timer size={28} className="text-[var(--text-secondary)]/40" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">No Pending Transactions</p>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        High-risk transactions will appear here with a safety delay
                                    </p>
                                </div>
                            </div>
                        ) : (
                            pendingTransactions.map((tx, index) => {
                                const isReady = now >= tx.executeAt;
                                const progress = getProgress(tx.createdAt, tx.executeAt);
                                
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-5 rounded-2xl border transition-all",
                                            tx.status === "cancelled" && "opacity-50 bg-white/[0.01] border-white/5",
                                            tx.status === "executed" && "bg-[#4FD1C5]/5 border-[#4FD1C5]/20",
                                            tx.status === "pending" && (isReady ? "bg-[#4FD1C5]/5 border-[#4FD1C5]/20" : "bg-white/[0.02] border-white/5")
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                                                        {tx.intent.value} ETH
                                                    </span>
                                                    <Badge 
                                                        variant={
                                                            tx.status === "cancelled" ? "neutral" :
                                                            tx.status === "executed" ? "safe" :
                                                            isReady ? "safe" : "caution"
                                                        }
                                                    >
                                                        {tx.status === "cancelled" ? "Cancelled" :
                                                         tx.status === "executed" ? "Executed" :
                                                         isReady ? "Ready" : "Pending"}
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                                                    To: {tx.intent.to.slice(0, 10)}...{tx.intent.to.slice(-6)}
                                                </p>
                                            </div>
                                            
                                            {tx.status === "pending" && (
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "text-lg font-mono font-bold",
                                                        isReady ? "text-[var(--success)]" : "text-[var(--warning)]"
                                                    )}>
                                                        {formatTimeRemaining(tx.executeAt)}
                                                    </p>
                                                    <p className="text-[10px] text-[var(--text-secondary)]">
                                                        {isReady ? "Can execute now" : "Remaining"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        {tx.status === "pending" && !isReady && (
                                            <div className="mb-4">
                                                <div className="h-1.5 bg-[var(--icon-bg)] rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-[var(--primary)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Risk Findings */}
                                        {tx.analysis.findings.length > 0 && tx.status === "pending" && (
                                            <div className="mb-4 space-y-2">
                                                {tx.analysis.findings.slice(0, 2).map((finding, i) => (
                                                    <div key={i} className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
                                                        <AlertTriangle size={12} className={cn(
                                                            finding.type === "DANGER" ? "text-[var(--danger)]" :
                                                            finding.type === "CAUTION" ? "text-[var(--warning)]" : "text-[var(--text-secondary)]"
                                                        )} />
                                                        <span>{finding.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {tx.status === "pending" && (
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => cancelPendingTransaction(index)}
                                                    className="flex-1 text-[var(--danger)] hover:bg-[var(--danger)]/10"
                                                >
                                                    <XCircle size={14} className="mr-1.5" />
                                                    Cancel
                                                </Button>
                                                {isReady && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => executePendingTransaction(index)}
                                                        className="flex-1"
                                                    >
                                                        <Play size={14} className="mr-1.5" />
                                                        Execute
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {/* Status Icons */}
                                        {tx.status === "cancelled" && (
                                            <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
                                                <XCircle size={14} />
                                                <span>Transaction was cancelled</span>
                                            </div>
                                        )}
                                        {tx.status === "executed" && (
                                            <div className="flex items-center space-x-2 text-xs text-[var(--success)]">
                                                <CheckCircle2 size={14} />
                                                <span>Transaction executed successfully</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Info Footer */}
                    <div className="p-4 rounded-xl bg-[var(--icon-bg)] border border-[var(--card-border)]">
                        <div className="flex items-start space-x-3">
                            <ShieldCheck size={16} className="text-[var(--primary)] mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-[var(--text-primary)]">Why Timelocks?</p>
                                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                                    Timelocks give you time to review and cancel suspicious transactions before they execute. 
                                    This protects against panic-driven decisions and delayed-action attacks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
