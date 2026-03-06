'use client';

import { useState, FormEvent } from 'react';

// Simple commitment creation
export default function Home() {
  const [view, setView] = useState('landing');
  const [commitments, setCommitments] = useState([
    {
      id: '1',
      title: 'Gym Session',
      description: 'Meet at gym 6PM',
      stake: '1 XRP',
      status: 'active',
      participants: ['Alice', 'Bob'],
      time: 'Tomorrow 6PM'
    }
  ]);

  const createCommitment = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newCommitment = {
      id: Date.now().toString(),
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
      stake: (form.elements.namedItem('stake') as HTMLInputElement).value + ' XRP',
      status: 'active',
      participants: [
        (form.elements.namedItem('p1') as HTMLInputElement).value,
        (form.elements.namedItem('p2') as HTMLInputElement).value
      ],
      time: (form.elements.namedItem('time') as HTMLInputElement).value
    };
    setCommitments([newCommitment, ...commitments]);
    setView('dashboard');
  };

  if (view === 'create') {
    return (
      <div>
        <nav className="nav">
          <div className="container">
            <a href="#" onClick={() => setView('landing')} style={{color: '#8b5cf6', textDecoration: 'none'}}>← Back</a>
          </div>
        </nav>
        <div className="container" style={{padding: '3rem 1rem'}}>
          <h1 style={{marginBottom: '2rem'}}>Create Commitment</h1>
          <form onSubmit={createCommitment} className="card" style={{maxWidth: '600px'}}>
            <div style={{marginBottom: '1rem'}}>
              <label>Title *</label>
              <input name="title" required placeholder="e.g., Gym at 6PM" />
            </div>
            <div style={{marginBottom: '1rem'}}>
              <label>Description</label>
              <textarea name="description" rows={3} placeholder="Details..." />
            </div>
            <div className="grid grid-2" style={{marginBottom: '1rem'}}>
              <div>
                <label>Stake (XRP)</label>
                <input name="stake" type="number" step="0.1" defaultValue="1" />
              </div>
              <div>
                <label>Event Time</label>
                <input name="time" type="datetime-local" />
              </div>
            </div>
            <div className="grid grid-2" style={{marginBottom: '1rem'}}>
              <div>
                <label>Participant 1</label>
                <input name="p1" placeholder="Alice" />
              </div>
              <div>
                <label>Participant 2</label>
                <input name="p2" placeholder="Bob" />
              </div>
            </div>
            <div style={{marginBottom: '1rem'}}>
              <label>Payout Rule</label>
              <select name="rule">
                <option value="winner">Winner takes all</option>
                <option value="refund">Refund both if both show up</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
              Create Commitment
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div>
        <nav className="nav">
          <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
              <span className="gradient-text" style={{fontWeight: 'bold', fontSize: '1.25rem'}}>ShowUp</span>
              <button onClick={() => setView('create')} className="btn btn-primary">+ New</button>
            </div>
          </div>
        </nav>
        <div className="container" style={{padding: '3rem 1rem'}}>
          <h2 style={{marginBottom: '2rem'}}>Your Commitments</h2>
          <div style={{display: 'grid', gap: '1rem'}}>
            {commitments.map(c => (
              <div key={c.id} className="card" onClick={() => setView('detail')} style={{cursor: 'pointer'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <h3>{c.title}</h3>
                    <p style={{color: '#888', fontSize: '0.9rem', marginTop: '0.5rem'}}>{c.description}</p>
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: '#666'}}>
                      <span>👥 {c.participants.join(', ')}</span>
                      <span>💰 {c.stake}</span>
                      <span>🕐 {c.time}</span>
                    </div>
                  </div>
                  <span style={{background: 'rgba(34,197,94,0.2)', color: '#4ade80', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem'}}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div>
      <nav className="nav">
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <span className="gradient-text" style={{fontWeight: 'bold', fontSize: '1.25rem'}}>ShowUp Protocol</span>
            <button onClick={() => setView('dashboard')} className="btn btn-secondary">Dashboard</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h1>
            Put money behind <br /><span className="gradient-text">your word</span>
          </h1>
          <p>
            A decentralized commitment app. Stake value on your promises. 
            When you commit, you deliver. Built on XRPL + IPFS.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button onClick={() => setView('create')} className="btn btn-primary">
              Create Commitment
            </button>
            <button onClick={() => setView('dashboard')} className="btn btn-secondary">
              View Demo
            </button>
          </div>
        </div>
      </section>

      <section style={{padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '3rem'}}>How It Works</h2>
          <div className="grid grid-3">
            <div className="card" style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>📝</div>
              <h3>Create</h3>
              <p style={{color: '#888', marginTop: '0.5rem'}}>Define your commitment and stake amount</p>
            </div>
            <div className="card" style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🔒</div>
              <h3>Stake</h3>
              <p style={{color: '#888', marginTop: '0.5rem'}}>Funds locked on XRPL until event</p>
            </div>
            <div className="card" style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🏆</div>
              <h3>Settle</h3>
              <p style={{color: '#888', marginTop: '0.5rem'}}>Prove you showed up, get paid</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{padding: '2rem 0', textAlign: 'center', color: '#666', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        <div className="container">
          <p>Built on XRPL + IPFS • Midwest Block-a-Thon 2026</p>
        </div>
      </footer>
    </div>
  );
}
