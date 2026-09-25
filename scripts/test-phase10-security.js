const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.lagagkxsdyoyobqhbkyr',
  password: 'gahX5r8uKIIM1rP3',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function runSecurityTestSuite() {
  console.log('====================================================');
  console.log('PHASE 10: AUTOMATED SECURITY & RLS AUDIT TEST SUITE');
  console.log('====================================================\n');

  await client.connect();
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedTests++;
    }
  }

  try {
    // 1. Check Row-Level Security (RLS) on all core tables
    console.log('--- 1. ROW-LEVEL SECURITY (RLS) ENFORCEMENT ---');
    const coreTables = [
      'profiles',
      'courses',
      'enrollments',
      'materials',
      'announcements',
      'assignments',
      'submissions',
      'quizzes',
      'quiz_questions',
      'quiz_attempts',
    ];

    const rlsQuery = await client.query(`
      SELECT c.relname as table_name, c.relrowsecurity as rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = ANY($1)
    `, [coreTables]);

    const rlsMap = new Map(rlsQuery.rows.map(r => [r.table_name, r.rls_enabled]));

    for (const table of coreTables) {
      const isEnabled = rlsMap.get(table);
      assert(isEnabled === true, `Table 'public.${table}' must have RLS ENABLED (actual: ${isEnabled})`);
    }

    // 2. Check Policy Coverage
    console.log('\n--- 2. RLS POLICIES COVERAGE ---');
    const policiesQuery = await client.query(`
      SELECT tablename, COUNT(*)::int as policy_count, array_agg(DISTINCT cmd) as commands
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = ANY($1)
      GROUP BY tablename
    `, [coreTables]);

    const policyMap = new Map(policiesQuery.rows.map(r => [r.tablename, r]));

    for (const table of coreTables) {
      const pol = policyMap.get(table);
      const count = pol ? pol.policy_count : 0;
      const cmds = pol ? pol.commands.join(', ') : 'none';
      assert(count > 0, `Table '${table}' has active RLS policies (found: ${count} policies for [${cmds}])`);
    }

    // 3. Storage Bucket Security
    console.log('\n--- 3. STORAGE BUCKET PRIVACY & ACCESS ---');
    const bucketsQuery = await client.query(`
      SELECT id, name, public FROM storage.buckets WHERE id IN ('course-materials', 'assignment-submissions')
    `);

    const bucketMap = new Map(bucketsQuery.rows.map(b => [b.id, b]));

    const materialsBucket = bucketMap.get('course-materials');
    assert(materialsBucket !== undefined, "Storage bucket 'course-materials' exists");
    assert(materialsBucket && materialsBucket.public === false, "'course-materials' bucket is PRIVATE (non-public)");

    const submissionsBucket = bucketMap.get('assignment-submissions');
    assert(submissionsBucket !== undefined, "Storage bucket 'assignment-submissions' exists");
    assert(submissionsBucket && submissionsBucket.public === false, "'assignment-submissions' bucket is PRIVATE (non-public)");

    // 4. User Role Enum & Signup Trigger
    console.log('\n--- 4. USER ROLES & SIGNUP TRIGGER ---');
    const rolesQuery = await client.query(`
      SELECT e.enumlabel
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'user_role'
    `);
    const roles = rolesQuery.rows.map(r => r.enumlabel);
    assert(roles.includes('student'), "Role enum includes 'student'");
    assert(roles.includes('teacher'), "Role enum includes 'teacher'");
    assert(roles.includes('admin'), "Role enum includes 'admin'");

    const triggerQuery = await client.query(`
      SELECT tgname, relname FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      WHERE tgname = 'on_auth_user_created'
    `);
    assert(triggerQuery.rows.length > 0, "Trigger 'on_auth_user_created' is active for automated user onboarding");

    // 5. Referential Integrity / Cascade Constraints
    console.log('\n--- 5. CASCADE REFERENTIAL INTEGRITY ---');
    const fkeysQuery = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.referential_constraints AS rc
        ON tc.constraint_name = rc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `);

    const cascades = fkeysQuery.rows.filter(f => f.delete_rule === 'CASCADE');
    assert(cascades.length >= 7, `Found ${cascades.length} foreign keys with ON DELETE CASCADE protecting relational consistency`);

  } catch (err) {
    console.error('Test execution error:', err);
    failedTests++;
  } finally {
    await client.end();
  }

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite();
