import { errorResponse, json, requireAdmin, requireDatabase } from '../_lib/db.js'

export default async function handler(request: Request) {
  try {
    requireAdmin(request)
    const database = requireDatabase()
    if (request.method === 'GET') {
      return json(await database`SELECT * FROM products ORDER BY created_at DESC`)
    }
    const body = await request.json()
    if (request.method === 'POST') {
      const rows = await database`
        INSERT INTO products (name, brand, category, description, price, old_price, discount,
          images, sizes, fragrance_notes, rating, reviews, stock, featured, is_new)
        VALUES (${body.name}, ${body.brand}, ${body.category}, ${body.description || ''},
          ${body.price}, ${body.oldPrice || null}, ${body.discount || 0}, ${body.images || []},
          ${body.sizes || []}, ${body.fragranceNotes || ''}, ${body.rating || 0}, ${body.reviews || 0},
          ${body.stock || 0}, ${Boolean(body.featured)}, ${Boolean(body.isNew)})
        RETURNING *
      `
      return json(rows[0], 201)
    }
    if (request.method === 'PATCH' && body.id) {
      const rows = await database`
        UPDATE products SET name = COALESCE(${body.name}, name), brand = COALESCE(${body.brand}, brand),
          category = COALESCE(${body.category}, category), price = COALESCE(${body.price}, price),
          old_price = COALESCE(${body.oldPrice}, old_price), discount = COALESCE(${body.discount}, discount),
          stock = COALESCE(${body.stock}, stock), featured = COALESCE(${body.featured}, featured),
          is_new = COALESCE(${body.isNew}, is_new), updated_at = NOW()
        WHERE id = ${body.id} RETURNING *
      `
      return rows[0] ? json(rows[0]) : json({ error: 'Product not found' }, 404)
    }
    if (request.method === 'DELETE' && body.id) {
      await database`DELETE FROM products WHERE id = ${body.id}`
      return json({ ok: true })
    }
    return json({ error: 'Method not allowed' }, 405)
  } catch (error) {
    return errorResponse(error)
  }
}
