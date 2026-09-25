import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const OWNER_EMAIL = 'ashazshaikh111@gmail.com'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isActionRequest = request.headers.has('next-action')
  const isGet = request.method === 'GET'
  const pathname = request.nextUrl.pathname

  // Always allow internal Next.js assets and keep-alive API
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return supabaseResponse
  }

  try {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Get authenticated user safely
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()

    // 1. Check Master Kill Switch Status
    let isKillSwitchActive = false
    try {
      const { data: setting } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'kill_switch')
        .single()
      isKillSwitchActive = !!setting?.value?.active
    } catch {
      isKillSwitchActive = false
    }

    // 2. Kill Switch Lockdown Enforcement: overrules all roles (students, teachers, admins, anonymous)
    if (isKillSwitchActive) {
      // Allow access only to /system-offline and /system-control (where owner can restore the site)
      if (pathname !== '/system-offline' && pathname !== '/system-control') {
        const url = request.nextUrl.clone()
        url.pathname = '/system-offline'
        return NextResponse.redirect(url)
      }
    } else {
      // If kill switch is NOT active, visiting /system-offline redirects back to home
      if (pathname === '/system-offline') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    // 3. Standard page-level route protection for normal operation (GET navigations)
    if (isGet && !isActionRequest && !isKillSwitchActive) {
      const isDashboardRoute = pathname.startsWith('/dashboard')

      if (isDashboardRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }

      if ((pathname === '/login' || pathname === '/register') && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  } catch (err) {
    console.error('Proxy auth handling error:', err)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
