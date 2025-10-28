import express, { Router } from "express";
import * as accountController from "./account-controller";

const router: Router = express.Router();

router.post("/change-password", accountController.handlePasswordChange);
router.get("/me", accountController.handleGetAccountDetail);

export { router as accountRoutes };

