const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.lagagkxsdyoyobqhbkyr',
  password: 'gahX5r8uKIIM1rP3',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function verify() {
  await client.connect();
  console.log('Connected to pooler.');

  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('assignments', 'submissions') ORDER BY table_name;"
  );
  console.log('Public tables:', tables.rows);

  const buckets = await client.query(
    "SELECT id, name, public FROM storage.buckets WHERE id = 'assignment-submissions';"
  );
  console.log('Storage buckets:', buckets.rows);

  const rls = await client.query(
    "SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('assignments', 'submissions') ORDER BY tablename, cmd;"
  );
  console.log('RLS policies count:', rls.rows.length);
  for (const pol of rls.rows) {
    console.log(` - [${pol.tablename}] (${pol.cmd}) ${pol.policyname}`);
  }

  await client.end();
}

verify().catch((e) => {
  console.error(e);
  process.exit(1);
});
