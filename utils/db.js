
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from "./schema"

// const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
// export const db = drizzle(sql,{schema});
// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'
// // Disable prefetch as it is not supported for "Transaction" pool mode
// export const client = postgres('postgresql://postgres.pnrksftpwmsiosbveyda:XContactus123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres', { prepare: false })

// export const db = drizzle(client);
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
const connectionString = process.env.DATABASE_URL
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);