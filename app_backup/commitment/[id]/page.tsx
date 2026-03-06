import Link from 'next/link';
import { ArrowLeft, Clock, Users, Coins, CheckCircle2, XCircle, ExternalLink, QrCode } from 'lucide-react';
import { getCommitment } from '@/lib/db';

export default function CommitmentDetail({ params }: { params: { id: string } }) {
  const commitment = getCommitment(params.id);

  if (!commitment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Commitment not found</p>
          <Link href="/dashboard" className="text-purple-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    funded: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    checked_in: 'bg-blue-500/20 text-blue-400',
    settled: 'bg-purple-500/20 text-purple-400',
    expired: 'bg-red-500/20 text-red-400',
  };

  const payoutLabels: Record<string, string> = {
    refund_both: 'Refund both if both show up',
    winner_takes_all: 'Winner takes all',
    charity: 'Donates to charity',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{commitment.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[commitment.status]}`}>
                  {commitment.status}
                </span>
              </div>
              <p className="text-muted-foreground">{commitment.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <Clock className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-sm text-muted-foreground">Event Time</p>
              <p className="font-semibold">
                {new Date(commitment.eventTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <Coins className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-sm text-muted-foreground">Stake</p>
              <p className="font-semibold">{commitment.stakeAmount / 1000000} XRP</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <Users className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-sm text-muted-foreground">Participants</p>
              <p className="font-semibold">{commitment.participants.length}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Participants</h2>
            <div className="space-y-3">
              {commitment.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    {participant.hasCheckedIn ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {participant.walletAddress.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                  {participant.hasCheckedIn ? (
                    <span className="text-sm text-green-400">Checked In</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Rules</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payout Rule</span>
                <span>{payoutLabels[commitment.payoutRule]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Proof Method</span>
                <span className="flex items-center gap-2">
                  {commitment.proofMethod === 'qr' ? <QrCode className="w-4 h-4" /> : null}
                  {commitment.proofMethod === 'mutual' ? 'Mutual confirmation' : 'QR Code'}
                </span>
              </div>
            </div>
          </div>

          {/* On-Chain & IPFS */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">On-Chain & IPFS</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">XRPL Transaction</span>
                {commitment.xrplTransactionHash ? (
                  <a
                    href={`https://testnet.xrpl.org/transactions/${commitment.xrplTransactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-400 hover:underline"
                  >
                    View Transaction
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">IPFS (Pinata)</span>
                {commitment.ipfsCid ? (
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${commitment.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-400 hover:underline"
                  >
                    View Record
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Pending</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {commitment.status === 'active' && (
            <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
              Check In (Demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
