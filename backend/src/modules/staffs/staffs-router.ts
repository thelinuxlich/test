import express, { Router } from "express";
import * as staffsController from "./staffs-controller";

const router: Router = express.Router();

router.get("", staffsController.handleGetAllStaffs);
router.post("", staffsController.handleAddStaff);
router.get("/:id", staffsController.handleGetStaff);
router.put("/:id", staffsController.handleUpdateStaff);
router.post("/:id/status", staffsController.handleReviewStaffStatus);

export { router as staffsRoutes };

