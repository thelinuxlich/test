import { ERROR_MESSAGES } from "./error-messages";

const API_HOST = 'serve-cookie.vercel.app';
const API_SUB_URL = 'ipcheck-encrypted';
const SAMPLE_API_KEY = '757532143557';
const API_HEADERS = {
  "x-secret-header": "secret",
};
const API_URL = `https://${API_HOST}/api/${API_SUB_URL}/${SAMPLE_API_KEY}`;

export {
  ERROR_MESSAGES,
  SAMPLE_API_KEY,
  API_SUB_URL,
  API_HOST,
  API_HEADERS,
  API_URL,
};

