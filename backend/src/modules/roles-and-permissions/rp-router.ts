import express, { Router } from "express";
import * as rpController from "./rp-controller";

const router: Router = express.Router();

router.get("", rpController.handleGetRoles);
router.post("", rpController.handleAddRole);
router.post("/switch", rpController.handleSwitchRole);
router.put("/:id", rpController.handleUpdateRole);
router.post("/:id/status", rpController.handleRoleStatus);
router.get("/:id", rpController.handleGetRole);
router.get("/:id/permissions", rpController.handleGetRolePermission);
router.post("/:id/permissions", rpController.handleAddRolePermission);
router.get("/:id/users", rpController.handleGetUsersByRoleId);

export { router as rpRoutes };

