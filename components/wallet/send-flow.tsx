"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ArrowRight,
    Send,
    Wallet,
    Scan,
    ShieldCheck,
    ShieldAlert,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Fingerprint,
    Users,
    Timer,
    ArrowDown,
    Copy,
    ExternalLink,
    Info,
    Zap,
    Lock
} from "lucide-react";
import { useWalletStore } from "@/lib/store/wallet-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConfidenceMeter } from "@/components/risk/confidence-meter";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { cn } from "@/lib/utils";
import { getRiskColor } from "@/lib/risk-engine";

interface SendFlowProps {
    onClose: () => void;
    prefilledAddress?: string;
    prefilledAmount?: string;
}

type FlowStage = "intent" | "analyzing" | "decision" | "complete";

export function SendFlow({ onClose, prefilledAddress, prefilledAmount }: SendFlowProps) {
    const { 
        currentIntent, 
        riskAnalysis, 
        isAnalyzing, 
        runAnalysis, 
        clearTransaction,
        setIntent,
        balance,
        settings,
        addPendingTransaction,
        addTransaction
    } = useWalletStore();
    
    const [stage, setStage] = useState<FlowStage>("intent");
    const [recipient, setRecipient] = useState(prefilledAddress || "");
    const [amount, setAmount] = useState(prefilledAmount || "");
    const [scanProgress, setScanProgress] = useState(0);

    const handleClose = () => {
        clearTransaction();
        onClose();
    };

    const handleStartAnalysis = () => {
        if (!recipient || !amount) return;
        
        setIntent({
            to: recipient,
            value: amount,
            functionName: "transfer",
        });
        
        setStage("analyzing");
    };

    useEffect(() => {
        if (stage === "analyzing") {
            // Animated scan progress
            const progressInterval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);

            runAnalysis().then(() => {
                setTimeout(() => {
                    setStage("decision");
                }, 500);
            });

            return () => clearInterval(progressInterval);
        }
    }, [stage, runAnalysis]);

    const handleExecute = () => {
        if (!currentIntent || !riskAnalysis) return;

        if (riskAnalysis.action === "DELAY" || riskAnalysis.action === "GUARDIAN_REQUIRED") {
            addPendingTransaction(currentIntent, riskAnalysis);
            addTransaction({
                id: Date.now().toString(),
                type: "Sent",
                asset: "ETH",
                amount: currentIntent.value,
                status: "Timelocked",
                date: "Just now",
                to: currentIntent.to,
                findings: riskAnalysis.findings.map(f => f.title)
            });
        } else {
            addTransaction({
                id: Date.now().toString(),
                type: "Sent",
                asset: "ETH",
                amount: currentIntent.value,
                status: "Secure",
                date: "Just now",
                to: currentIntent.to
            });
        }

        setStage("complete");
        setTimeout(handleClose, 2500);
    };

    const getStatusInfo = () => {
        if (isAnalyzing) return { label: "Analyzing", color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" };
        switch (riskAnalysis?.level) {
            case "SAFE": return { label: "Verified Safe", color: "text-[var(--success)]", bg: "bg-[var(--success)]/10" };
            case "CAUTION": return { label: "Proceed with Caution", color: "text-[var(--caution)]", bg: "bg-[var(--caution)]/10" };
            case "DANGER": return { label: "High Risk Detected", color: "text-[var(--danger)]", bg: "bg-[var(--danger)]/10" };
            case "CRITICAL": return { label: "Threat Blocked", color: "text-[var(--danger)]", bg: "bg-[var(--danger)]/10" };
            default: return { label: "Pending", color: "text-[var(--text-muted)]", bg: "bg-[var(--icon-bg)]" };
        }
    };

    const status = getStatusInfo();

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
                className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--background)] border border-[var(--card-border)] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)]"
            >
                {/* Progress Indicator */}
                <div className="relative h-1 bg-[var(--card-border)]">
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-[var(--primary)]"
                        initial={{ width: "0%" }}
                        animate={{ 
                            width: stage === "intent" ? "33%" : 
                                   stage === "analyzing" ? "66%" : 
                                   "100%" 
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {/* Stage 1: Intent */}
                    {stage === "intent" && (
                        <motion.div
                            key="intent"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-6 md:p-8 space-y-6 md:space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Badge variant="default">Step 1 of 3</Badge>
                                    <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-2">Define Intent</h2>
                                </div>
                                <button onClick={handleClose} className="p-2 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* From Display */}
                                <div className="p-4 rounded-2xl bg-[var(--icon-bg)] border border-[var(--card-border)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                                                <Wallet size={18} className="text-[var(--primary)]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider leading-none mb-1">From Account</p>
                                                <p className="text-sm font-bold text-[var(--text-primary)]">Steller Vault</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider leading-none mb-1">Balance</p>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{balance}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center -my-3 relative z-10">
                                    <div className="h-10 w-10 rounded-full bg-[var(--background)] border border-[var(--card-border)] flex items-center justify-center shadow-sm">
                                        <ArrowDown size={18} className="text-[var(--text-muted)]" />
                                    </div>
                                </div>

                                {/* Recipient Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                                        Recipient Address
                                    </label>
                                    <Input
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        placeholder="0x... or ENS name"
                                        className="h-14 font-mono text-sm bg-[var(--card-bg)] border-[var(--card-border)]"
                                    />
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            Amount
                                        </label>
                                        <button 
                                            onClick={() => setAmount(balance.split(' ')[0])}
                                            className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider hover:opacity-80 transition-opacity"
                                        >
                                            Max
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="h-14 text-lg font-semibold pr-16 bg-[var(--card-bg)] border-[var(--card-border)]"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-secondary)]">
                                            ETH
                                        </span>
                                    </div>
                                </div>

                                {/* Daily Limit Warning */}
                                {parseFloat(amount || "0") > parseFloat(settings.dailyLimit) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20 flex items-start space-x-3"
                                    >
                                        <AlertTriangle size={18} className="text-[var(--warning)] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--warning)]">Exceeds Daily Limit</p>
                                            <p className="text-xs text-[var(--warning)]/70">
                                                This amount exceeds your {settings.dailyLimit} ETH limit. A {settings.timelock}h timelock will apply.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <Button 
                                onClick={handleStartAnalysis}
                                disabled={!recipient || !amount}
                                className="w-full h-14"
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Continue to Analysis
                            </Button>
                        </motion.div>
                    )}

                    {/* Stage 2: Analyzing */}
                    {stage === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Badge variant="default">Step 2 of 3</Badge>
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">Pre-Execution Scan</h2>
                                </div>
                            </div>

                            <div className="flex flex-col items-center py-8 space-y-8">
                                {/* Animated Scan Visual */}
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="h-32 w-32 rounded-full border-2 border-[var(--primary)]/20 border-t-[var(--primary)] flex items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="h-24 w-24 rounded-full border border-[var(--primary)]/10 border-b-[var(--primary)]/40 flex items-center justify-center"
                                        >
                                            <Scan size={32} className="text-[var(--primary)]" />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                <div className="text-center space-y-2">
                                    <p className="text-lg font-bold text-[var(--text-primary)]">Analyzing Transaction</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Checking against threat intelligence...</p>
                                </div>

                                {/* Scan Progress Steps */}
                                <div className="w-full space-y-3">
                                    <ScanStep 
                                        label="Decoding transaction calldata" 
                                        complete={scanProgress > 20} 
                                        active={scanProgress <= 20 && scanProgress > 0}
                                    />
                                    <ScanStep 
                                        label="Verifying recipient address" 
                                        complete={scanProgress > 40} 
                                        active={scanProgress <= 40 && scanProgress > 20}
                                    />
                                    <ScanStep 
                                        label="Checking threat database" 
                                        complete={scanProgress > 60} 
                                        active={scanProgress <= 60 && scanProgress > 40}
                                    />
                                    <ScanStep 
                                        label="Simulating state changes" 
                                        complete={scanProgress > 80} 
                                        active={scanProgress <= 80 && scanProgress > 60}
                                    />
                                    <ScanStep 
                                        label="Computing risk score" 
                                        complete={scanProgress >= 100} 
                                        active={scanProgress <= 100 && scanProgress > 80}
                                    />
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-[var(--icon-bg)] rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[var(--primary)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stage 3: Decision */}
                    {stage === "decision" && riskAnalysis && (
                        <motion.div
                            key="decision"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Badge variant={riskAnalysis.level === "SAFE" ? "safe" : riskAnalysis.level === "CAUTION" ? "caution" : "danger"}>
                                        Step 3 of 3
                                    </Badge>
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">Risk Assessment</h2>
                                </div>
                                <button onClick={handleClose} className="p-2 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Risk Score Display */}
                            <div className="flex items-center justify-center py-6">
                                <ConfidenceMeter score={riskAnalysis.score} size={140} />
                            </div>

                            {/* Status Badge */}
                            <div className={cn("p-4 rounded-xl text-center shadow-lg", status.bg)}>
                                <p className={cn("text-sm font-bold", status.color)}>{status.label}</p>
                                {riskAnalysis.simulation && (
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">{riskAnalysis.simulation.expectedOutcome}</p>
                                )}
                            </div>

                            {/* Findings List */}
                            {riskAnalysis.findings.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">Findings</p>
                                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                                        {riskAnalysis.findings.map((finding) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={finding.id}
                                                className="flex items-start space-x-3 p-4 rounded-xl bg-[var(--background-secondary)]/30 border border-[var(--border-subtle)]"
                                            >
                                                <div className={cn("mt-0.5",
                                                    finding.type === "CRITICAL" || finding.type === "DANGER" ? "text-[var(--destructive)]" :
                                                    finding.type === "CAUTION" ? "text-[var(--warning)]" : "text-[var(--success)]"
                                                )}>
                                                    {finding.type === "SAFE" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{finding.title}</h4>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{finding.description}</p>
                                                    {finding.recommendation && (
                                                        <p className="text-xs text-[var(--primary)] mt-2 flex items-start space-x-1 font-medium bg-[var(--primary)]/5 p-2 rounded-lg border border-[var(--primary)]/10">
                                                            <Info size={12} className="mt-0.5 shrink-0" />
                                                            <span>{finding.recommendation}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Issues Found */}
                            {riskAnalysis.findings.length === 0 && (
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 shadow-lg shadow-[var(--success)]/5">
                                    <ShieldCheck size={20} className="text-[var(--success)]" />
                                    <p className="text-sm font-bold text-[var(--success)]">No security concerns detected. Safe to proceed.</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 space-y-4">
                                {/* Timelock Info */}
                                {riskAnalysis.delayHours && riskAnalysis.action !== "BLOCK" && (
                                    <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[var(--warning)]">
                                        <Clock size={14} />
                                        <span>{riskAnalysis.delayHours}h timelock will be applied</span>
                                    </div>
                                )}

                                {/* Action Based on Risk */}
                                {riskAnalysis.action === "BLOCK" ? (
                                    <Button variant="danger" className="w-full h-14" disabled>
                                        <Lock size={18} className="mr-2" />
                                        Transaction Blocked
                                    </Button>
                                ) : riskAnalysis.action === "GUARDIAN_REQUIRED" ? (
                                    <div className="space-y-3">
                                        <Button variant="secondary" className="w-full h-14" onClick={handleExecute}>
                                            <Users size={18} className="mr-2" />
                                            Request Guardian Approval
                                        </Button>
                                        <p className="text-[10px] font-bold text-center text-[var(--text-muted)] uppercase tracking-widest">
                                            Requires {settings.guardianCount} guardian signatures
                                        </p>
                                    </div>
                                ) : riskAnalysis.action === "DELAY" ? (
                                    <SlideToConfirm
                                        onConfirm={handleExecute}
                                        label={`Slide to Queue (${riskAnalysis.delayHours}h delay)`}
                                    />
                                ) : (
                                    <Button onClick={handleExecute} className="w-full h-14" leftIcon={<Fingerprint size={20} />}>
                                        Authenticate & Send
                                    </Button>
                                )}

                                <button onClick={handleClose} className="w-full py-3 text-[10px] uppercase tracking-[0.2em] font-black text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                                    Cancel Transaction
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Stage 4: Complete */}
                    {stage === "complete" && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-16 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-20 w-20 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)] border border-[var(--success)]/20 shadow-xl shadow-[var(--success)]/10"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                                    {riskAnalysis?.action === "DELAY" ? "Transaction Queued" : "Transaction Sent"}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {riskAnalysis?.action === "DELAY" 
                                        ? `Your transaction is in the timelock queue. It will execute in ${riskAnalysis.delayHours}h.`
                                        : "Your transaction has been broadcasted to the network."
                                    }
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

function ScanStep({ label, complete, active }: { label: string; complete: boolean; active: boolean }) {
    return (
        <div className={cn(
            "flex items-center space-x-3 p-3 rounded-xl transition-all border border-transparent",
            active && "bg-[var(--primary)]/10 border-[var(--primary)]/20 shadow-lg shadow-[var(--primary)]/5",
            complete && "bg-[var(--success)]/5"
        )}>
            <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                complete ? "bg-[var(--success)] text-white" : active ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-[var(--icon-bg)] text-[var(--text-muted)]"
            )}>
                {complete ? <CheckCircle2 size={14} /> : active ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-3 w-3 rounded-full border border-white border-t-transparent"
                    />
                ) : null}
            </div>
            <span className={cn(
                "text-sm font-medium transition-all",
                complete ? "text-[var(--success)]" : active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
            )}>
                {label}
            </span>
        </div>
    );
}
