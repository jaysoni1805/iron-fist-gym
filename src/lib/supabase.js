import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fxrsnjtxmspymnowetin.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cnNuanR4bXNweW1ub3dldGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTUyMjIsImV4cCI6MjA4NzQzMTIyMn0.FssilXVGXb5DMVjyKEd61WQamvdy7sYLYsZijqX8xfo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
})
