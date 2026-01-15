import { create } from "zustand";
import { RiskAnalysis, TransactionIntent, analyzeTransaction } from "@/lib/risk-engine";
import { useNotificationStore } from "./notification-store";

export interface Asset {
    symbol: string;
    name: string;
    balance: string;
    valueInUsd: string;
    change24h: string;
    icon?: string;
}

export interface TransactionRecord {
    id: string;
    type: "Sent" | "Received" | "Approval" | "Contract Call" | "Recovery" | "Blocked";
    asset: string;
    amount: string;
    status: "Secure" | "Verified" | "Timelocked" | "Blocked" | "Recovered" | "Pending" | "Guardian Required";
    date: string;
    to?: string;
    from?: string;
    hash?: string;
    findings?: string[];
    timelockEnd?: number; // timestamp when timelock ends
}

export interface Guardian {
    id: string;
    name: string;
    address: string;
    type: "hardware" | "social" | "backup";
    lastActive: string;
    status: "active" | "pending" | "inactive";
}

interface WalletState {
    address: string;
    balance: string;
    assets: Asset[];
    history: TransactionRecord[];
    isAnalyzing: boolean;
    currentIntent: TransactionIntent | null;
    riskAnalysis: RiskAnalysis | null;
    analysisStage: "idle" | "intent" | "analyzing" | "decision";

    // Settings
    settings: {
        timelock: number; // hours
        dailyLimit: string; // ETH
        guardianCount: number;
        socialRecoveryActive: boolean;
        guardians: Guardian[];
        emergencyFreezeActive: boolean;
        freezeUntil?: number; // timestamp
        notificationsEnabled: boolean;
        biometricEnabled: boolean;
    };

    // Pending Timelocked Transactions
    pendingTransactions: {
        intent: TransactionIntent;
        analysis: RiskAnalysis;
        createdAt: number;
        executeAt: number;
        status: "pending" | "executed" | "cancelled";
    }[];

    // Actions
    setIntent: (intent: TransactionIntent) => void;
    runAnalysis: () => Promise<void>;
    clearTransaction: () => void;
    updateSettings: (settings: Partial<WalletState["settings"]>) => void;
    addTransaction: (tx: TransactionRecord) => void;
    setAnalysisStage: (stage: WalletState["analysisStage"]) => void;

    // Emergency Actions
    activateEmergencyFreeze: (durationHours: number) => void;
    deactivateEmergencyFreeze: () => void;

    // Guardian Management
    addGuardian: (guardian: Guardian) => void;
    removeGuardian: (id: string) => void;

    // Timelock Management
    addPendingTransaction: (intent: TransactionIntent, analysis: RiskAnalysis) => void;
    cancelPendingTransaction: (index: number) => void;
    executePendingTransaction: (index: number) => void;
    setAddress: (address: string) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    address: "0x7c73...bA21",
    balance: "14.52 ETH",
    assets: [
        { symbol: "ETH", name: "Ethereum", balance: "14.52", valueInUsd: "32,450.12", change24h: "+2.4%" },
        { symbol: "USDC", name: "USD Coin", balance: "1,200.00", valueInUsd: "1,200.00", change24h: "0.0%" },
        { symbol: "ARB", name: "Arbitrum", balance: "450.00", valueInUsd: "890.45", change24h: "-1.2%" },
        { symbol: "LINK", name: "Chainlink", balance: "125.50", valueInUsd: "1,875.25", change24h: "+5.1%" },
    ],
    history: [
        { id: "1", type: "Sent", asset: "ETH", amount: "0.25", status: "Secure", date: "2m ago", to: "0x12b...fE29" },
        { id: "2", type: "Received", asset: "USDC", amount: "1,200.00", status: "Verified", date: "1h ago", from: "0x45a...3B12" },
        { id: "3", type: "Approval", asset: "Uniswap", amount: "Limited", status: "Timelocked", date: "2d ago", findings: ["Approval Scoped to 500 USDC"] },
        { id: "4", type: "Blocked", asset: "ETH", amount: "14.52", status: "Blocked", date: "3d ago", findings: ["Phishing Contract Detected"], to: "0xbad...dead" },
    ],
    isAnalyzing: false,
    currentIntent: null,
    riskAnalysis: null,
    analysisStage: "idle",
    pendingTransactions: [],

    settings: {
        timelock: 12,
        dailyLimit: "5.0",
        guardianCount: 3,
        socialRecoveryActive: true,
        guardians: [
            { id: "1", name: "Ledger Nano X", address: "0xhardware...eth", type: "hardware", lastActive: "Online", status: "active" },
            { id: "2", name: "Alex (Friend)", address: "alex.eth", type: "social", lastActive: "2h ago", status: "active" },
            { id: "3", name: "Backup Seed", address: "0xbackup...eth", type: "backup", lastActive: "Secure", status: "active" },
        ],
        emergencyFreezeActive: false,
        freezeUntil: undefined,
        notificationsEnabled: true,
        biometricEnabled: true,
    },

    setIntent: (intent) => set({ currentIntent: intent, riskAnalysis: null, analysisStage: "intent" }),

    setAnalysisStage: (stage) => set({ analysisStage: stage }),

