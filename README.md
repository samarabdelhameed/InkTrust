<p align="center">
  <h1 align="center">🖋️ InkTrust</h1>
  <p align="center">
    <strong>The Analog-to-Onchain Bridge — Empowering Elderly Access Through Invisible Blockchain Infrastructure</strong>
  </p>
  <p align="center">
    <a href="#architecture">Architecture</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#sponsor-integrations">Sponsor Integrations</a> •
    <a href="#license">License</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Solana-Mainnet-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Gemini_2.0-Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/AI_Agents-Autonomous-FF6B35?style=for-the-badge" alt="AI Agents" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </p>
</p>

---

## Overview

**InkTrust** is a decentralized trust infrastructure that transforms the most familiar analog device — the fax machine — into a secure gateway to onchain services for elderly populations. By combining multimodal AI vision models with Solana's high-performance blockchain, InkTrust enables seniors to access digital services through handwritten fax requests, while an invisible blockchain layer provides fraud protection, family-governed spending policies, and verifiable transaction integrity.

> **The core insight:** Millions of elderly people (particularly in countries like Japan) are excluded from modern digital services — not because they lack needs, but because the technology demands apps, passwords, and crypto wallets they cannot navigate. InkTrust eliminates this barrier entirely. The user writes on paper. The blockchain works silently behind the scenes.

---

## Define Problem

The real problem is not "how to send a fax." It is a **structural, architectural challenge** of bridging Legacy Interfaces with modern internet infrastructure and autonomous AI agents.

### 1. The Analog-Digital Divide

Millions of **analog-first users** (elderly populations) are completely isolated from modern digital services. They face a near-impossible learning curve to interact with smartphones, applications, digital wallets, and passwords. The core technical problem: **how to integrate these users into the digital economy without forcing them to adopt any web interfaces whatsoever.**

### 2. Limitations of Legacy Communication Protocols

Although fax machines are trusted and widely used (especially in Japan), they are architecturally **passive instruments** limited to one-way document transmission. Traditional fax protocols suffer from critical technical deficiencies:

- **No intent parsing** — inability to understand user intentions from unstructured handwritten input
- **No API interoperability** — cannot interact with REST APIs, webhooks, or modern service endpoints
- **No transactional capability** — cannot execute financial operations or e-commerce purchases
- **No workflow orchestration** — no support for sessions, cookies, or contextual memory across interactions

### 3. Trust & Fraud Vulnerability

Connecting a vulnerable, high-risk demographic (elderly users) to the internet and e-commerce introduces a **critical security problem**. Existing centralized systems fail to provide a safe environment that prevents exploitation. Without a decentralized blockchain layer, the system fundamentally lacks:

- **Verifiable approvals** — no cryptographic proof that the user authorized a specific action
- **Immutable audit trails** — no tamper-proof record of all transactions and agent actions
- **Caregiver authorization policies** — no trustless management of family member identities and permissions
- **Fraud prevention** — no enforceable spending limits or anomaly detection at the protocol level

### 4. The "Zero-UI" Paradox

The most complex software engineering challenge in InkTrust's design: **How can an AI agent receive a paper document containing multiple intents (multi-intent orchestration), execute complex digital tasks across the internet, and complete the entire transaction — without ever asking the user for clarification, requiring account creation, or demanding any digital interaction?**

> **Elevator Pitch (Problem):**
> *"The problem we solve is the complete absence of a secure technical bridge that allows analog users to interact with AI Agents for executing digital and financial tasks — while current systems lack a decentralized trust layer that protects these users from fraud without forcing them to abandon the legacy devices they trust."*

---

## The InkTrust Solution

### 1. Zero-Friction Interface

InkTrust is an AI-agent-powered digital bridge, purpose-built for elderly users in Japan, enabling them to access digital services — email, e-commerce, appointments, financial transfers — using only the fax machine they already know and trust. The solution **completely eliminates the learning curve**: no apps to download, no accounts to create, no passwords to remember.

### 2. AI as an Intelligent Interface Layer

InkTrust transforms the fax machine from a passive document transmission tool into a **smart input/output interface for the internet**:

- **Gemini 2.0 Flash (Vision AI)** serves as the cognitive engine — reading handwritten text, extracting structured intents, and interpreting hand-drawn approval circles from scanned fax documents
- **MCP Agent orchestration** coordinates autonomous AI agents to execute complex multi-step digital tasks across the internet on behalf of the user
- **Contextual memory & workflow management** maintains conversation state and task history across multiple fax interactions, enabling coherent multi-turn workflows

