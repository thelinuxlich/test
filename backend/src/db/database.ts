import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely';
import { Pool } from 'pg';
import { env } from '../config/env';
import type { DB } from '../types/database';

/**
 * Singleton instance of the pool
 */
let poolInstance: Pool | null = null;

/**
 * Create a Kysely database instance
 * This instance provides type-safe database queries
 */
const createDatabase = (): Kysely<DB> => {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: poolInstance,
    }),
    plugins: [new CamelCasePlugin()],
  });

  return db;
};

/**
 * Singleton instance of the Kysely database
 */
let dbInstance: Kysely<DB> | null = null;

/**
 * Get the Kysely database instance
 * @returns {Kysely<DB>} The Kysely database instance
 */
const getDatabase = (): Kysely<DB> => {
  if (!dbInstance) {
    dbInstance = createDatabase();
  }
  return dbInstance;
};

/**
 * Get the pool instance for raw queries
 * @returns {Pool} The PostgreSQL pool instance
 */
const getPool = (): Pool => {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }
  return poolInstance;
};

/**
 * Destroy the database connection
 * Useful for testing and graceful shutdown
 */
const destroyDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.destroy();
    dbInstance = null;
    poolInstance = null; // destroy() already ends the pool
  }
};

export {
  createDatabase,
  getDatabase,
  getPool,
  destroyDatabase,
  type Kysely,
};

