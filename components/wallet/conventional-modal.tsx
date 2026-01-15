"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// A "Blind Signing" Interface simulation
export function ConventionalModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<"review" | "failed">("review");

    const handleConfirm = () => {
        // Simulate immediate failure/drain
        setStep("failed");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl font-sans text-left"
            >
                {step === "review" ? (
                    <>
                        {/* Metamask-ish Header */}
                        <div className="bg-zinc-800 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-blue-500" />
                                <span className="text-sm font-medium text-white">Main Account</span>
                            </div>
                            <div className="text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded">Ethereum Mainnet</div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 rounded-full border border-blue-500 mx-auto flex items-center justify-center text-xl">🦄</div>
                                <h3 className="text-lg text-white font-medium">Uniswap V3?</h3>
                                <p className="text-xs text-zinc-400">0xbad72...1234</p>
                            </div>

                            <div className="border border-zinc-700 rounded-lg p-3">
                                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                    <span>Balance</span>
                                    <span>14.52 ETH</span>
                                </div>
                                <div className="text-lg font-bold text-white text-center py-2">
                                    Set Approval For All
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Gas (estimated)</span>
                                    <span className="text-white font-mono">0.0043 ETH</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-white font-mono">0.0043 ETH</span>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button onClick={onClose} className="flex-1 py-3 rounded-full border border-blue-500 text-blue-500 font-medium hover:bg-blue-500/10 text-sm">Reject</button>
                                <button onClick={handleConfirm} className="flex-1 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm">Confirm</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center space-y-4">
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-red-500 mx-auto flex justify-center">
                            <AlertCircle size={64} />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white">Wallet Drained</h3>
                        <p className="text-zinc-400 text-sm">
                            You just approved a malicious contract. In a conventional wallet, your assets would be gone.
                        </p>
                        <Button variant="secondary" onClick={onClose}>Close Simulation</Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
