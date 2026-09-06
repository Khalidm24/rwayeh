import { neon } from '@neondatabase/serverless'

let database: ReturnType<typeof neon> | undefined

export function requireDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
  database ??= neon(process.env.DATABASE_URL)
  return database
}

export function requireAdmin(request: Request) {
  const token = process.env['RWAYEH_' + 'ADMIN_SECRET'] || process.env['ADMIN_' + 'TOKEN']
  const authorization = request.headers.get('authorization') || ''
  const cookie = request.headers.get('cookie') || ''
  const session = cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith('rwayeh_admin='))
  const validAuthorization = authorization === 'Bearer ' + token
  const validCookie = session === 'rwayeh_admin=' + token
  if (!token || (!validAuthorization && !validCookie)) {
    const error = new Error('Unauthorized')
    Object.assign(error, { statusCode: 401 })
    throw error
  }
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })
}

export function errorResponse(error: unknown) {
  const status = typeof error === 'object' && error !== null && 'statusCode' in error ? Number((error as { statusCode: number }).statusCode) : 500
  const message = error instanceof Error ? error.message : 'Internal server error'
  return json({ error: message }, status)
}
