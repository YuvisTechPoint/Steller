# 🛡️ Steller Protocol
### **Advanced Smart Contract Vault & Institutional-Grade Security Layer**

![Steller Banner](https://img.shields.io/badge/Steller-Protocol_Infinity-5B6CFF?style=for-the-badge&logo=shield)
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4.0-38B2AC?style=for-the-badge&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase)

---

## 🌟 Overview
**Steller Protocol** is a high-end, self-custodial smart wallet and security dashboard designed for the next generation of decentralized finance. It bridges the gap between institutional security and a "Touch-UI" premium user experience, featuring hardware-enforced recovery paths, real-time risk analysis, and a living security architecture.

Moving away from static tables and basic buttons, Steller utilizes an **Exotic UI** framework designed with tactile physics, translucent glassmorphism, and hardware-inspired aesthetics.

---

## 🛠️ Core Security Features

### ⚡ **Smart Security Engine**
*   **Real-Time Risk Analysis**: Every transaction intent is scanned by a multi-layer risk engine before execution, providing a confidence score and detailed security findings.
*   **Emergency Vault Freeze**: A protocol-wide lockdown mechanism that severs all egress gateways instantly in the event of a detected threat.
*   **Cryptographic Timelock**: High-value or high-risk transactions are automatically queued in a hardware-verified timelock, allowing guardians to intervene.

### 👥 **Guardian Protocol**
*   **Multi-Layer Quorum**: Configure a set of guardians (Hardware Wallets, Social Peers, Backup Seeds) to authorize recovery or high-stakes actions.
*   **Social Recovery Path**: A streamlined process to regain access to your vault using cryptographic proofs from your trusted guardians.

### 📡 **Live Integrity Monitoring**
*   **Security Pulse**: A real-time header visualization tracking Ethereum Gas, Protocol Latency, and Vault Health.
*   **Portfolio Integrity**: Assets feature "Integrity Bars" that grow and pulse based on their share of your total valuation and cryptographic lock status.

---

## 🔐 Authentication Ecosystem
Steller supports a hybrid, real-time authentication model:
*   **MetaMask / Web3**: Secure transaction signing and identity verification.
*   **GitHub Identity**: OAuth-based institutional login with real-time handshake.
*   **Magic Link**: Passwordless "Firebase Entry" via secure email handshakes, removing the need for vulnerable passwords.

---

## 🎨 Design Philosophy: "Exotic UI"
Steller is built for users who demand excellence. Every interaction is designed to feel physical:
*   **Gliding Mode Toggles**: Friction-based tab sliders that move with weighted spring physics.
*   **Tactile Feedback**: Every button and card has a hardware-like "press" feel.
*   **Glow States**: Dynamic aura-glows (Success Green, Emergency Red) that reflect the vault's current integrity state.
*   **Hardware Aesthetics**: Typography and layouts inspired by professional trading terminals and hardware wallets.

---

## 🚀 Tech Stack
*   **Framework**: [Next.js 16 (React 19)](https://nextjs.org/)
*   **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Backend/Auth**: [Firebase SDK](https://firebase.google.com/)
*   **Blockchain Logic**: [Viem](https://viem.sh/) & [Wagmi](https://wagmi.sh/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### 1. Prerequisites
*   Node.js 18.x or higher
*   A Firebase Project
*   A GitHub OAuth Application (for social auth)

### 2. Installation
```bash
git clone https://github.com/YuvisTechPoint/Steller.git
cd Steller
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Launch
```bash
npm run dev
```
Navigate to `http://localhost:3000` to enter the vault.

---

## 🗺️ Roadmap
- [ ] **Cross-Chain Comparison Mode**: Real-time gas and fee analysis across L2s.
- [ ] **3D Holographic Asset Cards**: Highly immersive visualization for NFTs and tokens.
- [ ] **Biometric Enclave**: Native integration with device biometric hardware.
- [ ] **DeFi Strategy Builder**: Tactile "Drag-and-Drop" yield strategy designer.

---

## 📄 License
Protocol Infinity. Part of the Steller Advanced Smart Contract Wallet Security System. Created by [YuvisTechPoint](https://github.com/YuvisTechPoint).
