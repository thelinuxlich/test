import { Resend } from "resend";
import { env } from "../config";
import { ApiError } from "./api-error";

const resend = new Resend(env.RESEND_API_KEY);

interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (mailOptions: MailOptions): Promise<void> => {
  const { error } = await resend.emails.send(mailOptions as any);
  if (error) {
    throw new ApiError(500, "Unable to send email");
  }
};

export { sendMail };

