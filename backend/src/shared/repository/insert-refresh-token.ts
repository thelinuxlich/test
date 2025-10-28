import { PoolClient } from "pg";
import { env } from "../../config";

interface RefreshTokenPayload {
  userId: number;
  refreshToken: string;
}

const insertRefreshToken = async ({ userId, refreshToken }: RefreshTokenPayload, client: PoolClient): Promise<void> => {
  const expiresAt = new Date(
    Date.now() + parseInt(env.JWT_REFRESH_TOKEN_TIME_IN_MS || "0")
  );
  const query = `INSERT INTO user_refresh_tokens (token, user_id, expires_at) VALUES($1, $2, $3)`;
  const queryParams = [refreshToken, userId, expiresAt];
  await client.query(query, queryParams);
};

export { insertRefreshToken, type RefreshTokenPayload };