### 3. Blockchain as Invisible Trust Infrastructure

Solana is **not** used to expose cryptocurrency to end users. Instead, it serves as a **decentralized trust and delegation infrastructure** that protects the most fraud-vulnerable demographic:

- **Onchain caregiver identity** — trusted family members are registered on-chain with verifiable, permissioned roles
- **Smart contract spending limits** — programmable policies enforce maximum transaction amounts, category restrictions, and time-based controls
- **Immutable approval attestations** — every authorization (including Circle-to-Approve) is recorded as a tamper-proof onchain record
- **Delegated execution** — AI agents act within strictly bounded permissions, with automatic escalation to human caregivers when thresholds are exceeded

### 4. Built-in Fraud Protection & Safety

Because the target users are elderly, InkTrust provides **multiple invisible protection layers**:

- **Fraud-proof payments** — all purchases require explicit handwritten approval via the Circle-to-Approve mechanism, with human-in-the-loop review for anomalous purchase patterns
- **Protected inbox** — the system maintains a curated whitelist of trusted contacts, shielding users from phishing attacks and spam
- **Caregiver co-signing** — high-value or unusual transactions are automatically paused and escalated via SMS to a designated family member for approval before execution

### 5. End-to-End Workflow

```
📝 Senior writes request by hand → 📠 Sends via fax
        │
        ▼
🧠 AI reads the document → Extracts intent → Agent executes tasks online
        │
        ▼
📠 System generates formatted result → Faxes receipt back to senior
```

> **Elevator Pitch (Solution):**
> *"The user sees only a familiar fax machine. But behind the scenes, that fax becomes a secure agentic internet interface — powered by AI agents, governed by family-controlled smart contracts, and settled on Solana's blockchain."*

**Zero apps. Zero passwords. Zero crypto complexity. Full blockchain security.**

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ANALOG LAYER (User)                         │
│                                                                     │
│   ┌──────────┐    Fax     ┌──────────────┐    Fax     ┌──────────┐ │
│   │  Senior   │ ────────► │  Telnyx API  │ ◄──────── │ Response  │ │
│   │ (Paper)   │           │  (Webhook)   │           │ (Receipt) │ │
│   └──────────┘            └──────┬───────┘           └────▲──────┘ │
└──────────────────────────────────┼─────────────────────────┼───────┘
                                   │                         │
┌──────────────────────────────────┼─────────────────────────┼───────┐
│                         AI LAYER (Brain)                    │       │
│                                  ▼                         │       │
│              ┌───────────────────────────────┐             │       │
│              │    Gemini 2.0 Flash (Vision)  │             │       │
│              │  ┌─────────────────────────┐  │             │       │
│              │  │  Handwriting → Intent   │  │             │       │
│              │  │  Circle Detection (Y/N) │  │             │       │
│              │  │  One-shot Extraction    │  │             │       │
│              │  └─────────────────────────┘  │             │       │
│              └──────────────┬────────────────┘             │       │
│                             ▼                              │       │
│              ┌───────────────────────────────┐             │       │
│              │     MCP Agent Controller      │─────────────┘       │
│              │  (Intent Router & Executor)   │                     │
│              └──────────────┬────────────────┘                     │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
┌─────────────────────────────┼──────────────────────────────────────┐
│                    ONCHAIN LAYER (Solana)                           │
│                             ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                   Metaplex Agent Kit                        │  │
│   │            (Agent Identity as Core NFTs)                    │  │
│   │         Embedded Wallets · Delegated Execution              │  │
│   └─────────────────────────┬───────────────────────────────────┘  │
│                             ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                    Swig Policy Engine                       │  │
│   │  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐  │  │
│   │  │ Spend Limits │  │ Family Roles  │  │ Time Windows   │  │  │
│   │  └──────────────┘  └───────────────┘  └────────────────┘  │  │
│   │         Caregiver SMS Approval · Fraud Prevention          │  │
│   └─────────────────────────┬───────────────────────────────────┘  │
│                             ▼                                      │
│   ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│   │  Helius RPC  │  │   Privy      │  │  x402 (Coinbase)       │  │
│   │  (Sub-ms)    │  │ (Gasless TX) │  │  (Stablecoin Micropay) │  │
│   └──────────────┘  └──────────────┘  └────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼──────────────────────────────────────┐
│                   COMMERCE LAYER (Real World)                      │
│                             ▼                                      │
│              ┌───────────────────────────────┐                     │
│              │     MoonPay Agents SDK        │                     │
│              │  Virtual Cards · Fiat Offramp │                     │
│              │  Amazon / Pharmacy / Services │                     │
│              └───────────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## Features

