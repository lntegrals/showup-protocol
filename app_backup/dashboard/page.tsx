import Link from 'next/link';
import { Plus, ArrowRight, Clock, Users, Coins } from 'lucide-react';
import { getAllCommitments } from '@/lib/db';

export default function Dashboard() {
  const commitments = getAllCommitments();

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    funded: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    settled: 'bg-purple-500/20 text-purple-400',
    expired: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">ShowUp Protocol</span>
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
          >
            <Plus className="w-4 h-4" />
            New
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Commitments</h1>

        {commitments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">No commitments yet</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
            >
              Create Your First Commitment
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {commitments.map((commitment) => (
              <Link
                key={commitment.id}
                href={`/commitment/${commitment.id}`}
                className="block p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{commitment.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[commitment.status]}`}>
                        {commitment.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      {commitment.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(commitment.eventTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {commitment.participants.length} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {commitment.stakeAmount / 1000000} XRP
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
