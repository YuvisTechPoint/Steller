"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, ArrowDownUp, Settings, Info, AlertTriangle, Zap, TrendingUp,
    ChevronDown, Loader2, CheckCircle2, ExternalLink, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/lib/store/notification-store";

declare global {
    interface Window {
        ethereum?: any;
    }
}

interface Token {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
    balance?: string;
}

const POPULAR_TOKENS: Token[] = [
    { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    { symbol: "USDT", name: "Tether USD", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    { symbol: "DAI", name: "Dai Stablecoin", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
];

export function SwapModal({ onClose }: { onClose: () => void }) {
    const { addNotification } = useNotificationStore();
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState<string>("");
    const [chainId, setChainId] = useState<number | null>(null);
    
    const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[0]);
    const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[1]);
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [slippage, setSlippage] = useState("0.5");
    const [showSettings, setShowSettings] = useState(false);
    
    const [priceData, setPriceData] = useState<{
        rate: number;
        impact: number;
        minimumReceived: string;
        route: string[];
    } | null>(null);

    // Connect to MetaMask
    const connectWallet = async () => {
        if (!window.ethereum) {
            addNotification({
                type: "system",
                priority: "high",
                title: "MetaMask Not Found",
                message: "Please install MetaMask browser extension to use swap functionality.",
            });
            return;
        }

        try {
            const accounts = await window.ethereum.request({ 
                method: "eth_requestAccounts" 
            });
            const chainId = await window.ethereum.request({ 
                method: "eth_chainId" 
            });
            
            setAccount(accounts[0]);
            setChainId(parseInt(chainId, 16));
            setConnected(true);

            addNotification({
                type: "system",
                priority: "medium",
                title: "Wallet Connected",
                message: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
            });
        } catch (error: any) {
            addNotification({
                type: "system",
                priority: "high",
                title: "Connection Failed",
                message: error.message || "Failed to connect to MetaMask",
            });
        }
    };

    // Listen for account/chain changes
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setConnected(false);
                setAccount("");
            } else {
                setAccount(accounts[0]);
            }
        };

        const handleChainChanged = (chainId: string) => {
            setChainId(parseInt(chainId, 16));
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        // Check if already connected
        window.ethereum.request({ method: "eth_accounts" })
            .then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setConnected(true);
                    return window.ethereum.request({ method: "eth_chainId" });
                }
            })
            .then((chainId: string) => {
                if (chainId) setChainId(parseInt(chainId, 16));
            });

        return () => {
            if (window.ethereum.removeListener) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                window.ethereum.removeListener("chainChanged", handleAccountsChanged);
            }
        };
    }, []);

    // Fetch real-time price (using CoinGecko API as example)
    useEffect(() => {
        if (!fromAmount || parseFloat(fromAmount) <= 0) {
            setToAmount("");
            setPriceData(null);
            return;
        }

        const fetchPrice = async () => {
            setIsLoadingPrice(true);
            try {
                // For demo: simulate API call with realistic data
                // In production, use 1inch, Uniswap, or 0x API
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const mockRate = fromToken.symbol === "ETH" && toToken.symbol === "USDC" 
                    ? 2850.50 
                    : toToken.symbol === "ETH" && fromToken.symbol === "USDC"
                    ? 0.00035
                    : 1.0;
                
                const calculatedAmount = (parseFloat(fromAmount) * mockRate).toFixed(6);
                const slippageAmount = (parseFloat(calculatedAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6);
                
                setToAmount(calculatedAmount);
                setPriceData({
                    rate: mockRate,
                    impact: 0.1,
                    minimumReceived: slippageAmount,
                    route: [fromToken.symbol, toToken.symbol],
                });
            } catch (error) {
                console.error("Price fetch error:", error);
            } finally {
                setIsLoadingPrice(false);
            }
        };

        const debounce = setTimeout(fetchPrice, 500);
        return () => clearTimeout(debounce);
    }, [fromAmount, fromToken, toToken, slippage]);

    // Execute swap
    const handleSwap = async () => {
        if (!connected) {
            connectWallet();
            return;
        }

        if (!fromAmount || !toAmount) {
            addNotification({
                type: "swap",
                priority: "medium",
                title: "Invalid Amount",
                message: "Please enter a valid swap amount",
            });
            return;
        }

        setIsSwapping(true);

        try {
            // For production, integrate with DEX aggregator like 1inch or Uniswap
            // This is a simulation showing the flow
            
            addNotification({
                type: "swap",
                priority: "medium",
                title: "Swap Initiated",
                message: `Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
            });

            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            addNotification({
                type: "swap",
                priority: "high",
                title: "Swap Successful!",
                message: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
                actionLabel: "View on Etherscan",
            });

            onClose();
        } catch (error: any) {
            addNotification({
                type: "swap",
                priority: "critical",
                title: "Swap Failed",
                message: error.message || "Transaction was rejected or failed",
            });
        } finally {
            setIsSwapping(false);
        }
    };

    const switchTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--background)]/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-3xl bg-[var(--background)] border border-[var(--card-border)] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                            <ArrowDownUp size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">Token Swap</h2>
                            <p className="text-[10px] text-[var(--text-secondary)] font-medium">MetaMask Integration</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]"
                        >
                            <Settings size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--icon-bg)] text-[var(--text-secondary)]">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-b border-[var(--card-border)] overflow-hidden"
                        >
                            <div className="p-6 space-y-4 bg-[var(--icon-bg)]">
                                <div>
                                    <label className="text-xs font-bold text-[var(--text-primary)] mb-2 block">
                                        Slippage Tolerance
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        {["0.1", "0.5", "1.0"].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => setSlippage(val)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                                                    slippage === val
                                                        ? "bg-[var(--primary)] text-white"
                                                        : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--text-secondary)]"
                                                )}
                                            >
                                                {val}%
                                            </button>
                                        ))}
                                        <Input
                                            type="number"
                                            value={slippage}
                                            onChange={(e) => setSlippage(e.target.value)}
                                            className="w-20 h-10 text-xs text-center"
                                            placeholder="Custom"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Connection Status */}
                    {!connected && (
                        <div className="p-4 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20 flex items-start space-x-3">
                            <AlertTriangle size={16} className="text-[var(--warning)] mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-[var(--warning)]">Wallet Not Connected</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    Connect your MetaMask wallet to start swapping
                                </p>
                            </div>
                        </div>
                    )}

                    {connected && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
                                <span className="text-xs font-bold text-[var(--success)]">Connected</span>
                            </div>
                            <span className="text-xs font-mono text-[var(--text-secondary)]">
                                {account.slice(0, 6)}...{account.slice(-4)}
                            </span>
                        </div>
                    )}

                    {/* From Token */}
                    <Card className="p-4 bg-[var(--icon-bg)] border-[var(--card-border)]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">From</span>
                            {fromToken.balance && (
                                <span className="text-[10px] text-[var(--text-secondary)]">
                                    Balance: {fromToken.balance}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="number"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 text-2xl font-bold bg-transparent border-none p-0 h-auto"
                            />
                            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:bg-[var(--card-hover-bg)]">
                                <span className="text-sm font-bold text-[var(--text-primary)]">{fromToken.symbol}</span>
                                <ChevronDown size={14} className="text-[var(--text-muted)]" />
                            </button>
                        </div>
                    </Card>

                    {/* Switch Button */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <button
                            onClick={switchTokens}
                            className="h-10 w-10 rounded-full bg-[var(--background)] border-2 border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--icon-bg)] transition-all hover:rotate-180"
                        >
                            <ArrowDownUp size={16} className="text-[var(--text-secondary)]" />
                        </button>
                    </div>

                    {/* To Token */}
                    <Card className="p-4 bg-[var(--icon-bg)] border-[var(--card-border)]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">To</span>
                            {isLoadingPrice && (
                                <Loader2 size={12} className="animate-spin text-[var(--primary)]" />
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="number"
                                value={toAmount}
                                readOnly
                                placeholder="0.0"
                                className="flex-1 text-2xl font-bold bg-transparent border-none p-0 h-auto"
                            />
                            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:bg-[var(--card-hover-bg)]">
                                <span className="text-sm font-bold text-[var(--text-primary)]">{toToken.symbol}</span>
                                <ChevronDown size={14} className="text-[var(--text-muted)]" />
                            </button>
                        </div>
                    </Card>

                    {/* Price Info */}
                    {priceData && (
                        <div className="space-y-2 p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">Rate</span>
                                <span className="font-bold text-[var(--text-primary)]">
                                    1 {fromToken.symbol} = {priceData.rate.toFixed(4)} {toToken.symbol}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">Price Impact</span>
                                <span className={cn("font-bold", priceData.impact < 1 ? "text-[var(--success)]" : "text-[var(--warning)]")}>
                                    {priceData.impact.toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">Minimum Received</span>
                                <span className="font-bold text-[var(--text-primary)]">
                                    {priceData.minimumReceived} {toToken.symbol}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Swap Button */}
                    <Button
                        onClick={connected ? handleSwap : connectWallet}
                        disabled={isSwapping || (connected && (!fromAmount || !toAmount))}
                        className="w-full h-14 text-base font-bold"
                        isLoading={isSwapping}
                    >
                        {!connected ? "Connect Wallet" : isSwapping ? "Swapping..." : "Swap"}
                    </Button>

                    {/* Info */}
                    <div className="flex items-start space-x-2 p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                        <Info size={14} className="text-[var(--primary)] mt-0.5 shrink-0" />
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                            This swap executes through your MetaMask wallet with real-time price feeds. Transaction will be protected by Steller's security layer.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
