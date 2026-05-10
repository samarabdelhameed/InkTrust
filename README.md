# InkTrust (Faxi) — The Analog-to-Onchain Bridge

[![Solana](https://img.shields.io/badge/Solana-Protocol-black?logo=solana)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-Framework-blue)](https://anchor-lang.com)
[![AI](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-orange?logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**InkTrust** is a production-grade infrastructure platform designed to bridge the gap between legacy analog systems (Fax) and modern decentralized finance (Solana). Built specifically for the **Colosseum Hackathon**, InkTrust enables elderly users to execute secure, caregiver-authorized on-chain transactions using nothing but a fax machine.

---

## 🚀 The Vision

Elderly digital exclusion is a multi-billion dollar problem. InkTrust provides a **Trust & Authorization Layer** that allows elderly users to send "Analog Intents" (Faxes) which are parsed by autonomous AI agents, validated against family-governed spending policies, and executed on-chain via Solana.

---

## 🛠 Tech Stack

### **Core Infrastructure**
- **Solana & Anchor**: Smart contracts managing state-derived addresses (PDAs), durable nonces, and family approvals.
- **Gemini 2.0 Flash**: Multi-modal AI processing for real-time fax intent extraction and entity recognition.
- **BullMQ & Redis**: Distributed, reliable queue orchestration for asynchronous fax processing pipelines.
- **PostgreSQL & Prisma**: Enterprise-grade relational state management and audit logging.

### **Integrations**
- **Telnyx**: Global fax infrastructure for receiving and sending analog signals.
- **Solana Actions/Blinks**: One-click decentralized approvals for caregivers.
- **World ID**: Verification of elderly identity to prevent fraud.
- **Coinbase x402**: Agentic payment protocol for unlocking premium agent services.
- **AWS S3**: Secure, encrypted storage for document artifacts.

---

## 🏗 System Architecture

1. **Ingestion**: Fax is received via Telnyx and persisted as a `FaxJob`.
2. **AI Processing**: Gemini extracts intent, amount, merchant, and urgency.
3. **Authorization**: If intent exceeds family-set thresholds, a Solana PDA is initialized.
4. **Approval**: Caregivers receive a **Blink** to approve the transaction via their wallet.
5. **Execution**: The autonomous agent executes the transaction (SPL transfer or payment).
6. **Confirmation**: A receipt is generated and faxed back to the user automatically.

---

## 💻 Developer Guide

### Prerequisites
- Node.js >= 18
- PNPM >= 8
- Docker & Docker Compose
- Anchor CLI

### Local Setup
```bash
# 1. Clone & Install
git clone https://github.com/samarabdelhameed/InkTrust.git
cd inktrust
pnpm install

# 2. Boot Infrastructure
pnpm infra:up

# 3. Setup Database
pnpm db:setup

# 4. Build Smart Contracts
anchor build

# 5. Run Development Servers
pnpm dev
```

### Testing
```bash
# Run unit tests
pnpm test

# Run E2E Integration Flow
tsx infrastructure/scripts/test-e2e-flow.ts
```

---

## 🛡 Security & Compliance
- **Signed Webhooks**: All Telnyx communications are validated via Ed25519 signatures.
- **Audit Logging**: Every AI decision and human review is logged immutably.
- **RBAC**: Strict role-based access control for admin and caregiver interfaces.
- **Durable Nonces**: Ensures transaction safety even during network congestion.

---

## 📜 License
MIT License. Built with ❤️ for the Solana Community.
