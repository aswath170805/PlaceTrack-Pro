# PlaceTrack Pro

PlaceTrack Pro is a Next.js application for student, faculty, and admin workflows with Supabase authentication and role-based access control.

## Local development

1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env.local` and fill in the real Supabase values.
3. Run the app:
   npm run dev

## Vercel deployment

Set these environment variables in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Use the Vercel project root as the app folder and deploy with the default Next.js settings.

## Notes

- Keep `.env.local` local and never commit it.
- Use Supabase Auth + RLS for all privileged access.
- Ensure the Supabase profile table contains `role` and `is_verified` columns.
