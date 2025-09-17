#!/usr/bin/env node

const defaults = {
  VITE_SUPABASE_URL: 'https://xaluaekioqwxtzhnmygg.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY',
};

const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

const report = [];
let ok = true;

for (const key of required) {
  const value = process.env[key] || defaults[key];
  if (!value) {
    ok = false;
    report.push({ level: 'error', key, message: 'Missing environment variable' });
  } else {
    const source = process.env[key] ? 'env' : 'default';
    report.push({ level: source === 'env' ? 'ok' : 'warn', key, message: `Using ${source === 'env' ? 'environment' : 'fallback default'} value` });
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || defaults.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || defaults.VITE_SUPABASE_ANON_KEY;

async function checkAuthSettings() {
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    if (!res.ok) {
      ok = false;
      report.push({ level: 'error', key: 'auth_settings', message: `HTTP ${res.status} – ${await res.text()}` });
    } else {
      const json = await res.json();
      report.push({ level: 'ok', key: 'auth_settings', message: `JWT expiry ${json.jwt?.exp || 'unknown'} seconds` });
    }
  } catch (err) {
    ok = false;
    report.push({ level: 'error', key: 'network', message: err.message });
  }
}

async function checkEdgeHealth() {
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/test-submit`, {
      method: 'OPTIONS',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    report.push({
      level: res.ok ? 'ok' : 'warn',
      key: 'edge:test-submit',
      message: res.ok ? 'Edge function reachable (OPTIONS)' : `Edge function responded ${res.status}`,
    });
  } catch (err) {
    report.push({ level: 'warn', key: 'edge:test-submit', message: `Could not reach edge function (${err.message})` });
  }
}

(async () => {
  await checkAuthSettings();
  await checkEdgeHealth();

  console.log('Phase 1 check report');
  for (const item of report) {
    const tag = item.level.toUpperCase().padEnd(5);
    console.log(`[${tag}] ${item.key}: ${item.message}`);
  }

  if (!ok) {
    console.log('\nPhase 1 NOT ready. Fix errors above.');
    process.exitCode = 1;
  } else {
    console.log('\nPhase 1 sanity checks passed.');
  }
})();
