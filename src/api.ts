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
    sizes: Array.isArray(row.sizes) ? row.sizes.map(Number) : [],
    isNew: Boolean(row.isNew),
    featured: Boolean(row.featured),
    stock: Number(row.stock || 0),
  }))
}

export async function createOrder(payload: {
  customerName: string
  phone: string
  email?: string
  city: string
  address: string
  notes?: string
  products: Array<{ id: number; name: string; size: number; qty: number; price: number }>
  subtotal: number
  deliveryFee: number
  total: number
}) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...payload, paymentMethod: 'cash_on_delivery' }),
  })
  const result = await response.json() as { orderNumber?: string; total?: number; error?: string }
  if (!response.ok) throw new Error(result.error || 'Unable to create order')
  return result
}

export async function adminLogin(token: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!response.ok) throw new Error('Identifiants administrateur invalides')
}

export async function fetchAdminOverview() {
  const response = await fetch('/api/admin/overview')
  const result = await response.json() as { stats?: Record<string, number>; recentOrders?: unknown[]; error?: string }
  if (!response.ok) throw new Error(result.error || 'Accès administrateur requis')
  return result
}
