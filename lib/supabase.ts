import { createClient } from '@supabase/supabase-js';

// Se você gerou os tipos no passo 3.1, descomente a linha abaixo:
// import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Erro: Variáveis de ambiente do Supabase não encontradas.');
}

// Se tiver os tipos, use: createClient<Database>(...)
export const supabase = createClient(supabaseUrl, supabaseKey);