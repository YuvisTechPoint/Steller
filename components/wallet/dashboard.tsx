"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    ArrowUpRight,
    Shield,
    Clock,
    LayoutGrid,
    Search,
    Bell,
    ArrowDownLeft,
    ExternalLink,
    X,
    Lock,
    ChevronRight,
    Wallet,
    Target,
    Activity,
    CreditCard,
    ShieldCheck,
    AlertCircle,
    Snowflake,
    ShieldAlert,
    ChevronDown,
    Zap,
    Timer,
    GitCompare,
    Send,
    ArrowDownUp
} from "lucide-react";
import { useWalletStore, Asset, TransactionRecord } from "@/lib/store/wallet-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TransactionGuard } from "./transaction-guard";
import { SecuritySettings } from "@/components/settings/security-settings";
import { ConventionalModal } from "./conventional-modal";
import { RecoveryModal } from "./recovery-modal";
import { ComparisonMode } from "./comparison-mode";
import { SendFlow } from "./send-flow";
import { EmergencyFreeze } from "./emergency-freeze";
import { TimelockQueue } from "./timelock-queue";
import { RealTimeDemo } from "./realtime-demo";
import { NotificationCenter } from "./notification-center";
import { SwapModal } from "./swap-modal";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { LogOut, User as UserIcon } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const Icon = ({ icon: IconComponent, size = 20, className = "" }: { icon: any, size?: number, className?: string }) => (
    <IconComponent
        size={size}
        strokeWidth={1.5}
        className={cn("text-[var(--text-secondary)] opacity-60", className)}
    />
);

