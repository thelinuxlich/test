import { createHmac } from "crypto";
import { env } from "../config";

const generateCsrfHmacHash = (csrfToken: string): string => {
  const hash = createHmac("sha256", env.CSRF_TOKEN_SECRET || "")
    .update(csrfToken)
    .digest("hex");
  return hash;
};

const verifyCsrfToken = (csrfToken: string, hmacHash: string): boolean => {
  const hashGenerated = generateCsrfHmacHash(csrfToken);
  return hashGenerated === hmacHash;
};

export {
  generateCsrfHmacHash,
  verifyCsrfToken,
};

