import { getDatabase } from './database';
import type { Kysely } from 'kysely';
import type { DB } from '../types/database';

/**
 * Get the Kysely query builder instance
 * @returns {Kysely<DB>} The Kysely database instance
 */
const getQueryBuilder = (): Kysely<DB> => {
  return getDatabase();
};

/**
 * Execute a SELECT query and return all rows
 * @param {string} table - Table name
 * @param {object} where - WHERE clause conditions
 * @returns {Promise<Array>} Array of rows
 */
const selectAll = async (table: string, where: Record<string, any> = {}): Promise<any[]> => {
  const db = getQueryBuilder();
  let query = (db as any).selectFrom(table).selectAll();
  
  if (Object.keys(where).length > 0) {
    query = query.where((eb: any) => {
      let conditions = [];
      for (const [key, value] of Object.entries(where)) {
        conditions.push(eb(key, '=', value));
      }
      return conditions.length === 1 ? conditions[0] : eb.and(conditions);
    });
  }
  
  return await query.execute();
};

/**
 * Execute a SELECT query and return a single row
 * @param {string} table - Table name
 * @param {object} where - WHERE clause conditions
 * @returns {Promise<object|null>} Single row or null
 */
const selectOne = async (table: string, where?: Record<string, any>): Promise<any | null> => {
  const db = getQueryBuilder();
  let query = (db as any).selectFrom(table).selectAll();
  
  if (where && Object.keys(where).length > 0) {
    query = query.where((eb: any) => {
      let conditions = [];
      for (const [key, value] of Object.entries(where)) {
        conditions.push(eb(key, '=', value));
      }
      return conditions.length === 1 ? conditions[0] : eb.and(conditions);
    });
  }
  
  return await query.executeTakeFirst();
};

/**
 * Execute an INSERT query
 * @param {string} table - Table name
 * @param {object} data - Data to insert
 * @returns {Promise<object>} Inserted row
 */
const insert = async (table: string, data: Record<string, any>): Promise<any> => {
  const db = getQueryBuilder();
  return await (db as any)
    .insertInto(table)
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();
};

/**
 * Execute an UPDATE query
 * @param {string} table - Table name
 * @param {object} where - WHERE clause conditions
 * @param {object} data - Data to update
 * @returns {Promise<object>} Updated row
 */
const update = async (table: string, where: Record<string, any>, data: Record<string, any>): Promise<any> => {
  const db = getQueryBuilder();
  let query = (db as any).updateTable(table).set(data);
  
  if (where && Object.keys(where).length > 0) {
    query = query.where((eb: any) => {
      let conditions = [];
      for (const [key, value] of Object.entries(where)) {
        conditions.push(eb(key, '=', value));
      }
      return conditions.length === 1 ? conditions[0] : eb.and(conditions);
    });
  }
  
  return await query.returningAll().executeTakeFirst();
};

/**
 * Execute a DELETE query
 * @param {string} table - Table name
 * @param {object} where - WHERE clause conditions
 * @returns {Promise<number>} Number of deleted rows
 */
const deleteRows = async (table: string, where: Record<string, any>): Promise<number> => {
  const db = getQueryBuilder();
  let query = (db as any).deleteFrom(table);
  
  if (where && Object.keys(where).length > 0) {
    query = query.where((eb: any) => {
      let conditions = [];
      for (const [key, value] of Object.entries(where)) {
        conditions.push(eb(key, '=', value));
      }
      return conditions.length === 1 ? conditions[0] : eb.and(conditions);
    });
  }
  
  const result = await query.executeTakeFirst();
  return (result as any)?.numDeletedRows || 0;
};

/**
 * Execute a raw SQL query
 * @param {string} sql - Raw SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
const rawQuery = async (sql: string, params: any[] = []): Promise<any[]> => {
  const db = getQueryBuilder();
  return await (db as any).executeQuery((db as any).raw(sql, params));
};

export {
  getQueryBuilder,
  selectAll,
  selectOne,
  insert,
  update,
  deleteRows,
  rawQuery,
};

