# ShowUp Protocol - Technical Plan

## Project Overview
- **Name**: ShowUp Protocol
- **One-line**: "Put money behind your word"
- **Type**: Decentralized commitment/staking DApp
- **Chain**: XRPL Testnet
- **Storage**: Pinata/IPFS

---

## Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | lucide-react |
| Blockchain | xrpl.js (XRPL Testnet) |
| Storage | Pinata SDK |
| Database | SQLite (lightweight, file-based) |
| Auth | Wallet-based (simplified) |

---

## Data Model

### Commitment
```typescript
interface Commitment {
  id: string
  title: string
  description: string
  eventTime: Date
  stakeAmount: number // in XRP drops
  participants: Participant[]
  payoutRule: PayoutRule
  proofMethod: ProofMethod
  status: CommitmentStatus
  ipfsCid: string | null
  createdAt: Date
  updatedAt: Date
}

enum CommitmentStatus {
  DRAFT = 'draft'
  FUNDED = 'funded'
  ACTIVE = 'active'
  CHECKED_IN = 'checked_in'
  SETTLED = 'settled'
  EXPIRED = 'expired'
}

enum PayoutRule {
  REFUND_BOTH = 'refund_both'
  WINNER_TAKES_ALL = 'winner_takes_all'
  CHARITY = 'charity'
}

enum ProofMethod {
  MUTUAL = 'mutual'
  QR = 'qr'
}
```

### Participant
```typescript
interface Participant {
  id: string
  walletAddress: string
  hasCheckedIn: boolean
  proofIpfsCid: string | null
}
```

---

## XRPL Integration

### On-Chain Actions

| Action | Transaction | Purpose |
|--------|-------------|---------|
| Create Commitment | Payment to escrow account | Lock stake |
| Check-in | AccountSet or Memo update | Record proof |
| Settle | Payment to winner | Distribute funds |

### Transaction Design
- **Commitment Creation**: Payment to a designated escrow address with commitment ID in memo
- **Settlement**: Payment transaction with settlement metadata in memo
- **IPFS Reference**: Store Pinata CID in transaction memo field

### Why XRPL?
- Fast settlement (4-6 seconds)
- Low fees (perfect for small stakes)
- Native escrow support
- Memo field for metadata

---

## Pinata/IPFS Design

### Stored Artifacts

| Artifact | Content | When |
|----------|---------|------|
| Commitment Metadata | Full commitment JSON | Created |
| Proof Packet | Check-in proof JSON | Check-in |
| Settlement Record | Outcome + details | Settled |

### Proof Packet Schema
```json
{
  "commitmentId": "...",
  "participantId": "...",
  "timestamp": "...",
  "method": "qr" | "mutual",
  "note": "...",
  "imageCid": "optional"
}
```

---

## Folder Structure

```
showup-protocol/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx         # User's commitments
│   ├── create/
│   │   └── page.tsx        # Create commitment
│   └── commitment/
│       └── [id]/
│           └── page.tsx      # Commitment details
├── components/
│   ├── ui/                  # shadcn components
│   ├── LandingHero.tsx
│   ├── CreateCommitmentForm.tsx
│   ├── CommitmentCard.tsx
│   ├── CheckInButton.tsx
│   └── SettlementResult.tsx
├── lib/
│   ├── xrpl/
│   │   ├── client.ts       # XRPL connection
│   │   ├── transactions.ts # Transaction helpers
│   │   └── wallet.ts       # Wallet generation
│   ├── pinata/
│   │   └── client.ts       # Pinata upload
│   ├── commitments/
│   │   └── service.ts     # Business logic
│   └── db.ts              # SQLite connection
├── prisma/
│   └── schema.prisma
├── public/
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## UX Flow

### 1. Landing Page
- Hero: "Put money behind your word"
- How it works: 3 steps
- CTA: "Create Commitment"

### 2. Create Commitment
- Form with all fields
- Wallet connection (XRPL testnet)
- Preview before confirm

### 3. Commitment Details
- Status badge
- Participants
- Time countdown
- Check-in button
- On-chain / IPFS links

### 4. Check-in
- QR code display OR mutual confirm
- Submit proof
- Upload to Pinata

### 5. Settlement
- Automatic or manual trigger
- Show winner
- On-chain transaction link

---

## Demo Flow (For Judges)

1. Open app → Landing page
2. Click "Create Commitment"
3. Fill: "Gym at 6PM", stake 1 XRP, 2 participants
4. Both connect wallets (testnet)
5. Show XRPL transaction (testnet)
6. Show IPFS commitment record
7. Simulate check-in
8. Show settlement transaction

---

## Success Criteria

- [ ] App runs locally with `pnpm dev`
- [ ] Can create a commitment
- [ ] Can connect XRPL testnet wallet
- [ ] Commitment stored on IPFS via Pinata
- [ ] Can simulate check-in flow
- [ ] Settlement displays correctly
- [ ] UI is beautiful and understandable in 30 seconds
