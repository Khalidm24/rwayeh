import { requireAdmin, requireDatabase } from './_lib/db.js'

type NodeRequest = { method?: string; body?: unknown; headers: { get: (name: string) => string | null } }
type NodeResponse = { status: (statusCode: number) => NodeResponse; json: (data: unknown) => void }

export default async function handler(request: NodeRequest, response: NodeResponse) {
  try {
    const dbClient = requireDatabase()
    if (request.method === 'GET') {
      requireAdmin(request)
      const rows = await dbClient`
        SELECT id, order_number AS "orderNumber", customer_name AS "customerName", phone, email, city, address, notes, products, subtotal, delivery_fee AS "deliveryFee", total, payment_method AS "paymentMethod", status, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM orders ORDER BY created_at DESC
      `
      return response.status(200).json(rows)
    }
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
    let body: Record<string, unknown>
    if (typeof request.body === 'string') {
      if (!request.body.trim()) return response.status(400).json({ error: 'Request body is empty' })
      try { body = JSON.parse(request.body) as Record<string, unknown> } catch { return response.status(400).json({ error: 'Invalid JSON request body' }) }
    } else { body = (request.body || {}) as Record<string, unknown> }
    const items = Array.isArray(body.products) ? body.products : []
    if (!body.customerName || !body.phone || !body.city || !body.address || !items.length) return response.status(400).json({ error: 'Missing required order fields' })
    const orderNumber = 'RW-' + Date.now().toString().slice(-8)
    const deliveryFee = Number(body.deliveryFee) || 0
    const subtotal = Number(body.subtotal) || 0
    const total = Number(body.total) || subtotal + deliveryFee
    const customer = await dbClient`
      INSERT INTO customers (name, phone, email, city, address)
      VALUES (${body.customerName}, ${body.phone}, ${body.email || null}, ${body.city}, ${body.address})
      ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, city = EXCLUDED.city, address = EXCLUDED.address, updated_at = NOW()
      RETURNING id
    `
    const order = await dbClient`
      INSERT INTO orders (order_number, customer_id, customer_name, phone, email, city, address, notes, products, subtotal, delivery_fee, total, payment_method, status)
      VALUES (${orderNumber}, ${customer[0].id}, ${body.customerName}, ${body.phone}, ${body.email || null}, ${body.city}, ${body.address}, ${body.notes || null}, ${JSON.stringify(items)}, ${subtotal}, ${deliveryFee}, ${total}, ${body.paymentMethod || 'cash_on_delivery'}, 'Nouvelle')
      RETURNING id, order_number AS "orderNumber", total, status, created_at AS "createdAt"
    `
    await dbClient`
      UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ${total}, updated_at = NOW() WHERE id = ${customer[0].id}
    `
    return response.status(201).json(order[0])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return response.status(500).json({ error: message })
  }
}
