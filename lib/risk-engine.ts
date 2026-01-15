import { parseEther, formatEther } from "viem";

export type RiskLevel = "SAFE" | "CAUTION" | "DANGER" | "CRITICAL";

export interface Finding {
    id: string;
    type: RiskLevel;
    title: string;
    description: string;
    recommendation?: string;
}

export interface RiskAnalysis {
    score: number; // 0-100
    level: RiskLevel;
    findings: Finding[];
    action: "ALLOW" | "DELAY" | "BLOCK" | "GUARDIAN_REQUIRED";
    delayHours?: number;
    simulation?: {
        assetChange: string;
        balanceAfter: string;
        gasEstimate: string;
        expectedOutcome: string;
    };
    contractMetadata?: {
        name: string;
        verified: boolean;
        ageDays: number;
        interactionCount: number;
    };
}

export interface TransactionIntent {
    to: string;
    value: string;
    data?: string;
    functionName?: string;
    args?: any[];
    token?: string;
    isUrgent?: boolean; // Detects panic-inducing actions
}

export interface BehaviorPattern {
    avgTransactionValue: number;
    typicalRecipients: string[];
    usualTimeOfDay: number[];
    recentActivity: number; // transactions in last hour
}

// Mock Database of "Known" contracts with rich metadata
const KNOWN_CONTRACTS: Record<string, { name: string; ageDays: number; verified: boolean; category: string; trustScore: number }> = {
    "0x123abc456def78901234567890abcdef": { name: "Uniswap V3 Router", ageDays: 1200, verified: true, category: "DEX", trustScore: 98 },
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D": { name: "Uniswap V2 Router", ageDays: 1400, verified: true, category: "DEX", trustScore: 99 },
    "0xdef1c0ded9bec7f1a1670819833240f027b25eff": { name: "0x Exchange Proxy", ageDays: 900, verified: true, category: "DEX", trustScore: 97 },
};

// Scam address database
const SCAM_ADDRESSES = new Set([
    "0xbad72921a4f00b123456789abcdef",
    "0xdead000000000000000000000000",
    "0xscam111111111111111111111111",
]);

// Phishing contract patterns
const PHISHING_SIGNATURES = [
    "securityUpdate",
    "claimReward",
    "claimAirdrop", 
    "emergencyWithdraw",
    "safeTransfer", // when from unknown contract
];

// User behavior simulation
const mockBehavior: BehaviorPattern = {
    avgTransactionValue: 0.5,
    typicalRecipients: ["0x123abc", "0x456def"],
    usualTimeOfDay: [9, 10, 11, 14, 15, 16, 17],
    recentActivity: 2,
};

