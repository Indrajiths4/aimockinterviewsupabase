// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./utils/schema.js",
//   dbCredentials: {
//     url: 'postgresql://postgres:#Contactus1@db.pnrksftpwmsiosbveyda.supabase.co:5432/postgres'
//   }
// });


import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './utils/schema.js',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres.pnrksftpwmsiosbveyda:XContactus123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  },
});