### 🖊️ Circle-to-Approve Mechanism
A novel analog authentication primitive. When a sensitive operation is requested (e.g., a financial transfer), the system prints a confirmation page via fax with two options: **Approve** / **Reject**. The senior draws a circle around their choice with a pen. Gemini Vision AI detects the circled option and converts it into a cryptographic transaction signature on Solana — turning a hand-drawn circle into a blockchain-validated approval.

### 👨‍👩‍👧 Family Guardian Protocol
Trusted family members are registered onchain as **Caregiver Authorities** via Swig smart wallets. The policy engine enforces configurable rules:
- **Spending thresholds** — purchases above a defined limit are paused until a caregiver co-signs via SMS/mobile
- **Category restrictions** — block specific merchant categories or transaction types
- **Time-based windows** — restrict transaction hours to prevent late-night fraud attempts
- **Multi-sig escalation** — high-value operations require approval from multiple family members

### 🤖 Autonomous AI Agents with Onchain Identity
Each elderly user is paired with a dedicated AI Agent registered on Solana as a **Metaplex Core NFT**. This gives the agent:
- A verifiable onchain identity linked to the senior's account
- An embedded wallet for delegated transaction execution
- An auditable action history stored immutably on the blockchain
- Economic agency to interact with DeFi protocols and commerce APIs

### 🔒 Invisible Blockchain UX
The senior **never** interacts with blockchain technology directly:
- No seed phrases, no wallet apps, no gas fees (Privy gasless transactions)
- No browser extensions or QR codes
- The entire crypto layer is abstracted behind paper and fax
- Family members interact via a simple mobile dashboard

### 🛒 Real-World Commerce Execution
AI Agents can autonomously complete purchases in the physical world:
- **MoonPay virtual cards** for e-commerce (Amazon, pharmacies, utilities)
- **x402 protocol** for instant stablecoin API micropayments
- **Fax receipt generation** — every completed transaction is printed and faxed back as a tangible confirmation

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 | Dashboard for caregivers & system admin |
| **Fax Gateway** | Telnyx API | Receive/send fax via webhooks |
| **Vision AI** | Gemini 2.0 Flash | Multimodal handwriting & circle recognition |
| **Agent Framework** | Metaplex Agent Kit | Onchain AI agent identity (Core NFTs) |
| **Smart Wallets** | Swig SDK | Policy engine, spend limits, delegated execution |
| **Auth & Wallets** | Privy | Invisible embedded wallets, gasless transactions |
| **Blockchain** | Solana | High-throughput, low-cost settlement layer |
| **RPC Provider** | Helius | Sub-millisecond RPC for reliable demos |
| **Commerce** | MoonPay Agents | Virtual cards, fiat on/off-ramp |
| **Micropayments** | x402 (Coinbase) | Stablecoin-based API fee payments |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** or **npm**
- **Solana CLI** installed and configured
- API keys for: Telnyx, Google AI (Gemini), Privy, Helius, MoonPay

### Installation

```bash
# Clone the repository
git clone https://github.com/samarabdelhameed/InkTrust.git
cd InkTrust

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# AI / Vision
GEMINI_API_KEY=your_gemini_api_key

# Fax Gateway
TELNYX_API_KEY=your_telnyx_api_key
TELNYX_FAX_WEBHOOK_URL=https://your-domain.com/api/fax/inbound

# Auth & Wallets
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Commerce
MOONPAY_API_KEY=your_moonpay_api_key

# Micropayments
X402_COINBASE_API_KEY=your_x402_key
```

### Development

```bash
# Start the development server
npm run dev

# Run in Solana devnet mode
NEXT_PUBLIC_SOLANA_NETWORK=devnet npm run dev
```

---

## How It Works

### End-to-End Flow

