"use client";

import { useWalletStore, Guardian } from "@/lib/store/wallet-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Clock,
    Shield,
    ArrowRight,
    Lock,
    User,
    Minus,
    Plus,
    Infinity,
    Snowflake,
    Bell,
    Fingerprint,
    Users,
    ChevronRight,
    Trash2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Local OS Icon for subtle settings
const SettingIcon = ({ icon: IconComponent, className = "", active = false }: { icon: any, className?: string, active?: boolean }) => (
    <div className={cn(
        "h-9 w-9 rounded-lg flex items-center justify-center border transition-all",
        active ? "bg-[var(--primary)]/10 border-[var(--primary)]/20" : "bg-[var(--icon-bg)] border-[var(--card-border)]"
    )}>
        <IconComponent size={16} strokeWidth={1.5} className={cn(
            active ? "text-[var(--primary)]" : "text-[var(--text-secondary)] opacity-50",
            className
        )} />
    </div>
);

export function SecuritySettings() {
    const { settings, updateSettings, removeGuardian } = useWalletStore();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleUpdateLimit = (change: number) => {
        const current = parseFloat(settings.dailyLimit);
        const next = Math.max(0.5, Math.min(50, current + change)).toFixed(1);
        updateSettings({ dailyLimit: next });
    };

    const timelockOptions = [6, 12, 24, 48, 72];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
                {/* Timelock Control - Expandable */}
                <Card
                    className={cn(
                        "p-3.5 border-[var(--card-border)] bg-[var(--card-bg)] transition-all cursor-pointer",
                        expandedSection === "timelock" && "border-[var(--primary)]/20 bg-[var(--primary)]/5"
                    )}
                    onClick={() => setExpandedSection(expandedSection === "timelock" ? null : "timelock")}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SettingIcon icon={Clock} active={expandedSection === "timelock"} />
                            <div>
                                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Timelock</h4>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest leading-none mt-1">High-Risk Delay</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="neutral" className="bg-[var(--icon-bg)] border-[var(--card-border)] text-[var(--text-secondary)]">{settings.timelock}h</Badge>
                            <ChevronRight size={14} className={cn(
                                "text-[var(--text-muted)] transition-transform",
                                expandedSection === "timelock" && "rotate-90"
                            )} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {expandedSection === "timelock" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 mt-4 border-t border-[var(--card-border)] space-y-3">
                                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                                        Set how long high-risk transactions are delayed before execution
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {timelockOptions.map((hours) => (
                                            <button
                                                key={hours}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateSettings({ timelock: hours });
                                                }}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                                    settings.timelock === hours
                                                        ? "bg-[var(--primary)] text-white"
                                                        : "bg-[var(--icon-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:bg-[var(--card-hover-bg)]"
                                                )}
                                            >
                                                {hours}h
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Interactive Spending Limit Slider Control */}
                <Card className="p-3.5 border-[var(--card-border)] bg-[var(--card-bg)] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SettingIcon icon={Minus} />
                            <div>
                                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Vault Threshold</h4>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest leading-none mt-1">Daily Limit</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-[var(--text-primary)] tracking-tight">{settings.dailyLimit} Ξ</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <button
                            onClick={() => handleUpdateLimit(-0.5)}
                            className="flex-1 h-9 rounded-lg bg-[var(--icon-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover-bg)] flex items-center justify-center transition-colors"
                        >
                            <Minus size={12} className="text-[var(--text-secondary)]" />
                        </button>
                        <div className="flex-[3] h-2 bg-[var(--icon-bg)] rounded-full overflow-hidden relative border border-[var(--card-border)]">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-[var(--primary)]"
                                animate={{ width: `${Math.min((parseFloat(settings.dailyLimit) / 10) * 100, 100)}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <button
                            onClick={() => handleUpdateLimit(0.5)}
                            className="flex-1 h-9 rounded-lg bg-[var(--icon-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover-bg)] flex items-center justify-center transition-colors"
                        >
                            <Plus size={12} className="text-[var(--text-secondary)]" />
                        </button>
                    </div>
                    <p className="text-[9px] text-[var(--text-muted)] text-center font-bold uppercase tracking-wider">
                        Transfers above this amount require timelock
                    </p>
                </Card>

                {/* Guardians - Expandable */}
                <Card
                    className={cn(
                        "p-3.5 border-[var(--card-border)] bg-[var(--card-bg)] transition-all cursor-pointer",
                        expandedSection === "guardians" && "border-[var(--primary)]/20 bg-[var(--primary)]/5"
                    )}
                    onClick={() => setExpandedSection(expandedSection === "guardians" ? null : "guardians")}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SettingIcon icon={Users} active={expandedSection === "guardians"} />
                            <div>
                                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Guardians</h4>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest leading-none mt-1">Recovery Network</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center -space-x-1.5 mr-2">
                                {settings.guardians.slice(0, 3).map((g, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-6 w-6 rounded-full border-2 border-[var(--card-bg)] flex items-center justify-center",
                                            g.status === "active" ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-[var(--text-muted)]/20 text-[var(--text-muted)]"
                                        )}
                                    >
                                        <User size={10} strokeWidth={2.5} />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-60">
                                {settings.guardians.filter(g => g.status === "active").length}/{settings.guardians.length}
                            </span>
                            <ChevronRight size={14} className={cn(
                                "text-[var(--text-muted)] transition-transform",
                                expandedSection === "guardians" && "rotate-90"
                            )} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {expandedSection === "guardians" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 mt-4 border-t border-[var(--card-border)] space-y-3">
                                    {settings.guardians.map((guardian) => (
                                        <div
                                            key={guardian.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-[var(--icon-bg)] border border-[var(--card-border)]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-lg flex items-center justify-center",
                                                    guardian.type === "hardware" ? "bg-[var(--primary)]/10 text-[var(--primary)]" :
                                                        guardian.type === "social" ? "bg-[var(--success)]/10 text-[var(--success)]" :
                                                            "bg-[var(--warning)]/10 text-[var(--warning)]"
                                                )}>
                                                    {guardian.type === "hardware" ? <Fingerprint size={14} /> :
                                                        guardian.type === "social" ? <User size={14} /> :
                                                            <Lock size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[var(--text-primary)]">{guardian.name}</p>
                                                    <p className="text-[9px] text-[var(--text-muted)] font-mono">{guardian.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {guardian.status === "active" ? (
                                                    <CheckCircle2 size={12} className="text-[var(--success)]" />
                                                ) : (
                                                    <AlertCircle size={12} className="text-[var(--warning)]" />
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeGuardian(guardian.id);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--text-muted)] hover:text-[var(--danger)] transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-3 rounded-xl border border-dashed border-[var(--card-border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all">
                                        + Add Guardian
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Emergency Freeze Toggle */}
                <Card
                    className={cn(
                        "hover:border-[var(--danger)]/10 group cursor-pointer p-3.5 border-[var(--card-border)] transition-all",
                        settings.emergencyFreezeActive ? "bg-[var(--danger)]/5 border-[var(--danger)]/40" : "bg-[var(--card-bg)]"
                    )}
                    onClick={() => {
                        if (settings.emergencyFreezeActive) {
                            updateSettings({ emergencyFreezeActive: false, freezeUntil: undefined });
                        }
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={cn(
                                "h-9 w-9 rounded-lg flex items-center justify-center border transition-all",
                                settings.emergencyFreezeActive
                                    ? "bg-[var(--danger)]/10 border-[var(--danger)]/20"
                                    : "bg-[var(--icon-bg)] border-[var(--card-border)]"
                            )}>
                                <Snowflake size={16} strokeWidth={1.5} className={cn(
                                    settings.emergencyFreezeActive ? "text-[var(--danger)]" : "text-[var(--text-secondary)] opacity-50"
                                )} />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Emergency Freeze</h4>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest mt-1">
                                    {settings.emergencyFreezeActive ? "Vault Locked" : "Quick Lockdown"}
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border transition-all",
                            settings.emergencyFreezeActive
                                ? "border-[var(--danger)]/20 text-[var(--danger)] bg-[var(--danger)]/5 animate-pulse"
                                : "border-[var(--card-border)] text-[var(--text-muted)]"
                        )}>
                            {settings.emergencyFreezeActive ? "Active" : "Ready"}
                        </div>
                    </div>
                </Card>

                {/* Biometric Toggle */}
                <Card
                    className="hover:border-[var(--primary)]/10 group cursor-pointer p-3.5 border-[var(--card-border)] bg-[var(--card-bg)]"
                    onClick={() => updateSettings({ biometricEnabled: !settings.biometricEnabled })}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={cn(
                                "h-9 w-9 rounded-lg flex items-center justify-center border transition-all duration-300",
                                settings.biometricEnabled ? "bg-[var(--success)]/5 border-[var(--success)]/10" : "bg-[var(--icon-bg)] border-[var(--card-border)]"
                            )}>
                                <Fingerprint size={16} strokeWidth={1.5} className={cn(
                                    settings.biometricEnabled ? "text-[var(--success)] opacity-80" : "text-[var(--text-secondary)] opacity-50"
                                )} />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Biometric Auth</h4>
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest mt-1">Face ID / Touch</p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border transition-all",
                            settings.biometricEnabled
                                ? "border-[var(--success)]/20 text-[var(--success)] bg-[var(--success)]/5"
                                : "border-[var(--card-border)] text-[var(--text-muted)]"
                        )}>
                            {settings.biometricEnabled ? "On" : "Off"}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
