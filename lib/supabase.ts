import { createClient } from '@supabase/supabase-js';

// Atenção: Você precisará pegar essas chaves no painel do Supabase (Project Settings -> API)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);