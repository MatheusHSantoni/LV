'use strict';

const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
let db = null;
const supabaseReady = supabaseConfigured ? connectSupabase() : Promise.resolve();

function connectSupabase() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  }).then(() => {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }).catch(() => {
    console.warn('Não foi possível conectar ao Supabase.');
  });
}

async function loadSiteData() {
  if (!db) return getData();
  const { data, error } = await db.from('site_content').select('content').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ? normalizeData(data.content, true) : getData();
}
