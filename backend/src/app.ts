import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

import { handle404Error, handleGlobalError } from "./middlewares";
import { v1Routes } from "./routes/v1";
import { corsPolicy } from "./config";

const app = express();

app.use(corsPolicy);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());

app.use("/api/v1", v1Routes);

app.use(handle404Error);
app.use(handleGlobalError);

export { app };

