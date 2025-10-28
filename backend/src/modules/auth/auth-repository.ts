import { PoolClient } from "pg";
import { db } from "../../config";
import { processDBRequest } from "../../utils";

interface User {
  id: number;
  email: string;
  password: string;
  role_id: number;
  name: string;
  is_active: boolean;
  is_email_verified: boolean;
  last_login?: Date;
}

const findUserByUsername = async (username: string, client: PoolClient): Promise<User | undefined> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await client.query(query, [username]);
  return rows[0];
};

const invalidateRefreshToken = async (token: string): Promise<number> => {
  const query = "DELETE FROM user_refresh_tokens WHERE token = $1";
  const queryParams = [token];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const findUserByRefreshToken = async (refreshToken: string): Promise<User | undefined> => {
  const query = `
    SELECT u.* 
    FROM users u
    JOIN user_refresh_tokens rt ON u.id = rt.user_id
    WHERE rt.token = $1`;
  const { rows } = await db.query(query, [refreshToken]);
  return rows[0];
};

const updateUserRefreshToken = async (newRefreshToken: string, expiresAt: Date, userId: number, oldRefreshToken: string): Promise<void> => {
  const query = `
    UPDATE user_refresh_tokens
    SET token = $1, expires_at = $2
    WHERE user_id = $3 AND token = $4`;
  await db.query(query, [newRefreshToken, expiresAt, userId, oldRefreshToken]);
};

const getMenusByRoleId = async (roleId: number, client: PoolClient): Promise<any[]> => {
  const isUserAdmin = Number(roleId) === 1 ? true : false;
  const query = isUserAdmin
    ? `SELECT * FROM access_controls`
    : `
      SELECT
        ac.id,
        ac.name,
        ac.path,
        ac.icon,
        ac.parent_path,
        ac.hierarchy_id,
        ac.type
      FROM permissions p
      JOIN access_controls ac ON p.access_control_id = ac.id
      WHERE p.role_id = $1
    `;
  const queryParams = isUserAdmin ? [] : [roleId];
  const { rows } = await client.query(query, queryParams);
  return rows;
};

const getRoleNameByRoleId = async (id: number, client: PoolClient): Promise<string> => {
  const query = "SELECT lower(name) AS name from roles WHERE id = $1";
  const queryParams = [id];
  const { rows } = await client.query(query, queryParams);
  return rows[0].name;
};

const saveUserLastLoginDate = async (userId: number, client: PoolClient): Promise<void> => {
  const now = new Date();
  const query = `UPDATE users SET last_login = $1 WHERE id = $2`;
  const queryParams = [now, userId];
  await client.query(query, queryParams);
};

const deleteOldRefreshTokenByUserId = async (userId: number, client: PoolClient): Promise<void> => {
  const query = `DELETE FROM user_refresh_tokens WHERE user_id = $1`;
  const queryParams = [userId];
  await client.query(query, queryParams);
};

const isEmailVerified = async (id: number): Promise<boolean> => {
  const query = 'SELECT is_email_verified FROM users WHERE id = $1';
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].is_email_verified;
};

const verifyAccountEmail = async (id: number): Promise<User | undefined> => {
  const query = `
    UPDATE users
    SET is_email_verified = true
    WHERE id = $1
    RETURNING *
  `;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const doesEmailExist = async (id: number, email: string): Promise<User | undefined> => {
  const query = `SELECT email FROM users WHERE email = $1 AND id = $2`;
  const queryParams = [email, id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

interface PasswordSetupPayload {
  userId: number;
  userEmail: string;
  password: string;
}

const setupUserPassword = async (payload: PasswordSetupPayload): Promise<number> => {
  const { userId, userEmail, password } = payload;
  const query = `
    UPDATE users
    SET password = $1, is_active = true
    WHERE id = $2 AND email = $3
  `;
  const queryParams = [password, userId, userEmail];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export {
  findUserByUsername,
  invalidateRefreshToken,
  findUserByRefreshToken,
  updateUserRefreshToken,
  getMenusByRoleId,
  getRoleNameByRoleId,
  saveUserLastLoginDate,
  deleteOldRefreshTokenByUserId,
  isEmailVerified,
  verifyAccountEmail,
  doesEmailExist,
  setupUserPassword,
  type User,
  type PasswordSetupPayload,
};