    runAnalysis: async () => {
        const { currentIntent, settings } = get();
        if (!currentIntent) return;

        set({ isAnalyzing: true, analysisStage: "analyzing" });
        
        // Add notification for analysis start
        useNotificationStore.getState().addNotification({
            type: "transaction",
            priority: "medium",
            title: "Transaction Analysis Started",
            message: `Analyzing ${currentIntent.functionName || "transaction"} to ${currentIntent.to.slice(0, 8)}...`,
        });

        try {
            const analysis = await analyzeTransaction(
                currentIntent,
                settings.dailyLimit,
                settings.timelock
            );
            
            set({ riskAnalysis: analysis, isAnalyzing: false, analysisStage: "decision" });
            
            // Add notification based on risk level
            const priorityMap = {
                "SAFE": "low" as const,
                "CAUTION": "medium" as const,
                "DANGER": "high" as const,
                "CRITICAL": "critical" as const,
            };
            
            useNotificationStore.getState().addNotification({
                type: "security",
                priority: priorityMap[analysis.level],
                title: `Risk Assessment: ${analysis.level}`,
                message: `Confidence Score: ${analysis.score}/100. ${analysis.findings.length} findings detected.`,
            });
        } catch (error) {
            console.error(error);
            set({ isAnalyzing: false, analysisStage: "decision" });
            
            useNotificationStore.getState().addNotification({
                type: "system",
                priority: "high",
                title: "Analysis Error",
                message: "Failed to complete transaction analysis",
            });
        }
    },

    setAddress: (address) => set({ address }),

    clearTransaction: () => set({
        currentIntent: null,
        riskAnalysis: null,
        isAnalyzing: false,
        analysisStage: "idle"
    }),

    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),

    addTransaction: (tx) => {
        set((state) => ({
            history: [tx, ...state.history]
        }));
        
        // Add notification for new transaction
        const typeMessages = {
            "Sent": `Sent ${tx.amount} ${tx.asset}`,
            "Received": `Received ${tx.amount} ${tx.asset}`,
            "Approval": `${tx.asset} approval granted`,
            "Contract Call": `Contract interaction completed`,
            "Recovery": "Account recovery initiated",
            "Blocked": `Transaction blocked: ${tx.amount} ${tx.asset}`,
        };
        
        const priorities = {
            "Secure": "low" as const,
            "Verified": "low" as const,
            "Timelocked": "medium" as const,
            "Blocked": "high" as const,
            "Recovered": "high" as const,
            "Pending": "medium" as const,
            "Guardian Required": "high" as const,
        };
        
        useNotificationStore.getState().addNotification({
            type: "transaction",
            priority: priorities[tx.status] || "medium",
            title: `Transaction ${tx.status}`,
            message: typeMessages[tx.type] || `Transaction ${tx.type.toLowerCase()}`,
        });
    },

    // Emergency Freeze
    activateEmergencyFreeze: (durationHours) => {
        set((state) => ({
            settings: {
                ...state.settings,
                emergencyFreezeActive: true,
                freezeUntil: Date.now() + (durationHours * 60 * 60 * 1000)
            }
        }));
        
        useNotificationStore.getState().addNotification({
            type: "security",
            priority: "critical",
            title: "Emergency Freeze Activated",
            message: `All transactions locked for ${durationHours} hours. Vault is now in emergency mode.`,
        });
    },

    deactivateEmergencyFreeze: () => {
        set((state) => ({
            settings: {
                ...state.settings,
                emergencyFreezeActive: false,
                freezeUntil: undefined
            }
        }));
        
        useNotificationStore.getState().addNotification({
            type: "security",
            priority: "high",
            title: "Emergency Freeze Deactivated",
            message: "Vault has returned to normal operation mode.",
        });
    },

    // Guardian Management
    addGuardian: (guardian) => set((state) => ({
        settings: {
            ...state.settings,
            guardians: [...state.settings.guardians, guardian],
            guardianCount: state.settings.guardianCount + 1
        }
    })),

    removeGuardian: (id) => set((state) => ({
        settings: {
            ...state.settings,
            guardians: state.settings.guardians.filter(g => g.id !== id),
            guardianCount: Math.max(0, state.settings.guardianCount - 1)
        }
    })),

    // Timelock Management
    addPendingTransaction: (intent, analysis) => {
        set((state) => ({
            pendingTransactions: [
                ...state.pendingTransactions,
                {
                    intent,
                    analysis,
                    createdAt: Date.now(),
                    executeAt: Date.now() + ((analysis.delayHours || state.settings.timelock) * 60 * 60 * 1000),
                    status: "pending"
                }
            ]
        }));
        
        const delayHours = analysis.delayHours || get().settings.timelock;
        useNotificationStore.getState().addNotification({
            type: "transaction",
            priority: "medium",
            title: "Transaction Queued",
            message: `${intent.functionName || "Transaction"} will execute in ${delayHours} hours`,
        });
    },

    cancelPendingTransaction: (index) => {
        set((state) => ({
            pendingTransactions: state.pendingTransactions.map((tx, i) =>
                i === index ? { ...tx, status: "cancelled" as const } : tx
            )
        }));
        
        useNotificationStore.getState().addNotification({
            type: "transaction",
            priority: "low",
            title: "Transaction Cancelled",
            message: "Pending transaction has been cancelled successfully",
        });
    },

    executePendingTransaction: (index) => {
        set((state) => ({
            pendingTransactions: state.pendingTransactions.map((tx, i) =>
                i === index ? { ...tx, status: "executed" as const } : tx
            )
        }));
        
        useNotificationStore.getState().addNotification({
            type: "transaction",
            priority: "high",
            title: "Transaction Executed",
            message: "Timelocked transaction has been executed",
        });
    },
}));
