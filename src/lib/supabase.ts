import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Let op: Supabase keys ontbreken in het .env bestand!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);