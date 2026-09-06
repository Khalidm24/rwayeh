import { errorResponse, json, requireAdmin, requireDatabase } from './_lib/db'

export default async function handler(request: Request) {
  try {
    const database = requireDatabase()
    if (request.method === 'GET') {
      const rows = await database`SELECT key, value FROM settings ORDER BY key`
      return json(Object.fromEntries(rows.map((row) => [row.key, row.value])))
    }
    if (request.method !== 'PATCH') return json({ error: 'Method not allowed' }, 405)
    requireAdmin(request)
    const body = await request.json()
    if (!body.key || body.value === undefined) return json({ error: 'Invalid setting' }, 400)
    const rows = await database`
      INSERT INTO settings (key, value, updated_at) VALUES (${body.key}, ${JSON.stringify(body.value)}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING key, value
    `
    return json(rows[0])
  } catch (error) {
    return errorResponse(error)
  }
}
