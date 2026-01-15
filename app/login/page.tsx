"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Github, Mail, Fingerprint, Lock, ArrowRight, Loader2, Wallet, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const { login, sendEmailLink } = useAuth();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [linkSent, setLinkSent] = useState(false);

    const handleAuth = async (method: "firebase" | "github" | "metamask") => {
        setIsLoading(method);
        try {
            if (method === "firebase" && !showEmailLogin) {
                setShowEmailLogin(true);
                setIsLoading(null);
                return;
            }

            if (method === "firebase" && showEmailLogin) {
                await sendEmailLink(email);
                setLinkSent(true);
            } else {
                await login(method);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--success)]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md px-6 z-10"
            >
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 mb-6"
                    >
                        <Shield className="h-8 w-8 text-[var(--primary)]" strokeWidth={1.5} />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2 font-pace">Steller</h1>
                    <p className="text-[var(--text-secondary)] text-center text-sm font-medium">Hardware-level security for your digital assets.</p>
                </div>

                <Card className="p-8 border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <AnimatePresence mode="wait">
                        {!showEmailLogin ? (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <p className="label-caps mb-6 opacity-50 text-[10px]">Auth Sequence</p>

                                <AuthButton
                                    icon={<Wallet className="h-5 w-5" />}
                                    label="Connect Wallet"
                                    sublabel="MetaMask / Browser Extension"
                                    onClick={() => handleAuth("metamask")}
                                    loading={isLoading === "metamask"}
                                    variant="primary"
                                />

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--card-border)]" /></div>
                                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-[var(--background)] px-4 text-[var(--text-muted)]/50">Hybrid Social</span></div>
                                </div>

                                <AuthButton
                                    icon={<Github className="h-5 w-5 text-[var(--text-secondary)]" />}
                                    label="GitHub"
                                    sublabel="OAuth Authentication"
                                    onClick={() => handleAuth("github")}
                                    loading={isLoading === "github"}
                                />

                                <AuthButton
                                    icon={<Mail className="h-5 w-5 text-[var(--text-secondary)]" />}
                                    label="Email Link"
                                    sublabel="Secure Firebase Entry"
                                    onClick={() => handleAuth("firebase")}
                                    loading={isLoading === "firebase"}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="email-login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="label-caps opacity-50 text-[10px]">Email Authentication</p>
                                    <button
                                        onClick={() => setShowEmailLogin(false)}
                                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[var(--icon-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]/40 transition-colors"
                                            placeholder="name@stellar.io"
                                            disabled={linkSent}
                                        />
                                    </div>
                                    {linkSent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 flex items-center space-x-3"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
                                            <p className="text-[10px] font-bold text-[var(--success)] uppercase tracking-widest">Security Link Sent to Inbox</p>
                                        </motion.div>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-[var(--primary)]/10"
                                    onClick={() => handleAuth("firebase")}
                                    disabled={isLoading === "firebase" || linkSent}
                                >
                                    {isLoading === "firebase" ? <Loader2 className="animate-spin h-4 w-4" /> : linkSent ? "Check Your Inbox" : "Authorize Access"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                <p className="mt-8 text-center text-[11px] text-[#9AA3B2]/50 leading-relaxed max-w-[280px] mx-auto">
                    By accessing the vault, you acknowledge the <span className="text-[#5B6CFF]/60 cursor-pointer hover:underline">Self-Custody Terms</span>.
                </p>
            </motion.div>
        </div>
    );
}

function AuthButton({ icon, label, sublabel, onClick, loading, variant = "secondary" }: any) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={cn(
                "w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all duration-200 group relative",
                variant === "primary" ? "bg-[var(--primary)] text-white hover:opacity-90 shadow-[0_0_20px_var(--primary-glow)]" : "bg-[var(--icon-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover-bg)]"
            )}
        >
            <div className="flex items-center space-x-4">
                <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                    variant === "primary" ? "bg-white/20" : "bg-[var(--background)] group-hover:bg-[var(--primary)]/5"
                )}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
                </div>
                <div>
                    <p className="text-sm font-bold">{label}</p>
                    <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        variant === "primary" ? "text-white/60" : "text-[var(--text-muted)]"
                    )}>{sublabel}</p>
                </div>
            </div>
            <ArrowRight size={14} className={cn(
                "transition-transform group-hover:translate-x-1",
                variant === "primary" ? "text-white/40" : "text-[var(--text-muted)]/20"
            )} />
        </button>
    );
}
