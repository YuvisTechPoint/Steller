"use client";

import { motion } from "framer-motion";
import { Activity, Shield, Zap, Lock, Scan, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RealTimeDemoProps {
    onClose: () => void;
}

export function RealTimeDemo({ onClose }: RealTimeDemoProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--background)]/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[32px] overflow-hidden shadow-2xl relative"
            >
                {/* Exotic Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--success)]/10 blur-[100px] -z-10" />

                <div className="p-8 md:p-12 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Badge variant="primary" className="mb-2">System Live</Badge>
                            <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">REAL-TIME AUTH PULSE</h2>
                        </div>
                        <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--icon-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Simulation Stream */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-[var(--icon-bg)] border border-[var(--card-border)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-scan" style={{ top: 'unset', bottom: 0 }} />
                                <div className="flex items-center space-x-3 mb-4">
                                    <Activity size={16} className="text-[var(--primary)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Verification Stream</span>
                                </div>
                                <div className="space-y-3">
                                    <StreamItem status="Verified" label="Github OAuth Handshake" time="Just now" color="var(--primary)" />
                                    <StreamItem status="Active" label="Magic Link Sent (Firebase)" time="2s ago" color="var(--success)" />
                                    <StreamItem status="Secure" label="MetaMask Signature Verified" time="15s ago" color="var(--primary)" />
                                    <StreamItem status="Blocked" label="Unknown Entry Attempt" time="1m ago" color="var(--danger)" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-lg bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
                                        <Zap size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-[var(--text-secondary)]">Protocol Latency</span>
                                </div>
                                <span className="text-xs font-black text-[var(--text-primary)]">12ms</span>
                            </div>
                        </div>

                        {/* Security Visualization */}
                        <div className="space-y-6 flex flex-col justify-center">
                            <div className="relative flex items-center justify-center aspect-square">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-[var(--primary)]/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-8 border border-[var(--primary)]/10 rounded-full"
                                />
                                <div className="relative h-24 w-24 rounded-3xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                                    <Shield size={32} className="text-[var(--primary)]" strokeWidth={1.5} />
                                </div>

                                {/* Orbiting Nodes */}
                                <OrbitingNode delay={0} icon={<Lock size={10} />} />
                                <OrbitingNode delay={1.5} icon={<Scan size={10} />} />
                                <OrbitingNode delay={3} icon={<CheckCircle2 size={10} />} />
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-sm font-black text-[var(--text-primary)] tracking-tight">ENCRYPTED REAL-TIME SYNC</p>
                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-relaxed">
                                    Your biometrics and keys are synced <br /> across the Steller Infinity cluster.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-center">
                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Hardware Verification Status: <span className="text-[var(--success)]">Nominal</span></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function StreamItem({ status, label, time, color }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[11px] font-bold text-[var(--text-primary)]">{label}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity" style={{ color }}>{status}</span>
                <span className="text-[9px] text-[var(--text-muted)] font-medium italic">{time}</span>
            </div>
        </div>
    );
}

function OrbitingNode({ delay, icon }: any) {
    return (
        <motion.div
            animate={{
                rotate: 360,
                x: [100, 0, -100, 0, 100],
                y: [0, 100, 0, -100, 0]
            }}
            transition={{
                rotate: { duration: 0 },
                x: { duration: 8, repeat: Infinity, ease: "linear", delay },
                y: { duration: 8, repeat: Infinity, ease: "linear", delay }
            }}
            className="absolute h-6 w-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] shadow-sm"
        >
            {icon}
        </motion.div>
    );
}
