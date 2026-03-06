import { Commitment, ProofPacket, SettlementRecord } from '@/lib/types';

// Pinata API (uses environment variables)
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

const BASE_URL = 'https://api.pinata.cloud';

// Upload JSON to IPFS via Pinata
export async function uploadToIPFS(data: object): Promise<string> {
  if (!PINATA_JWT) {
    console.warn('Pinata JWT not configured, using mock CID');
    return 'mock_cid_' + Date.now();
  }

  const formData = new FormData();
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('file', blob, 'data.json');

  const response = await fetch(`${BASE_URL}/pinning/pinFileToIPFS`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.IpfsHash;
}

// Upload commitment metadata
export async function uploadCommitment(commitment: Commitment): Promise<string> {
  return uploadToIPFS({
    type: 'commitment',
    data: commitment,
    timestamp: new Date().toISOString(),
  });
}

// Upload proof packet
export async function uploadProof(proof: ProofPacket): Promise<string> {
  return uploadToIPFS({
    type: 'proof',
    data: proof,
    timestamp: new Date().toISOString(),
  });
}

// Upload settlement record
export async function uploadSettlement(settlement: SettlementRecord): Promise<string> {
  return uploadToIPFS({
    type: 'settlement',
    data: settlement,
    timestamp: new Date().toISOString(),
  });
}

// Get content from IPFS (via Pinata gateway)
export async function fetchFromIPFS(cid: string): Promise<any> {
  // Use Pinata gateway
  const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
  }
  return response.json();
}
