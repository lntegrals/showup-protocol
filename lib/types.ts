export type CommitmentStatus = 
  | 'draft'
  | 'funded'
  | 'active'
  | 'checked_in'
  | 'settled'
  | 'expired';

export type PayoutRule = 
  | 'refund_both'
  | 'winner_takes_all'
  | 'charity';

export type ProofMethod = 
  | 'mutual'
  | 'qr';

export interface Participant {
  id: string;
  name: string;
  walletAddress: string;
  hasCheckedIn: boolean;
  proofIpfsCid: string | null;
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  eventTime: Date;
  stakeAmount: number; // in XRP drops
  participants: Participant[];
  payoutRule: PayoutRule;
  proofMethod: ProofMethod;
  status: CommitmentStatus;
  ipfsCid: string | null;
  xrplTransactionHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProofPacket {
  commitmentId: string;
  participantId: string;
  timestamp: string;
  method: ProofMethod;
  note?: string;
  imageCid?: string;
}

export interface SettlementRecord {
  commitmentId: string;
  winnerId: string | null;
  amount: number;
  timestamp: string;
  txHash: string;
}
