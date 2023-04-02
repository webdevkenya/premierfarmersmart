import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid';
import { log } from 'next-axiom';

export function middleware(request: NextRequest) {

  const response = NextResponse.next()
  const hasSession = request.cookies.has('sessionId') // => true
  if (!hasSession) {
    log.info('middleware called with no session, creating cookie')
    const newSessionId = uuidv4();
    response.cookies.set('sessionId', newSessionId)

  } else {
    const sessionId = request.cookies.get('sessionId')?.value
    log.info('middleware called with sessionId', { sessionId })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}