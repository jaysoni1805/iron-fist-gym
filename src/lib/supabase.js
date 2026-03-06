import { createClient } from '@supabase/supabase-js'

// Note: anon key is safe to hardcode (it's a public/publishable key).
// Vercel env var was getting truncated, so we hardcode it as a reliable fallback.
const SUPABASE_URL = 'https://fxrsnjtxmspymnowetin.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cnNuanR4bXNweW1ub3dldGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTUyMjIsImV4cCI6MjA4NzQzMTIyMn0.FssilXVGXb5DMVjyKEd61WQamvdy7sYLYsZijqX8xfo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
})
