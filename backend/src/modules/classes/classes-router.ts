import express, { Router } from "express";
import * as classesController from "./classes-controller";
import { checkApiAccess } from "../../middlewares";

const router: Router = express.Router();

router.get("", checkApiAccess, classesController.handleFetchAllClasses);
router.get("/:id", checkApiAccess, classesController.handleFetchClassDetail);
router.post("", checkApiAccess, classesController.handleAddClass);
router.put("/:id", checkApiAccess, classesController.handleUpdateClass);
router.delete("/:id", checkApiAccess, classesController.handleDeleteClass);

export { router as classesRoutes };

