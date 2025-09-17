#!/usr/bin/env node

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xaluaekioqwxtzhnmygg.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const tables = [
  'user_configs',
  'user_assets',
  'module_submissions',
  'upload_status',
  'upload_logs',
  'form_submissions'
];

async function checkTable(name) {
  const url = `${SUPABASE_URL}/rest/v1/${name}?select=id&limit=1`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { name, ok: false, message: `HTTP ${res.status} ${text}` };
    }
    const body = await res.text();
    return { name, ok: true, message: `accessible (${body ? 'has rows' : 'empty'})` };
  } catch (err) {
    return { name, ok: false, message: err.message };
  }
}

async function checkFunction() {
  const url = `${SUPABASE_URL}/rest/v1/rpc/get_failed_uploads`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_retries: 3 }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, message: `HTTP ${res.status} ${text}` };
    }
    const json = await res.json();
    return { ok: true, message: `returned ${json.length} entries` };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

(async () => {
  console.log('Phase 2 schema check');
  const results = await Promise.all(tables.map(checkTable));
  let ok = true;
  for (const r of results) {
    const tag = r.ok ? 'OK   ' : 'ERROR';
    console.log(`[${tag}] ${r.name}: ${r.message}`);
    if (!r.ok) ok = false;
  }
  const fn = await checkFunction();
  console.log(`[${fn.ok ? 'OK   ' : 'WARN '}] rpc:get_failed_uploads: ${fn.message}`);
  if (!fn.ok) ok = false;

  if (!ok) {
    console.log('\nPhase 2 NOT ready. Review errors above.');
    process.exitCode = 1;
  } else {
    console.log('\nPhase 2 schema checks passed.');
  }
})();
