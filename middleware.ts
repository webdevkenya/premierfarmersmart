import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {

  const response = NextResponse.next()
  const hasSession = request.cookies.has('sessionId') // => true
  if (!hasSession) {
    const newSessionId = uuidv4();
    response.cookies.set('sessionId', newSessionId)

  } else {
    request.cookies.get('sessionId')?.value
  }

  return response
}

export const config = {
  matcher: '/api/graphql',
}