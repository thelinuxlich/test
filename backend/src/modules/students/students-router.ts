import express, { Router } from "express";
import * as studentController from "./students-controller";

const router: Router = express.Router();

router.get("", studentController.handleGetAllStudents);
router.post("", studentController.handleAddStudent);
router.get("/:id", studentController.handleGetStudentDetail);
router.patch("/:id/status", studentController.handleStudentStatus);
router.put("/:id", studentController.handleUpdateStudent);
router.delete("/:id", studentController.handleDeleteStudent);

export { router as studentsRoutes };

