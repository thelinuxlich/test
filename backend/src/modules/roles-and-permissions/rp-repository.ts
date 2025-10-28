import { PoolClient } from "pg";
import { processDBRequest } from "../../utils";

const doesRoleNameExist = async (name: string): Promise<number> => {
  const query = "SELECT 1 FROM roles WHERE name ILIKE $1 LIMIT 1";
  const queryParams = [name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const doesRoleIdExist = async (id: number): Promise<number> => {
  const query = "SELECT 1 FROM roles WHERE id = $1";
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const insertRole = async (name: string): Promise<number> => {
  const query = "INSERT INTO roles(name) VALUES($1)";
  const queryParams = [name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getRoles = async (): Promise<any[]> => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      COUNT(t2.id) AS "usersAssociated",
      t1.is_active AS status
    FROM roles t1
    LEFT JOIN users t2 ON t1.id = t2.role_id
    GROUP BY (t1.id, t1.name)
    ORDER BY t1.id, t1.name, t1.is_active
  `;
  const { rows } = await processDBRequest({ query, queryParams: [] });
  return rows;
};

const getRoleById = async (id: number): Promise<any> => {
  const query = "SELECT * FROM roles WHERE id= $1";
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateRoleById = async (id: number, name: string): Promise<number> => {
  const query = "UPDATE roles SET name = $1 WHERE id = $2 AND is_editable = true";
  const queryParams = [name, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const enableOrDisableRoleStatusByRoleId = async (id: number, status: boolean): Promise<number> => {
  const query = "UPDATE roles SET is_active = $1 WHERE id = $2 AND is_editable = true";
  const queryParams = [status, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAccessControlByIds = async (ids: number[], client: PoolClient): Promise<any[]> => {
  const query = `
    SELECT id, type
    FROM access_controls
    WHERE id = ANY($1::int[])
  `;
  const { rows } = await client.query(query, [ids]);
  return rows;
};

const insertPermissionForRoleId = async (queryParams: string, client: PoolClient): Promise<void> => {
  const query = `
    INSERT INTO permissions(role_id, access_control_id, type)
    VALUES ${queryParams}
    ON CONFLICT (role_id, access_control_id) DO NOTHING
  `;
  await client.query(query);
};

const deletePermissionForRoleId = async (roleId: number, client: PoolClient): Promise<void> => {
  const query = `DELETE FROM permissions WHERE role_id = ${roleId}`;
  await client.query(query);
};

const getPermissionsById = async (roleId: number): Promise<any[]> => {
  const isUserAdmin = Number(roleId) === 1 ? true : false;
  const query = isUserAdmin
    ? `SELECT id, name FROM access_controls`
    : `
      SELECT
        ac.id,
        ac.name
      FROM permissions p
      JOIN access_controls ac ON p.access_control_id = ac.id
      WHERE p.role_id = $1
    `;
  const queryParams = isUserAdmin ? [] : [roleId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getUsersByRoleId = async (id: number): Promise<any[]> => {
  const query = `
    SELECT
      id,
      name,
      last_login AS "lastLogin"
    FROM users
    WHERE role_id = $1
  `;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const switchUserRole = async (userId: number, newRoleId: number): Promise<number> => {
  const query = `UPDATE users SET role_id = $1 WHERE id = $2`;
  const queryParams = [newRoleId, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const checkPermission = async (roleId: number, apiPath: string, apiMethod: string): Promise<number> => {
  const query = `
    SELECT 1
    FROM permissions p
    JOIN access_controls ac ON p.access_control_id = ac.id
    WHERE p.role_id = $1 AND ac.path = $2 AND ac.method = $3
  `;
  const queryParams = [roleId, apiPath, apiMethod];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export {
  insertRole,
  getRoles,
  doesRoleNameExist,
  doesRoleIdExist,
  updateRoleById,
  enableOrDisableRoleStatusByRoleId,
  getRoleById,
  getPermissionsById,
  getUsersByRoleId,
  getAccessControlByIds,
  insertPermissionForRoleId,
  switchUserRole,
  checkPermission,
  deletePermissionForRoleId
};

