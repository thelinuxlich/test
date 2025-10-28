import express, { Router } from "express";
import * as accessControlController from "./access-control-controller";
import { isUserAdmin } from "../../middlewares";

const router: Router = express.Router();

router.get("", isUserAdmin, accessControlController.handleGetAllAccessControls);
router.post("", isUserAdmin, accessControlController.handleAddAccessControl);
router.put("/:id", isUserAdmin, accessControlController.handleUpdateAccessControl);
router.delete("/:id", isUserAdmin, accessControlController.handleDeleteAccessControl);
router.get("/me", accessControlController.handleGetMyAccessControl);

export { router as accessControlRoutes };