export function WalletDashboard() {
    const {
        address, balance, assets, history, setIntent,
        settings, activateEmergencyFreeze, deactivateEmergencyFreeze,
        pendingTransactions
    } = useWalletStore();
    const { user, logout } = useAuth();
    const [showSend, setShowSend] = useState(false);
    const [showSendFlow, setShowSendFlow] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [mode, setMode] = useState<"safe" | "conventional">("safe");
    const [showConventional, setShowConventional] = useState(false);
    const [view, setView] = useState<"assets" | "activity">("assets");
    const [showRecovery, setShowRecovery] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showEmergencyFreeze, setShowEmergencyFreeze] = useState(false);
    const [showTimelockQueue, setShowTimelockQueue] = useState(false);
    const [showRealTimeDemo, setShowRealTimeDemo] = useState(false);
    const [showSwap, setShowSwap] = useState(false);

    const pendingCount = pendingTransactions.filter(tx => tx.status === "pending").length;

    const handleSimulateScam = () => {
        if (mode === "conventional") {
            setShowConventional(true);
        } else {
            setIntent({
                to: "0xbad72921a4f00b123456789abcdef",
                value: "0.5",
                functionName: "claim",
            });
            setShowSend(true);
        }
    };

    const handleSimulateSafe = () => {
        setShowSendFlow(true);
    };

    const handleSimulateScamTest = () => {
        setIntent({
            to: "0xbad72921a4f00b123456789abcdef",
            value: "0.5",
            functionName: "claim",
        });
        setShowSend(true);
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pb-24"
        >
            {/* Header Redesign */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-16 gap-6">
                <motion.div variants={itemVariants} className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-[0.2em] text-[var(--text-primary)] uppercase">Steller</h1>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none">Protocol Infinity</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 md:gap-8">
                    {/* Exotic Gliding Toggle */}
                    <div className="relative flex items-center bg-[var(--icon-bg)] rounded-2xl p-1.5 border border-[var(--card-border)] shadow-inner">
                        <motion.div
                            className="absolute h-[calc(100%-12px)] rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm"
                            initial={false}
                            animate={{
                                x: mode === "safe" ? 0 : 76,
                                width: mode === "safe" ? 64 : 88
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setMode("safe")}
                            className={cn(
                                "relative z-10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors",
                                mode === "safe" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                            )}
                        >
                            Vault
                        </button>
                        <button
                            onClick={() => setMode("conventional")}
                            className={cn(
                                "relative z-10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors",
                                mode === "conventional" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                            )}
                        >
                            Standard
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="flex items-center space-x-3 pr-2 md:pr-4 border-r border-[var(--card-border)]">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-[var(--text-primary)] leading-none capitalize">{user?.authMethod} ID</p>
                                <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight">{user?.displayName}</p>
                            </div>
                            <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-[var(--icon-bg)] border border-[var(--card-border)] flex items-center justify-center">
                                <UserIcon size={16} className="text-[var(--text-secondary)]" />
                            </div>
                        </div>

                        <ThemeToggle />
                        <NotificationCenter />
                    </div>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-start">
                {/* Main Content Area */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-12 md:space-y-16">
                    {/* Hero Balance Section */}
                    <motion.div variants={itemVariants} className="space-y-10">
                        <div className="flex flex-col space-y-3">
                            <p className="label-caps opacity-70">Total Asset Valuation</p>
                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[var(--text-primary)] leading-none">{balance}</h2>
                                <span className="text-base md:text-xl font-bold text-success/90 bg-success/10 px-3 py-1 rounded-lg">+$1,402.10 today</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:flex sm:items-center flex-wrap gap-4">
                            <Button size="lg" onClick={handleSimulateSafe} className="w-full sm:w-auto btn-tactile h-14 px-8" leftIcon={<Send size={18} />}>
                                Send Assets
                            </Button>
                            <Button size="lg" variant="secondary" onClick={() => setShowSwap(true)} className="w-full sm:w-auto h-14 px-6 border-transparent bg-[var(--success)]/10 hover:bg-[var(--success)]/15 text-[var(--success)]" leftIcon={<ArrowDownUp size={18} />}>
                                Swap Tokens
                            </Button>
                            <Button size="lg" variant="secondary" onClick={handleSimulateScamTest} className="w-full sm:w-auto h-14 px-6 border-transparent bg-[var(--icon-bg)] hover:bg-[var(--card-hover-bg)]">
                                Test Scam Block
                            </Button>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    onClick={() => setShowRealTimeDemo(true)} 
                                    className="flex-1 sm:flex-none h-14 px-6 bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/15" 
                                    leftIcon={<Activity size={16} />}
                                >
                                    Live Demo
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => setShowComparison(true)} className="flex-1 sm:flex-none h-14 px-6 bg-[var(--icon-bg)] border-[var(--card-border)]" leftIcon={<GitCompare size={16} />}>
                                    Compare
                                </Button>
                                {pendingCount > 0 && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => setShowTimelockQueue(true)}
                                        className="flex-1 sm:flex-none relative h-14 px-6 bg-[var(--icon-bg)] border-[var(--card-border)] font-bold text-caution"
                                        leftIcon={<Timer size={16} />}
                                    >
                                        {pendingCount}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* View Switcher & List */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center space-x-6 border-b border-[var(--card-border)] pb-2">
                            <button
                                onClick={() => setView("assets")}
                                className={cn("text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all",
                                    view === "assets" ? "border-primary text-[var(--text-primary)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]")}
                            >
                                Assets
                            </button>
                            <button
                                onClick={() => setView("activity")}
                                className={cn("text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all",
                                    view === "activity" ? "border-primary text-[var(--text-primary)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]")}
                            >
                                Activity
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {view === "assets" ? (
                                <motion.div
                                    key="assets"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="grid grid-cols-1 gap-3"
                                >
                                    {assets.map((asset, i) => (
                                        <Card key={i} className="p-4 md:p-5 flex items-center justify-between group cursor-default border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]/20 transition-all hover:scale-[1.01]">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-[var(--icon-bg)] flex items-center justify-center border border-[var(--card-border)] overflow-hidden relative group-hover:bg-[var(--primary)]/5 transition-colors">
                                                    <span className="text-xs font-black text-[var(--text-primary)] opacity-40">{asset.symbol[0]}</span>
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)]"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">{asset.name}</p>
                                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{asset.balance} {asset.symbol}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-[var(--text-primary)]">${asset.valueInUsd}</p>
                                                <p className={cn("text-[10px] font-bold uppercase tracking-widest", asset.change24h.startsWith("+") ? "text-[var(--success)]" : "text-[var(--danger)]")}>
                                                    {asset.change24h}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="activity"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-2"
                                >
                                    {history.map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-primary/10 transition-all group">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 rounded-xl bg-[var(--icon-bg)] flex items-center justify-center border border-[var(--card-border)]">
                                                    {tx.type === "Sent" ? <Icon icon={ArrowUpRight} size={18} /> :
                                                        tx.type === "Received" ? <Icon icon={ArrowDownLeft} size={18} /> :
                                                            <Icon icon={Clock} size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">{tx.type} {tx.asset}</p>
                                                    <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest leading-none mt-0.5">{tx.date} • {tx.status}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[var(--text-primary)]">{tx.amount} {tx.asset !== "Uniswap" ? tx.asset : ""}</p>
                                                <Badge variant="neutral" className="bg-[var(--icon-bg)] border-[var(--card-border)] text-[var(--text-muted)]">Detail</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Sidebar Redesign */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-8 lg:space-y-12">
                    <motion.div variants={itemVariants}>
                        <Card interactive={false} className={cn("p-6 md:p-8 border-[var(--card-border)] transition-all duration-500 overflow-hidden relative",
                            settings.emergencyFreezeActive ? "bg-[var(--danger)]/5 border-[var(--danger)]/20" : "bg-[var(--card-bg)]")}>

                            {/* Exotic Background Glow */}
                            <div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20",
                                settings.emergencyFreezeActive ? "bg-[var(--danger)]" : "bg-[var(--success)]")} />

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center relative shadow-sm transition-colors duration-500",
                                        settings.emergencyFreezeActive ? "bg-[var(--danger)]/10" : "bg-[var(--success)]/10")}>
                                        {settings.emergencyFreezeActive ? (
                                            <ShieldAlert size={28} className="text-[var(--danger)]" strokeWidth={1.5} />
                                        ) : (
                                            <ShieldCheck size={28} className="text-[var(--success)]" strokeWidth={1.5} />
                                        )}
                                        <div className={cn("absolute inset-0 rounded-2xl border animate-quiet-pulse transition-colors duration-500",
                                            settings.emergencyFreezeActive ? "border-[var(--danger)]/50" : "border-[var(--success)]/50")} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Vault Integrity</p>
                                        <div className="flex items-center justify-end space-x-1 mt-1">
                                            <div className="h-1 w-8 rounded-full bg-[var(--success)]" />
                                            <div className="h-1 w-8 rounded-full bg-[var(--success)]" />
                                            <div className={cn("h-1 w-8 rounded-full transition-colors", settings.guardianCount >= 3 ? "bg-[var(--success)]" : "bg-[var(--icon-bg)]")} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
                                        {settings.emergencyFreezeActive ? "EMERGENCY LOCKDOWN" : "SECURED PROTOCOL"}
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                                        {settings.emergencyFreezeActive
                                            ? "Protocol detected potential threat. All egress gateways have been severed. Recovery required."
                                            : `Active verification via ${settings.guardianCount} guardians and ${settings.timelock}h timelock.`}
                                    </p>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center space-x-2 text-[11px] font-black text-[var(--primary)] uppercase tracking-widest">
                                            <Zap size={14} className="animate-pulse" />
                                            <span>Pulse Active</span>
                                        </div>
                                        <div className="text-[11px] font-black text-[var(--text-muted)]">
                                            {settings.emergencyFreezeActive ? "0%" : "100%"} HEALTH
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Pending Timelocks Section */}
                    {pendingCount > 0 && (
                        <motion.div variants={itemVariants} className="space-y-4">
                            <p className="label-caps">Pending Approval</p>
                            <div className="space-y-3">
                                {pendingTransactions.filter(tx => tx.status === "pending").map((tx, i) => (
                                    <Card key={i} className="p-4 border-[var(--warning)]/20 bg-[var(--warning)]/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Clock size={12} className="text-[var(--warning)]" />
                                                <span className="text-[10px] font-bold text-[var(--warning)] uppercase tracking-widest">Timelock Active</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-[var(--text-muted)]">11:59 remaining</span>
                                        </div>
                                        <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{tx.intent.functionName || 'Transaction'}</p>
                                        <p className="text-[10px] font-medium text-[var(--text-secondary)] truncate mb-3">To: {tx.intent.to}</p>
                                        <Button variant="outline" size="sm" className="w-full h-9 text-[10px] bg-[var(--text-primary)] text-[var(--background)] border-transparent hover:bg-[var(--danger)] hover:text-white">
                                            Revoke Action
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Featured: Quick Settings Section */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="label-caps">Preferences</p>
                            <button className="text-[10px] font-bold text-primary/60 hover:text-primary uppercase tracking-widest underline decoration-2 underline-offset-4">Advanced</button>
                        </div>
                        <SecuritySettings />
                    </motion.div>

                    {/* Featured: Hardware Bridge Status */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <Card className="p-5 border-[var(--card-border)] bg-[var(--card-bg)] cursor-pointer group hover:border-primary/20 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-xl bg-[var(--icon-bg)] flex items-center justify-center border border-[var(--card-border)] group-hover:bg-primary/5 transition-all">
                                        <CreditCard size={18} className="text-[var(--text-secondary)] group-hover:text-primary" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)]">Hardware Sync</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Connected via Bridge</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                            </div>
                        </Card>

                        <button
                            onClick={() => setShowEmergencyFreeze(true)}
                            className={cn(
                                "w-full py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2",
                                settings.emergencyFreezeActive
                                    ? "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)] animate-pulse"
                                    : "border-[var(--warning)]/20 hover:border-[var(--warning)]/40 text-[var(--warning)]/70 hover:text-[var(--warning)]"
                            )}
                        >
                            <Snowflake size={14} />
                            <span>{settings.emergencyFreezeActive ? "Vault Frozen" : "Emergency Freeze"}</span>
                        </button>

                        <button
                            onClick={() => setShowRecovery(true)}
                            className="w-full py-4 rounded-2xl border border-dashed border-[var(--card-border)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
                        >
                            Simulate Lost Access
                        </button>

                        <button
                            onClick={logout}
                            className="w-full py-4 rounded-2xl border border-[var(--card-border)] hover:border-danger/20 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-danger transition-all flex items-center justify-center space-x-2"
                        >
                            <LogOut size={14} />
                            <span>Secure Sign Out</span>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.99, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.99, y: 5 }}
                            className="w-full max-w-xl"
                        >
                            <Card className="relative p-10 border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl">
                                <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                    <X size={20} strokeWidth={1.5} />
                                </button>
                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">System Preferences</h2>
                                        <p className="text-xs text-[var(--text-secondary)] font-medium">Configure thresholds, timelocks, and recovery protocols.</p>
                                    </div>
                                    <SecuritySettings />
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSend && <TransactionGuard onClose={() => setShowSend(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showSendFlow && <SendFlow onClose={() => setShowSendFlow(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showConventional && <ConventionalModal onClose={() => setShowConventional(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showRecovery && <RecoveryModal onClose={() => setShowRecovery(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showComparison && <ComparisonMode onClose={() => setShowComparison(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showEmergencyFreeze && <EmergencyFreeze onClose={() => setShowEmergencyFreeze(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showTimelockQueue && <TimelockQueue onClose={() => setShowTimelockQueue(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showRealTimeDemo && <RealTimeDemo onClose={() => setShowRealTimeDemo(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showSwap && <SwapModal onClose={() => setShowSwap(false)} />}
            </AnimatePresence>
        </motion.div>
    );
}
