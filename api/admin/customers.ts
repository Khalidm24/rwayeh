import { errorResponse, json, requireAdmin, requireDatabase } from '../_lib/db'

export default async function handler(request: Request) {
  try {
    requireAdmin(request)
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
    const database = requireDatabase()
    return json(await database`SELECT * FROM customers ORDER BY created_at DESC`)
  } catch (error) {
    return errorResponse(error)
  }
}
