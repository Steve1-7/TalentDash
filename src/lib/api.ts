/* API client for Supabase Edge Functions

Usage: set VITE_SUPABASE_FUNCTIONS_URL and VITE_SUPABASE_ANON_KEY in your Vite env.
Example env vars are in the project root `.env.example`.
*/

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string | undefined;
const PROFILES_URL = import.meta.env.VITE_SUPABASE_PROFILES_URL as string | undefined;
const GIGS_URL = import.meta.env.VITE_SUPABASE_GIGS_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function baseFor(fnName: string) {
  // Allow per-function overrides for local testing, otherwise fall back to common base
  if (fnName.startsWith('profiles')) return PROFILES_URL ?? FUNCTIONS_URL;
  if (fnName.startsWith('gigs')) return GIGS_URL ?? FUNCTIONS_URL;
  return FUNCTIONS_URL;
}

if (!FUNCTIONS_URL && !PROFILES_URL && !GIGS_URL) {
  console.warn('VITE_SUPABASE_FUNCTIONS_URL / VITE_SUPABASE_PROFILES_URL / VITE_SUPABASE_GIGS_URL not set. Frontend calls will fail until configured.');
}

async function request<T = any>(fn: string, method = 'GET', body?: unknown) {
  const base = baseFor(fn.replace(/\?.*$/, ''));
  if (!base) throw new Error('Supabase functions URL not configured for this function');
  const url = `${base.replace(/\/$/, '')}/${fn}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ANON_KEY) headers['Authorization'] = `Bearer ${ANON_KEY}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    // fallback to raw text
    return (text as unknown) as T;
  }
}

// Profiles
export const getProfiles = () => request<any[]>('profiles', 'GET');
export const getProfile = (id: string) => request<any>(`profiles?id=${encodeURIComponent(id)}`, 'GET');
export const createProfile = (payload: { full_name: string; headline?: string; avatar_url?: string }) => request<any>('profiles', 'POST', payload);
export const updateProfile = (payload: { id: string } & Partial<{ full_name: string; headline: string; avatar_url: string }>) => request<any>('profiles', 'PUT', payload);
export const deleteProfile = (id: string) => request<any>(`profiles?id=${encodeURIComponent(id)}`, 'DELETE');

// Gigs
export const getGigs = () => request<any[]>('gigs', 'GET');
export const getGig = (id: string) => request<any>(`gigs?id=${encodeURIComponent(id)}`, 'GET');
export const createGig = (payload: { title: string; description?: string; price: number; owner_id: string }) => request<any>('gigs', 'POST', payload);
export const updateGig = (payload: { id: string } & Partial<{ title: string; description: string; price: number }>) => request<any>('gigs', 'PUT', payload);
export const deleteGig = (id: string) => request<any>(`gigs?id=${encodeURIComponent(id)}`, 'DELETE');

export default {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
};
