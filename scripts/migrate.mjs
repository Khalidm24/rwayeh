import { neon } from '@neondatabase/serverless'
import { readFile } from 'node:fs/promises'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
const sql = neon(process.env.DATABASE_URL)
const migration = await readFile(new URL('../migrations/001_initial.sql', import.meta.url), 'utf8')
for (const statement of migration.split(/;\s*(?=\n|$)/).map((item) => item.trim()).filter(Boolean)) {
  await sql(statement)
}
console.log('Database migration complete')
