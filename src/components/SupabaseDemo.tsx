import React, { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { Button } from '@/components/ui/button';

export default function SupabaseDemo(): JSX.Element {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [p, g] = await Promise.all([api.getProfiles(), api.getGigs()]);
      setProfiles(Array.isArray(p) ? p : []);
      setGigs(Array.isArray(g) ? g : []);
    } catch (err) {
      console.error('load error', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    await api.createProfile({ full_name: name });
    setName('');
    await load();
  }

  async function addGig(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    // use first profile as owner if exists
    const owner = profiles[0]?.id ?? 'unknown';
    await api.createGig({ title, price: 0, owner_id: owner });
    setTitle('');
    await load();
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Supabase Functions Demo</h2>
      <div className="mt-3">
        <form onSubmit={addProfile} className="mb-2 flex flex-col sm:flex-row gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="input flex-1" />
          <Button type="submit" className="w-full sm:w-auto">Add profile</Button>
        </form>

        <form onSubmit={addGig} className="mb-4 flex flex-col sm:flex-row gap-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Gig title" className="input flex-1" />
          <Button type="submit" className="w-full sm:w-auto">Add gig</Button>
        </form>

        <div>
          <h3 className="font-medium">Profiles</h3>
          {loading ? <div>Loading…</div> : (
            <ul>
              {profiles.map(p => <li key={p.id}>{p.full_name} {p.headline ? `- ${p.headline}` : ''}</li>)}
            </ul>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-medium">Gigs</h3>
          {loading ? <div>Loading…</div> : (
            <ul>
              {gigs.map(g => <li key={g.id}>{g.title} — ${g.price}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
