import express, { Router } from "express";
import * as departmentController from "./department-controller";

const router: Router = express.Router();

router.get("", departmentController.handleGetAllDepartments);
router.post("", departmentController.handleAddNewDepartment);
router.get("/:id", departmentController.handleGetDepartmentById);
router.put("/:id", departmentController.handleUpdateDepartmentById);
router.delete("/:id", departmentController.handleDeleteDepartmentById);

export { router as departmentRoutes };

