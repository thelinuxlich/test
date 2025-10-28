import { env } from "../config";
import { generateToken } from "./jwt-handle";
import { sendMail } from "./send-email";
import { pwdSetupTemplate } from "../templates";

interface EmailParams {
  userId: number;
  userEmail: string;
}

const sendPasswordSetupEmail = async ({ userId, userEmail }: EmailParams): Promise<void> => {
  const pwdToken = generateToken(
    { id: userId },
    env.PASSWORD_SETUP_TOKEN_SECRET || "",
    env.PASSWORD_SETUP_TOKEN_TIME_IN_MS || ""
  );
  const link = `${env.UI_URL}/auth/setup-password/${pwdToken}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: userEmail,
    subject: "Setup account password",
    html: pwdSetupTemplate(link),
  };
  await sendMail(mailOptions);
};

export { sendPasswordSetupEmail };

