Supabase Edge Functions scaffold (REST)

Overview
- Two example Edge Functions: profiles and gigs.
- Uses TypeScript, `zod` for validation and `@supabase/supabase-js` (CDN) for DB access.

Quick setup
1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Login: `supabase login`
3. From this folder deploy functions:

```bash
# deploy example functions (replace --project-ref if needed)
supabase functions deploy profiles
supabase functions deploy gigs
```

Environment
- The functions expect the following environment variables (set in Supabase project settings or using `supabase secrets set`):
  - `SUPABASE_URL` — your Supabase URL
  - `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)

Local dev
- Use `supabase start` and `supabase functions serve <name>` for local testing.

Endpoints
- `GET`/`POST`/`PUT`/`DELETE` handled on each function. Use query `?id=` to fetch single items.

Example usage (fetch single profile):

```js
fetch('https://<project>.functions.supabase.co/profiles?id=<id>')
  .then(r => r.json())
  .then(console.log)
```

Notes
- This scaffold is minimal — adapt table names and schemas to match your Supabase database.
