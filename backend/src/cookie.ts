import { Response } from "express";
import { env } from "./config";

interface CookieOptions {
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  domain?: string;
}

const cookieOptions: CookieOptions = {
  secure: true,
  sameSite: "lax",
  domain: env.COOKIE_DOMAIN,
};

const setAccessTokenCookie = (res: Response, accessToken: string): void => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: Number(env.JWT_ACCESS_TOKEN_TIME_IN_MS),
    ...cookieOptions,
  });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: Number(env.JWT_REFRESH_TOKEN_TIME_IN_MS),
    ...cookieOptions,
  });
};

const setCsrfTokenCookie = (res: Response, csrfToken: string): void => {
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    maxAge: Number(env.CSRF_TOKEN_TIME_IN_MS),
    ...cookieOptions,
  });
};

const setAllCookies = (res: Response, accessToken: string, refreshToken: string, csrfToken: string): void => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
  setCsrfTokenCookie(res, csrfToken);
};

const clearAllCookies = (res: Response): void => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("csrfToken", cookieOptions);
};

export {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setCsrfTokenCookie,
  setAllCookies,
  clearAllCookies,
};

