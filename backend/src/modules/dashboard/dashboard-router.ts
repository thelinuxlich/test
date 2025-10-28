import express, { Router } from "express";
import * as dashboardController from "./dashboard-controller";

const router: Router = express.Router();

router.get("", dashboardController.handleGetDashboardData);

export { router as dashboardRoutes };

