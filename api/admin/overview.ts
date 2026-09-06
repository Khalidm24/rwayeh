import { errorResponse, json, requireAdmin, requireDatabase } from '../_lib/db'

export default async function handler(request: Request) {
  try {
    requireAdmin(request)
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
    const database = requireDatabase()
    const [products, orders, customers, recentOrders] = await Promise.all([
      database`SELECT COUNT(*)::int AS count FROM products`,
      database`SELECT COUNT(*)::int AS count, COALESCE(SUM(total), 0) AS revenue FROM orders`,
      database`SELECT COUNT(*)::int AS count FROM customers`,
      database`SELECT id, order_number AS "orderNumber", customer_name AS "customerName", total, status, created_at AS "createdAt" FROM orders ORDER BY created_at DESC LIMIT 10`,
    ])
    return json({ stats: { products: products[0].count, orders: orders[0].count, customers: customers[0].count, revenue: orders[0].revenue }, recentOrders })
  } catch (error) {
    return errorResponse(error)
  }
}
