'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Wallet, 
  Coins, 
  Users, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { createCommitment } from '@/lib/db';
import { generateWallet } from '@/lib/xrpl/client';
import { uploadCommitment } from '@/lib/pinata/client';
import { PayoutRule, ProofMethod } from '@/lib/types';

export default function CreateCommitment() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventTime: '',
    stakeAmount: '1',
    participant1Name: '',
    participant2Name: '',
    payoutRule: 'winner_takes_all' as PayoutRule,
    proofMethod: 'mutual' as ProofMethod,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Generate demo wallets for participants
      const wallet1 = generateWallet();
      const wallet2 = generateWallet();

      // Create commitment object
      const commitment = createCommitment({
        title: formData.title,
        description: formData.description,
        eventTime: new Date(formData.eventTime),
        stakeAmount: parseFloat(formData.stakeAmount) * 1000000, // Convert XRP to drops
        participants: [
          {
            id: '1',
            name: formData.participant1Name || 'Participant 1',
            walletAddress: wallet1.address,
            hasCheckedIn: false,
            proofIpfsCid: null,
          },
          {
            id: '2',
            name: formData.participant2Name || 'Participant 2',
            walletAddress: wallet2.address,
            hasCheckedIn: false,
            proofIpfsCid: null,
          },
        ],
        payoutRule: formData.payoutRule,
        proofMethod: formData.proofMethod,
        status: 'active',
        ipfsCid: null, // Would upload to IPFS here
        xrplTransactionHash: 'demo_tx_' + Date.now(), // Would be real XRPL tx
      });

      // Upload to IPFS (mock for demo)
      const ipfsCid = await uploadCommitment(commitment);
      
      // Update with IPFS CID
      commitment.ipfsCid = ipfsCid;

      router.push(`/commitment/${commitment.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create commitment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create Commitment</h1>
          <p className="text-muted-foreground mb-8">
            Put money behind your word. Define what you're committing to.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                Commitment Details
              </h2>
              
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Gym at 6 PM"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Event Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stake */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                Stake Amount
              </h2>
              
              <div>
                <label className="text-sm font-medium mb-2 block">XRP Amount</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.stakeAmount}
                  onChange={(e) => setFormData({ ...formData, stakeAmount: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Each participant will stake this amount
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Participants
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Participant 1 Name</label>
                  <input
                    type="text"
                    value={formData.participant1Name}
                    onChange={(e) => setFormData({ ...formData, participant1Name: e.target.value })}
                    placeholder="Alice"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Participant 2 Name</label>
                  <input
                    type="text"
                    value={formData.participant2Name}
                    onChange={(e) => setFormData({ ...formData, participant2Name: e.target.value })}
                    placeholder="Bob"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-pink-400" />
                Rules
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Payout Rule</label>
                  <select
                    value={formData.payoutRule}
                    onChange={(e) => setFormData({ ...formData, payoutRule: e.target.value as PayoutRule })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option value="winner_takes_all">Winner takes all</option>
                    <option value="refund_both">Refund both if both show up</option>
                    <option value="charity">Charity if no one shows up</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Proof Method</label>
                  <select
                    value={formData.proofMethod}
                    onChange={(e) => setFormData({ ...formData, proofMethod: e.target.value as ProofMethod })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option value="mutual">Mutual confirmation</option>
                    <option value="qr">QR code check-in</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Commitment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
