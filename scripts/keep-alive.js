const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const https = require('https');

const SUPABASE_URL = 'https://lagagkxsdyoyobqhbkyr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZ2Fna3hzZHlveW9icWhia3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjQ0NjQsImV4cCI6MjEwNTkwMDQ2NH0.9KAqy29V_NaxXusBGmZP5gu1Spn_-RzmjV0gscXDIgw';

async function pingSupabase() {
  console.log('[Keep-Alive] Pinging Supabase REST API at', SUPABASE_URL);

  const url = `${SUPABASE_URL}/rest/v1/system_settings?select=key,updated_at&limit=1`;
  const options = {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  const startTime = Date.now();

  const req = https.request(url, options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      const latency = Date.now() - startTime;
      console.log(`[Keep-Alive] HTTP Status: ${res.statusCode} (${res.statusMessage}) - Latency: ${latency}ms`);
      console.log(`[Keep-Alive] Payload received:`, body);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('[Keep-Alive] SUCCESS: Database activity registered. Inactivity pause prevented!');
      } else {
        console.error('[Keep-Alive] FAILED: Unexpected response status');
      }
    });
  });

  req.on('error', (err) => {
    console.error('[Keep-Alive] Network error:', err.message);
  });

  req.end();
}

pingSupabase();
