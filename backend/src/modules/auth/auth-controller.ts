import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  login,
  logout,
  getNewAccessAndCsrfToken,
  processAccountEmailVerify,
  processPasswordSetup,
  processResendEmailVerification,
  processResendPwdSetupLink,
  processPwdReset,
} from "./auth-service";
import {
  setAccessTokenCookie,
  setCsrfTokenCookie,
  setAllCookies,
  clearAllCookies,
} from "../../cookie";

const handleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { accessToken, refreshToken, csrfToken, accountBasic } = await login(username, password);

  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken, csrfToken);

  res.json(accountBasic);
});

const handleLogout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const message = await logout(refreshToken);
  clearAllCookies(res);

  res.status(204).json(message);
});

const handleTokenRefresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const { accessToken, csrfToken, message } = await getNewAccessAndCsrfToken(refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  setAccessTokenCookie(res, accessToken);
  setCsrfTokenCookie(res, csrfToken);

  res.json(message);
});

const handleAccountEmailVerify = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;
  const message = await processAccountEmailVerify(id);
  res.json(message);
});

const handleAccountPasswordSetup = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { username: userEmail, password } = req.body;
  const message = await processPasswordSetup({ userId, userEmail, password });
  res.json(message);
});

const handleResendEmailVerification = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const message = await processResendEmailVerification(userId);
  res.json(message);
});

const handleResendPwdSetupLink = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const message = await processResendPwdSetupLink(userId);
  res.json(message);
});

const handlePwdReset = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const message = await processPwdReset(userId);
  res.json(message);
});

export {
  handleLogin,
  handleLogout,
  handleTokenRefresh,
  handleAccountEmailVerify,
  handleAccountPasswordSetup,
  handleResendEmailVerification,
  handleResendPwdSetupLink,
  handlePwdReset,
};