```
📄 Senior writes: "Buy my blood pressure medicine"
        │
        ▼
📠 Fax sent → Telnyx webhook receives image
        │
        ▼
🧠 Gemini 2.0 Flash analyzes handwriting
   ├── Extracts intent: PURCHASE
   ├── Item: "blood pressure medication"
   └── Urgency: NORMAL
        │
        ▼
🤖 Metaplex Agent activates
   ├── Checks Swig spending policy
   └── Amount ($45) exceeds $30 threshold
        │
        ▼
⏸️ Transaction PAUSED
   ├── SMS sent to caregiver (son/daughter)
   └── "Dad wants to buy medication — $45. Approve?"
        │
        ▼
✅ Caregiver approves via mobile
   └── Swig co-signature recorded onchain
        │
        ▼
💳 MoonPay Agent creates virtual card
   └── Purchases medication on pharmacy website
        │
        ▼
📠 Receipt faxed back to senior
   └── "✓ Your medication has been ordered. Delivery: May 12."
```

### Circle-to-Approve Flow

```
📠 Fax prints confirmation page:

   ┌─────────────────────────────────┐
   │                                 │
   │   Transfer ¥50,000 to          │
   │   Tokyo Electric Company?       │
   │                                 │
   │     [ APPROVE ]    [ REJECT ]   │
   │                                 │
   └─────────────────────────────────┘

👴 Senior draws a circle around "APPROVE"

📠 Fax sent back → Gemini detects circled option

🔐 Circle → Onchain transaction signature

✅ Payment executed on Solana
```

---

## Sponsor Integrations

InkTrust is purpose-built to maximize integration with Colosseum hackathon sponsor tools:

| Sponsor | Integration | Track |
|---------|------------|-------|
| **Metaplex** | Agent Kit for onchain AI agent identity (Core NFTs with embedded wallets) | Agent Infrastructure |
| **Swig** | Smart wallet policy engine for family-governed spending rules & delegated execution | Smart Wallets |
| **Privy** | Invisible embedded wallets with gasless transactions for zero-friction UX | Auth & Wallets |
| **MoonPay** | Agent-driven virtual card issuance for real-world e-commerce purchases | Agentic Commerce |
| **Coinbase (x402)** | Stablecoin micropayments for API-level service fees | Payments Protocol |
| **Helius** | Sub-millisecond RPC for real-time demo reliability | Infrastructure |
| **Google (Gemini)** | Multimodal vision model for handwriting recognition & intent extraction | AI / ML |
| **Telnyx** | Fax-to-webhook gateway for analog-to-digital conversion | Communications |

---

## Project Structure

```
inktrust/
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── fax/
│   │   │   ├── inbound/        # Telnyx fax webhook handler
│   │   │   └── outbound/       # Fax response generator
│   │   ├── agent/              # AI agent orchestration endpoints
│   │   ├── approve/            # Circle-to-Approve processing
│   │   └── commerce/           # MoonPay virtual card operations
│   ├── dashboard/              # Caregiver management interface
│   └── layout.tsx              # Root layout
├── lib/
│   ├── ai/
│   │   ├── gemini.ts           # Gemini 2.0 Flash vision client
│   │   └── intent-parser.ts    # Handwriting → structured intent
│   ├── blockchain/
│   │   ├── metaplex.ts         # Agent Kit integration
│   │   ├── swig.ts             # Policy engine & smart wallets
│   │   └── privy.ts            # Embedded wallet management
│   ├── commerce/
│   │   ├── moonpay.ts          # Virtual card & purchase logic
│   │   └── x402.ts             # Stablecoin micropayments
│   └── fax/
│       ├── telnyx.ts           # Fax send/receive handlers
│       └── renderer.ts         # Receipt & approval page generator
├── programs/                   # Solana programs (Anchor)
│   └── guardian/               # Family permission smart contract
├── public/                     # Static assets
├── .env.example                # Environment template
├── package.json
└── README.md
```

---

## Roadmap

- [x] System architecture & design document
- [ ] Fax ingestion pipeline (Telnyx webhooks)
- [ ] Gemini Vision integration for handwriting OCR
- [ ] Circle-to-Approve detection model
- [ ] Metaplex Agent registration & wallet binding
- [ ] Swig policy engine integration
- [ ] Privy gasless wallet setup
- [ ] MoonPay virtual card commerce flow
- [ ] Caregiver dashboard (Next.js)
- [ ] End-to-end demo pipeline
- [ ] Colosseum hackathon submission

---

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>InkTrust</strong> — Where ink meets trust. Bridging generations through invisible blockchain infrastructure.
  <br />
  <sub>Built for the Colosseum Solana Frontier Hackathon 2026</sub>
</p>
