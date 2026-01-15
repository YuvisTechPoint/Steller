"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    ShieldOff,
    AlertTriangle,
    Clock,
    X,
    Snowflake,
    Lock,
    Unlock,
    Timer,
    CheckCircle2,
    AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/lib/store/wallet-store";
import { cn } from "@/lib/utils";

interface EmergencyFreezeProps {
    onClose: () => void;
}

export function EmergencyFreeze({ onClose }: EmergencyFreezeProps) {
    const { settings, activateEmergencyFreeze, deactivateEmergencyFreeze } = useWalletStore();
    const [selectedDuration, setSelectedDuration] = useState(24);
    const [confirmStep, setConfirmStep] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    // Calculate remaining time if freeze is active
    useEffect(() => {
        if (settings.emergencyFreezeActive && settings.freezeUntil) {
            const interval = setInterval(() => {
                const remaining = Math.max(0, settings.freezeUntil! - Date.now());
                setCountdown(remaining);
                
                if (remaining === 0) {
                    deactivateEmergencyFreeze();
                }
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [settings.emergencyFreezeActive, settings.freezeUntil, deactivateEmergencyFreeze]);

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleActivateFreeze = () => {
        activateEmergencyFreeze(selectedDuration);
        onClose();
    };

    const handleDeactivate = () => {
        deactivateEmergencyFreeze();
    };

    const durations = [
        { hours: 6, label: "6 Hours", description: "Short cooldown" },
        { hours: 24, label: "24 Hours", description: "Standard protection" },
        { hours: 72, label: "3 Days", description: "Extended security" },
        { hours: 168, label: "7 Days", description: "Maximum protection" },
    ];

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
                <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between sticky top-0 bg-[var(--background)] z-10 -m-1 p-1">
                        <Badge variant={settings.emergencyFreezeActive ? "danger" : "caution"}>
                            {settings.emergencyFreezeActive ? "Vault Frozen" : "Emergency Protocol"}
                        </Badge>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]">
                            <X size={20} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {settings.emergencyFreezeActive ? (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                {/* Frozen State Display */}
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <motion.div
                                        animate={{ 
                                            boxShadow: ["0 0 0 0 rgba(var(--danger-rgb), 0)", "0 0 0 20px rgba(var(--danger-rgb), 0.1)", "0 0 0 0 rgba(var(--danger-rgb), 0)"]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="h-24 w-24 rounded-full bg-[var(--danger)]/10 border border-[var(--danger)]/20 flex items-center justify-center"
                                    >
                                        <Snowflake size={40} className="text-[var(--danger)]" />
                                    </motion.div>
                                    
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Vault is Frozen</h2>
                                        <p className="text-sm text-[var(--text-secondary)] max-w-[300px]">
                                            All outbound transactions are blocked. Your assets are protected.
                                        </p>
                                    </div>

                                    {countdown !== null && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">
                                                Auto-unlock in
                                            </p>
                                            <p className="text-4xl font-mono font-bold text-[var(--danger)] tracking-wider">
                                                {formatTime(countdown)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Current Protection Status */}
                                <Card className="p-5 border-[var(--danger)]/20 bg-[var(--danger)]/5 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Lock size={18} className="text-[var(--danger)]" />
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">Active Protections</span>
                                    </div>
                                    <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                                        <p className="flex items-center space-x-2">
                                            <CheckCircle2 size={12} className="text-[var(--danger)]" />
                                            <span>All ETH transfers blocked</span>
                                        </p>
                                        <p className="flex items-center space-x-2">
                                            <CheckCircle2 size={12} className="text-[var(--danger)]" />
                                            <span>Token approvals disabled</span>
                                        </p>
                                        <p className="flex items-center space-x-2">
                                            <CheckCircle2 size={12} className="text-[var(--danger)]" />
                                            <span>Contract interactions paused</span>
                                        </p>
                                        <p className="flex items-center space-x-2">
                                            <CheckCircle2 size={12} className="text-[var(--success)]" />
                                            <span>Receiving funds still enabled</span>
                                        </p>
                                    </div>
                                </Card>

                                <div className="space-y-3">
                                    <Button 
                                        variant="danger" 
                                        onClick={handleDeactivate}
                                        className="w-full h-14"
                                        leftIcon={<Unlock size={18} />}
                                    >
                                        Emergency Unfreeze
                                    </Button>
                                    <p className="text-[10px] text-center text-[var(--text-secondary)]/50">
                                        Unfreezing early requires guardian confirmation if enabled
                                    </p>
                                </div>
                            </motion.div>
                        ) : confirmStep ? (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-[var(--warning)]/10 flex items-center justify-center">
                                        <AlertTriangle size={32} className="text-[var(--warning)]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)]">Confirm Freeze</h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Are you sure you want to freeze your vault for{" "}
                                            <span className="text-[var(--text-primary)] font-semibold">{selectedDuration} hours</span>?
                                        </p>
                                    </div>
                                </div>

                                <Card className="p-5 border-[var(--warning)]/20 bg-[var(--warning)]/5">
                                    <div className="flex items-start space-x-3">
                                        <AlertOctagon size={18} className="text-[var(--warning)] mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">What happens when frozen:</p>
                                            <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                                                <li>• All outbound transactions will be blocked</li>
                                                <li>• Pending timelocked transactions will pause</li>
                                                <li>• You can still receive funds</li>
                                                <li>• Early unfreeze requires additional verification</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Card>

                                <div className="flex space-x-3">
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setConfirmStep(false)}
                                        className="flex-1 h-14"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={handleActivateFreeze}
                                        className="flex-1 h-14"
                                        leftIcon={<Snowflake size={18} />}
                                    >
                                        Freeze Vault
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Emergency Freeze</h2>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Temporarily lock all outbound transactions if you suspect your wallet is compromised.
                                    </p>
                                </div>

                                {/* Duration Selection */}
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                        Freeze Duration
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {durations.map((d) => (
                                            <button
                                                key={d.hours}
                                                onClick={() => setSelectedDuration(d.hours)}
                                                className={cn(
                                                    "p-4 rounded-xl border text-left transition-all",
                                                    selectedDuration === d.hours 
                                                        ? "border-[var(--primary)] bg-[var(--primary)]/10" 
                                                        : "border-[var(--card-border)] bg-[var(--icon-bg)] hover:border-[var(--card-border)]/50"
                                                )}
                                            >
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">{d.label}</p>
                                                <p className="text-[10px] text-[var(--text-secondary)]">{d.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Card */}
                                <Card className="p-5 border-[var(--card-border)] bg-[var(--icon-bg)]">
                                    <div className="flex items-start space-x-3">
                                        <Shield size={18} className="text-[var(--primary)] mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">When to use Emergency Freeze</p>
                                            <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                                                <li>• You suspect your keys may be compromised</li>
                                                <li>• You've interacted with a suspicious contract</li>
                                                <li>• You need time to assess a security incident</li>
                                                <li>• You want to prevent panic-driven transactions</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Card>

                                <Button 
                                    onClick={() => setConfirmStep(true)}
                                    className="w-full h-14 bg-[var(--warning)] hover:bg-[var(--warning)]/90 text-black"
                                    leftIcon={<Snowflake size={18} />}
                                >
                                    Initiate Freeze Protocol
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