export async function analyzeTransaction(
    intent: TransactionIntent, 
    userDailyLimit?: string,
    timelockHours?: number
): Promise<RiskAnalysis> {
    // Simulate network delay for "Tracing" effect with progressive updates
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let score = 100;
    const findings: Finding[] = [];
    let delayHours = 0;

    // ═══════════════════════════════════════════════════════════
    // RULE 1: CRITICAL - Known Scam/Phishing Address
    // ═══════════════════════════════════════════════════════════
    const normalizedAddress = intent.to.toLowerCase();
    if (SCAM_ADDRESSES.has(normalizedAddress) || intent.to.includes("bad") || intent.to.includes("scam")) {
        score = 0;
        findings.push({
            id: "scam-db",
            type: "CRITICAL",
            title: "Known Malicious Contract",
            description: "This address has been flagged in our threat intelligence database for phishing, drainer activity, or confirmed scams.",
            recommendation: "Do not proceed. Report this address if you received it from a suspicious source."
        });
        return { 
            score, 
            level: "CRITICAL", 
            findings, 
            action: "BLOCK",
            simulation: {
                assetChange: "BLOCKED",
                balanceAfter: "Protected",
                gasEstimate: "0",
                expectedOutcome: "Transaction prevented - assets protected"
            }
        };
    }

    // ═══════════════════════════════════════════════════════════
    // RULE 2: Contract Verification & Age Analysis
    // ═══════════════════════════════════════════════════════════
    const knownContract = KNOWN_CONTRACTS[intent.to];
    let contractMetadata;
    
    if (knownContract) {
        contractMetadata = {
            name: knownContract.name,
            verified: knownContract.verified,
            ageDays: knownContract.ageDays,
            interactionCount: Math.floor(Math.random() * 10000) + 5000
        };
        
        if (knownContract.trustScore >= 95) {
            findings.push({
                id: "verified-contract",
                type: "SAFE",
                title: "Verified Protocol",
                description: `${knownContract.name} is a verified ${knownContract.category} protocol with ${knownContract.ageDays}+ days of operation.`,
            });
        }
    } else {
        score -= 25;
        findings.push({
            id: "unknown-contract",
            type: "CAUTION",
            title: "Unverified Contract",
            description: "This contract is not in our verified database. It may be newly deployed or unaudited.",
            recommendation: "Proceed with caution. Consider waiting for community verification."
        });
        delayHours = Math.max(delayHours, 6);
    }

    // ═══════════════════════════════════════════════════════════
    // RULE 3: Unlimited Token Approval Detection
    // ═══════════════════════════════════════════════════════════
    const isApproval = intent.functionName === "approve" || intent.functionName === "setApprovalForAll";
    const isUnlimited = intent.args?.[1]?.toString().includes("115792") || 
                        intent.args?.[1]?.toString() === "true" ||
                        intent.functionName === "setApprovalForAll";
    
    if (isApproval && isUnlimited) {
        score -= 35;
        findings.push({
            id: "unlimited-approval",
            type: "DANGER",
            title: "Unlimited Token Approval Requested",
            description: "This transaction requests permission to spend your ENTIRE token balance. This is a common attack vector used in approval-drain scams.",
            recommendation: "Consider setting a specific spending limit instead of unlimited approval."
        });
        delayHours = Math.max(delayHours, 12);
    }

    // ═══════════════════════════════════════════════════════════
    // RULE 4: Abnormal Transfer Magnitude
    // ═══════════════════════════════════════════════════════════
    const valueEth = parseFloat(intent.value || "0");
    const dailyLimit = parseFloat(userDailyLimit || "5.0");
    
    if (valueEth > dailyLimit) {
        score -= 20;
        findings.push({
            id: "exceeds-limit",
            type: "DANGER",
            title: "Exceeds Daily Transfer Limit",
            description: `This transaction of ${valueEth} ETH exceeds your configured daily limit of ${dailyLimit} ETH.`,
            recommendation: "Large transfers require additional timelock for security."
        });
        delayHours = Math.max(delayHours, timelockHours || 12);
    } else if (valueEth > mockBehavior.avgTransactionValue * 10) {
        score -= 10;
        findings.push({
            id: "unusual-amount",
            type: "CAUTION",
            title: "Unusually Large Transfer",
            description: `This amount is ${Math.round(valueEth / mockBehavior.avgTransactionValue)}x larger than your typical transactions.`,
            recommendation: "Double-check the amount before proceeding."
        });
        delayHours = Math.max(delayHours, 4);
    }

    // ═══════════════════════════════════════════════════════════
    // RULE 5: Phishing Function Signature Detection
    // ═══════════════════════════════════════════════════════════
    if (intent.functionName && PHISHING_SIGNATURES.some(sig => 
        intent.functionName?.toLowerCase().includes(sig.toLowerCase())
    )) {
        if (!knownContract) {
            score -= 30;
            findings.push({
                id: "phishing-signature",
                type: "DANGER",
                title: "Suspicious Function Detected",
                description: `The function "${intent.functionName}" matches known phishing patterns. Scammers often use urgent-sounding function names.`,
                recommendation: "Verify the legitimacy of this contract through official channels."
            });
            delayHours = Math.max(delayHours, 24);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // RULE 6: Panic Action / Urgency Detection
    // ═══════════════════════════════════════════════════════════
    if (intent.isUrgent) {
        score -= 15;
        findings.push({
            id: "panic-detected",
            type: "CAUTION",
            title: "Urgency Pattern Detected",
            description: "This action appears to be triggered by urgency. Scammers often create false urgency to bypass careful consideration.",
            recommendation: "Take a moment to verify. Legitimate protocols rarely require immediate action."
        });
        delayHours = Math.max(delayHours, 2);
    }

    // ═══════════════════════════════════════════════════════════
    // RULE 7: Recent Activity Spike (Rate Limiting)
    // ═══════════════════════════════════════════════════════════
    if (mockBehavior.recentActivity > 5) {
        score -= 10;
        findings.push({
            id: "activity-spike",
            type: "CAUTION",
            title: "Unusual Activity Pattern",
            description: "Multiple transactions detected in a short period. This could indicate compromised access.",
            recommendation: "Verify all recent transactions are legitimate."
        });
    }

    // ═══════════════════════════════════════════════════════════
    // CALCULATE FINAL RISK ASSESSMENT
    // ═══════════════════════════════════════════════════════════
    
    // Ensure score stays in bounds
    score = Math.max(0, Math.min(100, score));

    // Determine Level
    let level: RiskLevel = "SAFE";
    if (score < 30) level = "CRITICAL";
    else if (score < 50) level = "DANGER";
    else if (score < 80) level = "CAUTION";

    // Determine Action based on score and findings
    let action: RiskAnalysis["action"] = "ALLOW";
    if (score < 20) {
        action = "BLOCK";
    } else if (score < 40 || findings.some(f => f.type === "DANGER" && f.id === "unlimited-approval")) {
        action = "GUARDIAN_REQUIRED";
        delayHours = Math.max(delayHours, 24);
    } else if (score < 70 || delayHours > 0) {
        action = "DELAY";
    }

    // Build simulation result
    const simulation = {
        assetChange: intent.value ? `-${intent.value} ETH` : intent.functionName === "approve" ? "Approval Only" : "Contract Call",
        balanceAfter: intent.value ? `${(14.52 - valueEth).toFixed(2)} ETH` : "14.52 ETH",
        gasEstimate: "0.0043 ETH",
        expectedOutcome: action === "ALLOW" 
            ? "Transaction will execute immediately" 
            : action === "DELAY" 
                ? `Transaction queued with ${delayHours}h timelock` 
                : action === "GUARDIAN_REQUIRED"
                    ? "Requires guardian approval before execution"
                    : "Transaction blocked for your protection"
    };

    return {
        score,
        level,
        findings,
        action,
        delayHours: delayHours > 0 ? delayHours : undefined,
        simulation,
        contractMetadata
    };
}

// Helper to get risk color
export function getRiskColor(level: RiskLevel): string {
    switch (level) {
        case "SAFE": return "#4FD1C5";
        case "CAUTION": return "#FBBF24";
        case "DANGER": return "#FF6B6B";
        case "CRITICAL": return "#EF4444";
        default: return "#9AA3B2";
    }
}

// Helper to get action description
export function getActionDescription(action: RiskAnalysis["action"], delayHours?: number): string {
    switch (action) {
        case "ALLOW": return "Safe to execute immediately";
        case "DELAY": return `Protected with ${delayHours || 12}h timelock`;
        case "GUARDIAN_REQUIRED": return "Requires guardian approval";
        case "BLOCK": return "Blocked for your protection";
    }
}
