import { errorResponse, json, requireDatabase } from './_lib/db'

export default async function handler(request: Request) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
  try {
    const database = requireDatabase()
    const rows = await database`
      SELECT id, name, brand, category, description, price, old_price AS "oldPrice",
        discount, images, sizes, fragrance_notes AS "fragranceNotes", rating, reviews,
        stock, featured, is_new AS "isNew", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM products ORDER BY featured DESC, created_at DESC
    `
    return json(rows)
  } catch (error) {
    return errorResponse(error)
  }
}
