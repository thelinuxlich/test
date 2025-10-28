import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { processPasswordChange, processGetAccountDetail } from "./account-service";
import { setAllCookies, clearAllCookies } from "../../cookie";

const handlePasswordChange = asyncHandler(async (req: Request, res: Response) => {
  const { newPassword, oldPassword } = req.body;
  const { id: userId } = (req as any).user;
  const {
    accessToken,
    refreshToken,
    csrfToken,
    message,
  } = await processPasswordChange({ userId, oldPassword, newPassword });

  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken, csrfToken);

  res.json({ message });
});

const handleGetAccountDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = (req as any).user;
  const accountDetail = await processGetAccountDetail(userId);
  res.json(accountDetail);
});

export {
  handlePasswordChange,
  handleGetAccountDetail,
};

