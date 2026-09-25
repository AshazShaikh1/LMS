import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const startTime = Date.now()

  try {
    const supabase = await createClient()

    // Query system_settings and profiles to generate activity
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('key, updated_at')
      .limit(1)

    const { count: userCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const latencyMs = Date.now() - startTime

    if (settingsError && countError) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase ping encountered errors',
          details: settingsError?.message || countError?.message,
          timestamp: new Date().toISOString(),
          latencyMs,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'active',
      message: 'Supabase database pinged successfully. Inactivity timer refreshed.',
      timestamp: new Date().toISOString(),
      latencyMs,
      verifiedTables: ['system_settings', 'profiles'],
      totalRegisteredProfiles: userCount ?? 0,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Keep-alive failure',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return GET()
}
