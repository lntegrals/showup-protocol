import { Commitment, Participant } from './types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo
const commitments: Map<string, Commitment> = new Map();

// Seed with demo data
const demoCommitment: Commitment = {
  id: 'demo-1',
  title: 'Gym Session',
  description: 'Meet at the gym at 6 PM',
  eventTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  stakeAmount: 1000000, // 1 XRP in drops
  participants: [
    { id: 'p1', name: 'Alice', walletAddress: 'r...', hasCheckedIn: false, proofIpfsCid: null },
    { id: 'p2', name: 'Bob', walletAddress: 'r...', hasCheckedIn: true, proofIpfsCid: 'QmDemo123' },
  ],
  payoutRule: 'winner_takes_all',
  proofMethod: 'mutual',
  status: 'active',
  ipfsCid: 'QmDemoCommitment123',
  xrplTransactionHash: 'ABC123DEF456',
  createdAt: new Date(),
  updatedAt: new Date(),
};

commitments.set(demoCommitment.id, demoCommitment);

export function getAllCommitments(): Commitment[] {
  return Array.from(commitments.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function getCommitment(id: string): Commitment | undefined {
  return commitments.get(id);
}

export function createCommitment(
  data: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>
): Commitment {
  const now = new Date();
  const commitment: Commitment = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  commitments.set(commitment.id, commitment);
  return commitment;
}

export function updateCommitment(
  id: string,
  data: Partial<Commitment>
): Commitment | undefined {
  const commitment = commitments.get(id);
  if (!commitment) return undefined;
  
  const updated = { ...commitment, ...data, updatedAt: new Date() };
  commitments.set(id, updated);
  return updated;
}

export function deleteCommitment(id: string): boolean {
  return commitments.delete(id);
}
