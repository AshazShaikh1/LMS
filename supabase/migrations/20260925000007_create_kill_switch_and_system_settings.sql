-- Migration: 20260925000007_create_kill_switch_and_system_settings.sql
-- Description: Create system_settings table for owner-only emergency kill switch and app configurations

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone so middleware / pages can check status
DROP POLICY IF EXISTS "Allow public read access to system_settings" ON system_settings;
CREATE POLICY "Allow public read access to system_settings"
  ON system_settings FOR SELECT
  USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access on system_settings" ON system_settings;
CREATE POLICY "Allow service role full access on system_settings"
  ON system_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated user to update only if email is ashazshaikh111@gmail.com
DROP POLICY IF EXISTS "Allow ashazshaikh111 to update system_settings" ON system_settings;
CREATE POLICY "Allow ashazshaikh111 to update system_settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'ashazshaikh111@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'ashazshaikh111@gmail.com'
  );

-- Initialize default kill_switch record
INSERT INTO system_settings (key, value, updated_by)
VALUES (
  'kill_switch',
  '{"active": false, "message": "Site is currently undergoing scheduled maintenance. Please check back later."}'::jsonb,
  'system'
)
ON CONFLICT (key) DO NOTHING;
