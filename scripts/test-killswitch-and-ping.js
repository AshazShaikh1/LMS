const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Client } = require('pg');

async function test() {
  console.log('Testing system_settings table and kill switch in Supabase...');

  const client = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.lagagkxsdyoyobqhbkyr',
    password: 'gahX5r8uKIIM1rP3',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL.');

    const res = await client.query("SELECT * FROM system_settings WHERE key = 'kill_switch'");
    console.log('Current kill_switch setting in DB:', res.rows[0]);

    if (res.rows.length > 0 && res.rows[0].key === 'kill_switch') {
      console.log('SUCCESS: system_settings table is active and holding kill_switch state.');
    } else {
      console.error('FAILED: kill_switch record missing.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

test();
