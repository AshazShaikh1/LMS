const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const fileArg = process.argv[2] || '20260925000004_create_assignments_and_submissions.sql';
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', fileArg);
  console.log('Reading migration file:', sqlPath);
  const sql = fs.readFileSync(sqlPath, 'utf8');

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
    console.log('Connected to Supabase Postgres. Applying migration...');
    await client.query(sql);
    console.log(`Migration ${fileArg} applied successfully!`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
