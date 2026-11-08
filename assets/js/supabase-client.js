'use strict';

const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
const db = supabaseConfigured && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

async function loadSiteData() {
  if (!db) return getData();
  const { data, error } = await db.from('site_content').select('content').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ? { ...getData(), ...data.content } : getData();
}
