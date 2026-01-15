"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    ShieldOff,
    AlertTriangle,
    CheckCircle2,
    X,
    ArrowRight,
    Clock,
    Fingerprint,
    AlertCircle,
    Eye,
    EyeOff,
    Zap,
    Lock,
    Unlock,
    FileWarning,
    ShieldCheck,
    Timer,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComparisonModeProps {
    onClose: () => void;
}

type SimulationStep = "idle" | "request" | "signing" | "result";

export function ComparisonMode({ onClose }: ComparisonModeProps) {
    const [step, setStep] = useState<SimulationStep>("idle");
    const [conventionalStep, setConventionalStep] = useState<SimulationStep>("idle");
    const [safeStep, setSafeStep] = useState<SimulationStep>("idle");

    const startSimulation = () => {
        setStep("request");
        setConventionalStep("request");
        setSafeStep("request");

        // Conventional wallet signs immediately
        setTimeout(() => {
            setConventionalStep("signing");
            setTimeout(() => {
                setConventionalStep("result");
            }, 1000);
        }, 500);

        // Safe wallet goes through analysis
        setTimeout(() => {
            setSafeStep("signing");
            setTimeout(() => {
                setSafeStep("result");
            }, 2000);
        }, 1500);
    };

    const resetSimulation = () => {
        setStep("idle");
        setConventionalStep("idle");
        setSafeStep("idle");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--background)]/95 backdrop-blur-xl"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--background)] border border-[var(--card-border)] shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-[var(--card-border)] flex items-center justify-between sticky top-0 bg-[var(--background)] z-20">
                    <div className="space-y-1">
                        <Badge variant="caution">Security Comparison</Badge>
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight mt-2">
                            Conventional vs Protected Wallet
                        </h2>
                        <p className="text-xs md:text-sm text-[var(--text-secondary)]">
                            Watch how each wallet handles a malicious approval request
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)] transition-all"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Comparison Grid */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Conventional Wallet Side */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-[var(--icon-bg)] flex items-center justify-center border border-[var(--card-border)]">
                                <ShieldOff size={20} className="text-[var(--text-muted)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Standard Wallet</h3>
                                <p className="text-xs text-[var(--text-muted)]">No pre-execution protection</p>
                            </div>
                        </div>

                        <Card className="p-6 border-[var(--card-border)] bg-[var(--card-bg)] min-h-[350px] md:min-h-[400px] relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {conventionalStep === "idle" && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center h-full py-16 text-center space-y-4"
                                    >
                                        <div className="h-16 w-16 rounded-full bg-[var(--icon-bg)] border border-[var(--card-border)] flex items-center justify-center">
                                            <EyeOff size={28} className="text-[var(--text-muted)]" />
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            Waiting to simulate transaction...
                                        </p>
                                    </motion.div>
                                )}

                                {conventionalStep === "request" && (
                                    <motion.div
                                        key="request"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="bg-[var(--icon-bg)] p-4 rounded-xl flex items-center justify-between border border-[var(--card-border)]">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/40" />
                                                <span className="text-sm font-medium text-[var(--text-primary)]">Main Account</span>
                                            </div>
                                            <span className="text-xs text-[var(--text-muted)] bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--card-border)]">Ethereum</span>
                                        </div>
                                        <div className="text-center py-6 space-y-3">
                                            <div className="h-12 w-12 rounded-full border-2 border-orange-500 mx-auto flex items-center justify-center text-2xl">🦄</div>
                                            <h4 className="text-lg text-[var(--text-primary)]">Uniswap V3?</h4>
                                            <p className="text-xs text-[var(--text-muted)] font-mono">0xbad72921a4f00b...</p>
                                        </div>
                                        <div className="border border-[var(--card-border)] rounded-lg p-4 text-center">
                                            <p className="text-xs text-[var(--text-muted)] mb-2">Permission Request</p>
                                            <p className="text-lg font-bold text-[var(--text-primary)]">setApprovalForAll</p>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-xs text-[var(--text-muted)]">
                                            <FileWarning size={14} />
                                            <span>No risk analysis available</span>
                                        </div>
                                    </motion.div>
                                )}

                                {conventionalStep === "signing" && (
                                    <motion.div
                                        key="signing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-16 space-y-6"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center"
                                        >
                                            <Fingerprint size={32} className="text-primary" />
                                        </motion.div>
                                        <p className="text-sm text-[var(--text-secondary)]">Signing transaction...</p>
                                        <p className="text-xs text-[var(--text-muted)]">No security checks performed</p>
                                    </motion.div>
                                )}

                                {conventionalStep === "result" && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-12 space-y-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="h-20 w-20 rounded-full bg-[var(--danger)]/20 flex items-center justify-center"
                                        >
                                            <AlertCircle size={40} className="text-[var(--danger)]" />
                                        </motion.div>
                                        <div className="text-center space-y-2">
                                            <h4 className="text-xl font-bold text-[var(--danger)]">Wallet Compromised</h4>
                                            <p className="text-sm text-[var(--text-secondary)] max-w-[250px]">
                                                Malicious contract granted unlimited access to all your NFTs and tokens.
                                            </p>
                                        </div>
                                        <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-xl p-4 w-full">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--danger)]">Assets at Risk</span>
                                                <span className="text-[var(--danger)] font-bold">$34,415.82</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </div>

                    {/* Protected Wallet Side */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                                <Shield size={20} className="text-[var(--primary)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Steller Vault</h3>
                                <p className="text-xs text-[var(--text-muted)]">Pre-execution protection enabled</p>
                            </div>
                        </div>

                        <Card className="p-6 border-[var(--card-border)] bg-[var(--primary)]/5 min-h-[350px] md:min-h-[400px] relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {safeStep === "idle" && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center h-full py-16 text-center space-y-4"
                                    >
                                        <div className="h-16 w-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                                            <Eye size={28} className="text-[var(--primary)]" />
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            Ready to demonstrate protection...
                                        </p>
                                    </motion.div>
                                )}

                                {safeStep === "request" && (
                                    <motion.div
                                        key="request"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <Badge variant="default">Pre-Execution Scan Initiated</Badge>
                                        <div className="space-y-3 mt-4">
                                            <ScanStep icon={Eye} label="Decoding calldata..." status="complete" />
                                            <ScanStep icon={FileWarning} label="Checking threat database..." status="active" />
                                            <ScanStep icon={Users} label="Validating contract age..." status="pending" />
                                            <ScanStep icon={Timer} label="Analyzing approval scope..." status="pending" />
                                        </div>
                                    </motion.div>
                                )}

                                {safeStep === "signing" && (
                                    <motion.div
                                        key="signing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                className="h-10 w-10 rounded-full border-2 border-[var(--danger)] border-t-transparent"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">Threat Detected</p>
                                                <p className="text-xs text-[var(--danger)]">Analyzing risk vectors...</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <ScanStep icon={Eye} label="Decoding calldata" status="complete" />
                                            <ScanStep icon={AlertTriangle} label="THREAT: Known phishing contract" status="danger" />
                                            <ScanStep icon={Lock} label="Blocking transaction..." status="active" />
                                        </div>
                                    </motion.div>
                                )}

                                {safeStep === "result" && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-12 space-y-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="h-20 w-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center"
                                        >
                                            <ShieldCheck size={40} className="text-[var(--success)]" />
                                        </motion.div>
                                        <div className="text-center space-y-2">
                                            <h4 className="text-xl font-bold text-[var(--success)]">Attack Prevented</h4>
                                            <p className="text-sm text-[var(--text-secondary)] max-w-[250px]">
                                                Steller identified the malicious contract and blocked the transaction before execution.
                                            </p>
                                        </div>
                                        <div className="bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-xl p-4 w-full space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--success)]">Assets Protected</span>
                                                <span className="text-[var(--success)] font-bold">$34,415.82</span>
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)] space-y-1">
                                                <p>• Contract flagged in threat database</p>
                                                <p>• Unlimited approval request blocked</p>
                                                <p>• No signatures exposed</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 md:p-8 border-t border-[var(--card-border)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-[var(--text-muted)]">
                        {step === "idle" ? (
                            "Click to start the security comparison demonstration"
                        ) : step === "request" ? (
                            <span className="flex items-center space-x-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="h-4 w-4 rounded-full border-2 border-[var(--primary)] border-t-transparent"
                                />
                                <span>Processing transaction request...</span>
                            </span>
                        ) : (
                            "Demonstration complete"
                        )}
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        {step !== "idle" && conventionalStep === "result" && (
                            <Button variant="ghost" onClick={resetSimulation} className="flex-1 md:flex-none">
                                Reset Demo
                            </Button>
                        )}
                        {step === "idle" && (
                            <Button onClick={startSimulation} leftIcon={<Zap size={18} />} className="flex-1 md:flex-none">
                                Start Simulation
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ScanStep({ icon: Icon, label, status }: { icon: any; label: string; status: "pending" | "active" | "complete" | "danger" }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "flex items-center space-x-3 p-3 rounded-xl transition-all",
                status === "active" && "bg-[var(--primary)]/10 border border-[var(--primary)]/20",
                status === "danger" && "bg-[var(--danger)]/10 border border-[var(--danger)]/20",
                status === "complete" && "bg-[var(--success)]/5"
            )}
        >
            <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                status === "pending" && "bg-[var(--icon-bg)] text-[var(--text-muted)]/40",
                status === "active" && "bg-[var(--primary)]/20 text-[var(--primary)]",
                status === "complete" && "bg-[var(--success)]/20 text-[var(--success)]",
                status === "danger" && "bg-[var(--danger)]/20 text-[var(--danger)]"
            )}>
                {status === "active" ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                    />
                ) : status === "complete" ? (
                    <CheckCircle2 size={16} />
                ) : (
                    <Icon size={16} />
                )}
            </div>
            <span className={cn(
                "text-sm",
                status === "pending" && "text-[var(--text-muted)]/40",
                status === "active" && "text-[var(--text-primary)]",
                status === "complete" && "text-[var(--success)]",
                status === "danger" && "text-[var(--danger)] font-semibold"
            )}>
                {label}
            </span>
        </motion.div>
    );
}
