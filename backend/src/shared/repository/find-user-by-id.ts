import { processDBRequest } from "../../utils";

interface User {
  id: number;
  email: string;
  role_id: number;
  password: string;
  is_active: boolean;
  is_email_verified: boolean;
}

const findUserById = async (id: number): Promise<User | undefined> => {
  const query = `
    SELECT
      id,
      email,
      role_id,
      password,
      is_active,
      is_email_verified
    FROM users where id = $1
  `;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export { findUserById, type User };

