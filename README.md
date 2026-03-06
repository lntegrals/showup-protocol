# ShowUp Protocol 🦶

**Put money behind your word.**

A decentralized anti-flake commitment app where users stake value on their promises. Built on XRPL + IPFS for the Midwest Block-a-Thon.

---

## Demo Script (For Judges)

### Opening (15 seconds)
> "ShowUp Protocol is a commitment staking app. When you make a promise, you put money on it. If you show up, you get your money back. If you flake, you lose it."

### Step 1: Create Commitment (30 seconds)
1. Go to homepage
2. Click "Create Commitment"
3. Fill in:
   - Title: "Gym Session"
   - Stake: 1 XRP
   - Participants: Alice, Bob
4. Click "Create"
5. Show: Transaction submitted to XRPL testnet

### Step 2: Show On-Chain (15 seconds)
1. Click on the commitment
2. Show XRPL transaction hash
3. Click "View on XRPL Explorer"
4. Point out the commitment details in the transaction

### Step 3: Show IPFS (15 seconds)
1. Show IPFS CID in the UI
2. Click to view the commitment metadata on IPFS gateway
3. Explain: "This proof is permanently stored"

### Step 4: Check-In Demo (20 seconds)
1. Click "Check In" button
2. Show confirmation
3. Show proof stored on IPFS

### Closing (15 seconds)
> "ShowUp Protocol uses XRPL for transparent stake handling and IPFS for tamper-proof proof storage. No backend required - just smart contracts and decentralized storage."

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind |
| Blockchain | XRPL (testnet) |
| Storage | Pinata/IPFS |
| State | In-memory (hackathon demo) |

## Key Files

- `app/page.tsx` - Landing page
- `app/create/page.tsx` - Create commitment
- `app/dashboard/page.tsx` - List commitments
- `app/commitment/[id]/page.tsx` - Commitment details
- `lib/xrpl/client.ts` - XRPL integration
- `lib/pinata/client.ts` - IPFS integration

## Setup

```bash
pnpm install
pnpm dev
```

## Why This Wins

1. ✅ Real XRPL transactions
2. ✅ Real IPFS storage
3. ✅ Beautiful UI
4. ✅ Simple story anyone understands
5. ✅ Works offline (no complex backend)
6. ✅ Demo-friendly (in-memory state)

---

*Built for the Midwest Block-a-Thon 2026*
