import { errorResponse, json, requireAdmin, requireDatabase } from '../_lib/db.js'

const statuses = ['Nouvelle', 'Confirmée', 'En préparation', 'Expédiée', 'Livrée', 'Annulée']

export default async function handler(request: Request) {
  try {
    requireAdmin(request)
    if (request.method !== 'PATCH') return json({ error: 'Method not allowed' }, 405)
    const body = await request.json()
    if (!body.id || !statuses.includes(body.status)) return json({ error: 'Invalid status' }, 400)
    const database = requireDatabase()
    const rows = await database`
      UPDATE orders SET status = ${body.status}, updated_at = NOW()
      WHERE id = ${body.id}
      RETURNING id, order_number AS "orderNumber", status, updated_at AS "updatedAt"
    `
    return rows[0] ? json(rows[0]) : json({ error: 'Order not found' }, 404)
  } catch (error) {
    return errorResponse(error)
  }
}
