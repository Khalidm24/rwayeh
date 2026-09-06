import { requireDatabase } from './_lib/db.js'

type NodeResponse = {
  status: (statusCode: number) => NodeResponse
  json: (data: unknown) => void
}

export default async function handler(request: { method?: string }, response: NodeResponse) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  try {
    const database = requireDatabase()
    const rows = await database`
      SELECT id, name, brand, category, description, price, old_price AS "oldPrice",
        discount, images, sizes, fragrance_notes AS "fragranceNotes", rating, reviews,
        stock, featured, is_new AS "isNew", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM products ORDER BY featured DESC, created_at DESC
    `
    return response.status(200).json(rows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return response.status(500).json({ error: message })
  }
}
