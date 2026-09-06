import { errorResponse, json } from '../_lib/db.js'

export default async function handler(request: Request) {
  try {
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
    const body = await request.json()
    if (!process.env.ADMIN_TOKEN || body.token !== process.env.ADMIN_TOKEN) return json({ error: 'Invalid admin credentials' }, 401)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'set-cookie': `rwayeh_admin=${process.env.ADMIN_TOKEN}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`,
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}
