import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {

  const response = NextResponse.next()
  const hasSession = request.cookies.has('sessionId') // => true
  if (!hasSession) {
    console.log('no session');
    const newSessionId = uuidv4();
    response.cookies.set('sessionId', newSessionId)

  } else {
    const sessionId = request.cookies.get('sessionId')?.value
    console.log('has session', sessionId)
  }

  return response
}
