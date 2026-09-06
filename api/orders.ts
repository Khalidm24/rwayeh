import { errorResponse, json, requireAdmin, requireDatabase } from './_lib/db.js'

const statuses = ['Nouvelle', 'Confirmée', 'En préparation', 'Expédiée', 'Livrée', 'Annulée']

export default async function handler(request: Request) {
  try {
    const database = requireDatabase()
    if (request.method === 'GET') {
      requireAdmin(request)
      const rows = await database`
        SELECT id, order_number AS "orderNumber", customer_name AS "customerName",
          phone, email, city, address, notes, products, subtotal, delivery_fee AS "deliveryFee",
          total, payment_method AS "paymentMethod", status, created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM orders ORDER BY created_at DESC
      `
      return json(rows)
    }
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
    const body = await request.json()
    const items = Array.isArray(body.products) ? body.products : []
    if (!body.customerName || !body.phone || !body.city || !body.address || !items.length) {
      return json({ error: 'Missing required order fields' }, 400)
    }
    const orderNumber = `RW-${Date.now().toString().slice(-8)}`
    const deliveryFee = Number(body.deliveryFee) || 0
    const subtotal = Number(body.subtotal) || 0
    const total = Number(body.total) || subtotal + deliveryFee
    const customer = await database`
      INSERT INTO customers (name, phone, email, city, address)
      VALUES (${body.customerName}, ${body.phone}, ${body.email || null}, ${body.city}, ${body.address})
      ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email,
        city = EXCLUDED.city, address = EXCLUDED.address, updated_at = NOW()
      RETURNING id
    `
    const order = await database`
      INSERT INTO orders (order_number, customer_id, customer_name, phone, email, city, address,
        notes, products, subtotal, delivery_fee, total, payment_method, status)
      VALUES (${orderNumber}, ${customer[0].id}, ${body.customerName}, ${body.phone},
        ${body.email || null}, ${body.city}, ${body.address}, ${body.notes || null},
        ${JSON.stringify(items)}, ${subtotal}, ${deliveryFee}, ${total},
        ${body.paymentMethod || 'cash_on_delivery'}, 'Nouvelle')
      RETURNING id, order_number AS "orderNumber", total, status, created_at AS "createdAt"
    `
    await database`
      UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ${total},
        updated_at = NOW() WHERE id = ${customer[0].id}
    `
    return json(order[0], 201)
  } catch (error) {
    return errorResponse(error)
  }
}
