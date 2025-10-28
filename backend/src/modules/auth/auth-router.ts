import express, { Router } from "express";
import {
  authenticateToken,
  csrfProtection,
  handleEmailVerificationToken,
  handlePasswordSetupToken,
  checkApiAccess,
} from "../../middlewares";
import * as authController from "./auth-controller";
import { validateRequest } from "../../utils";
import { LoginSchema } from "./auth-schema";

const router: Router = express.Router();

router.post("/login", validateRequest(LoginSchema), authController.handleLogin);
router.get("/refresh", authController.handleTokenRefresh);
router.post("/logout", authenticateToken, csrfProtection, authController.handleLogout);
router.get("/verify-email/:token", handleEmailVerificationToken, authController.handleAccountEmailVerify);
router.post("/setup-password", handlePasswordSetupToken, authController.handleAccountPasswordSetup);
router.post("/resend-email-verification", authenticateToken, csrfProtection, checkApiAccess, authController.handleResendEmailVerification);
router.post("/resend-pwd-setup-link", authenticateToken, csrfProtection, checkApiAccess, authController.handleResendPwdSetupLink);
router.post("/reset-pwd", authenticateToken, csrfProtection, checkApiAccess, authController.handlePwdReset);

export { router as authRoutes };

