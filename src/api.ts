export type StoreProduct = {
  id: number
  name: string
  brand: string
  category: 'Homme' | 'Femme' | 'Unisex'
  price: number
  oldPrice?: number
  image: string
  description: string
  family: string
  notes: string
  rating: number
  reviews: number
  sizes: number[]
  isNew?: boolean
  featured?: boolean
  stock: number
}


export async function fetchProducts(): Promise<StoreProduct[]> {
  const response = await fetch('/api/products')
  if (!response.ok) throw new Error('Unable to load products')
  const rows = await response.json() as Array<Record<string, unknown>>
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    brand: String(row.brand),
    category: row.category as StoreProduct['category'],
    price: Number(row.price),
    oldPrice: row.oldPrice == null ? undefined : Number(row.oldPrice),
    image: Array.isArray(row.images) && row.images[0] ? String(row.images[0]) : '/products/perfume-1.jpg',
    description: String(row.description || ''),
    family: String(row.family || ''),
    notes: String(row.fragranceNotes || ''),
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
