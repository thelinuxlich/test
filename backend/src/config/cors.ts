import cors from "cors";
import { env } from "./env";

const corsPolicy = cors({
  origin: env.UI_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Accept", "Origin", "X-CSRF-TOKEN"],
  credentials: true,
});

export { corsPolicy };

