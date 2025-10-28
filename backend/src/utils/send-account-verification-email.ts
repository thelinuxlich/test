import { env } from "../config";
import { generateToken } from "./jwt-handle";
import { sendMail } from "./send-email";
import { emailVerificationTemplate } from "../templates";

interface EmailParams {
  userId: number;
  userEmail: string;
}

const sendAccountVerificationEmail = async ({ userId, userEmail }: EmailParams): Promise<void> => {
  const pwdToken = generateToken(
    { id: userId },
    env.EMAIL_VERIFICATION_TOKEN_SECRET || "",
    env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS || ""
  );
  const link = `${env.API_URL}/api/v1/auth/verify-email/${pwdToken}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: userEmail,
    subject: "Verify account",
    html: emailVerificationTemplate(link),
  };
  await sendMail(mailOptions);
};

export { sendAccountVerificationEmail };

