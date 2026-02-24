import dotenv from 'dotenv';
dotenv.config();

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// When running against Neon Local (dev), configure the serverless driver
// to use HTTP instead of WebSockets and point to the local proxy.
if (process.env.NEON_LOCAL_HOST) {
  neonConfig.fetchEndpoint = `http://${process.env.NEON_LOCAL_HOST}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

export const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);

export default { db, sql };
