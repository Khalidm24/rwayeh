import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
const sql = neon(process.env.DATABASE_URL)
const products = [
  ['Sauvage', 'Dior', 'Homme', 399, 479, '/products/perfume-1.jpg', 'Une fragrance fraîche et magnétique.', 'Boisé aromatique', 'Bergamote, poivre, ambroxan', [30, 50, 100], 4.9, 128, 18, true, false],
  ['Bleu', 'Chanel', 'Homme', 499, null, '/products/perfume-2.jpg', 'Un parfum intemporel et élégant.', 'Boisé ambré', 'Agrumes, cèdre, santal', [50, 100], 4.8, 96, 11, true, false],
  ['Khamrah', 'Lattafa', 'Unisex', 299, 349, '/products/perfume-3.jpg', 'Une gourmandise orientale chaleureuse.', 'Oriental gourmand', 'Cannelle, datte, vanille', [30, 50, 100], 4.7, 214, 24, true, true],
  ['Libre', 'Yves Saint Laurent', 'Femme', 449, 529, '/products/perfume-4.jpg', 'Floral, lumineux et audacieux.', 'Floral ambré', 'Lavande, fleur d’oranger, vanille', [30, 50, 90], 4.9, 143, 8, true, false],
  ['Good Girl', 'Carolina Herrera', 'Femme', 479, null, '/products/perfume-5.jpg', 'Une composition contrastée et addictive.', 'Floral oriental', 'Amande, jasmin, fève tonka', [30, 50, 80], 4.8, 87, 15, false, false],
  ['9PM', 'Afnan', 'Homme', 279, 329, '/products/perfume-6.jpg', 'Une signature nocturne et suave.', 'Boisé fruité', 'Pomme, cannelle, ambre', [30, 50, 100], 4.6, 177, 30, false, true],
  ['Baccarat Rouge 540', 'Maison Francis Kurkdjian', 'Unisex', 699, null, '/products/perfume-7.jpg', 'Une aura singulière et inoubliable.', 'Floral boisé', 'Safran, ambre gris, cèdre', [35, 70], 4.9, 61, 5, false, false],
  ['La Vie Est Belle', 'Lancôme', 'Femme', 429, 499, '/products/perfume-8.jpg', 'Un iris gourmand, tendre et lumineux.', 'Floral gourmand', 'Iris, praline, patchouli', [30, 50, 75], 4.8, 112, 12, false, false],
]
for (const product of products) {
  const [name, brand, category, price, oldPrice, image, description, family, notes, sizes, rating, reviews, stock, featured, isNew] = product
  await sql`
    INSERT INTO products (name, brand, category, price, old_price, images, description, fragrance_notes,
      sizes, rating, reviews, stock, featured, is_new, discount)
    VALUES (${name}, ${brand}, ${category}, ${price}, ${oldPrice}, ${[image]}, ${description}, ${notes},
      ${sizes}, ${rating}, ${reviews}, ${stock}, ${featured}, ${isNew},
      ${oldPrice ? Math.round((1 - Number(price) / Number(oldPrice)) * 100) : 0})
    ON CONFLICT DO NOTHING
  `
}
console.log('Product seed complete')
