import express, { Router } from "express";
import * as sectionController from "./section-controller";

const router: Router = express.Router();

router.get("", sectionController.handleGetAllSections);
router.post("", sectionController.handleAddNewSection);
router.get("/:id", sectionController.handleGetSectionById);
router.put("/:id", sectionController.handleUpdateSectionById);
router.delete("/:id", sectionController.handleDeleteSectionById);

export { router as sectionRoutes };

