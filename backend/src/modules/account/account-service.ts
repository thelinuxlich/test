import { v4 as uuidV4 } from "uuid";
import { env, db } from "../../config";
import {
  ApiError,
  generateHashedPassword,
  generateToken,
  generateCsrfHmacHash,
  verifyPassword,
} from "../../utils";
import {
  changePassword,
  getUserRoleNameByUserId,
  getStudentAccountDetail,
  getStaffAccountDetail,
} from "./account-repository";
import { insertRefreshToken, findUserById } from "../../shared/repository";

interface PasswordChangePayload {
  userId: number;
  oldPassword: string;
  newPassword: string;
}

interface PasswordChangeResponse {
  refreshToken: string;
  accessToken: string;
  csrfToken: string;
  message: string;
}

const processPasswordChange = async (payload: PasswordChangePayload): Promise<PasswordChangeResponse> => {
  const client = await db.connect();
  try {
    const { userId, oldPassword, newPassword } = payload;
    await client.query("BEGIN");

    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const { password: passwordFromDB } = user;
    await verifyPassword(passwordFromDB, oldPassword);

    const roleName = await getUserRoleNameByUserId(userId, client);
    if (!roleName) {
      throw new ApiError(404, "Role does not exist for user");
    }

    const hashedPassword = await generateHashedPassword(newPassword);
    await changePassword({ userId, hashedPassword }, client);

    const csrfToken = uuidV4();
    const csrfHmacHash = generateCsrfHmacHash(csrfToken);
    const accessToken = generateToken(
      { id: userId, role: roleName, csrf_hmac: csrfHmacHash },
      env.JWT_ACCESS_TOKEN_SECRET as string,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS as string
    );
    const refreshToken = generateToken(
      { id: userId },
      env.JWT_REFRESH_TOKEN_SECRET as string,
      env.JWT_REFRESH_TOKEN_TIME_IN_MS as string
    );

    await insertRefreshToken({ userId, refreshToken }, client);

    await client.query("COMMIT");

    return {
      refreshToken,
      accessToken,
      csrfToken,
      message: "Password changed successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const processGetAccountDetail = async (userId: number): Promise<any> => {
  const user = await findUserById(userId);
  if (!user || !user.id) {
    throw new ApiError(404, "User does not exist");
  }

  const { role_id } = user;
  if (role_id === 3) {
    const studentAccountDetail = await getStudentAccountDetail(userId);
    if (!studentAccountDetail) {
      throw new ApiError(404, "Account detail not found");
    }

    return studentAccountDetail;
  }

  const staffAccountDetail = await getStaffAccountDetail(userId, role_id);
  if (!staffAccountDetail) {
    throw new ApiError(404, "Account detail not found");
  }
  return staffAccountDetail;
};

export {
  processPasswordChange,
  processGetAccountDetail,
};

