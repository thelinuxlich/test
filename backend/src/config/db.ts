import { Pool } from "pg";
import { env } from "./env";

const db = new Pool({
  connectionString: env.DATABASE_URL,
});

export { db };

