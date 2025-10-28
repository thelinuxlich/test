import express, { Router } from "express";

import { handle404Error, authenticateToken, csrfProtection } from "../middlewares";
import { authRoutes } from "../modules/auth/auth-router";
import { rpRoutes } from "../modules/roles-and-permissions/rp-router";
import { studentsRoutes } from "../modules/students/students-router";
import { leaveRoutes } from "../modules/leave/leave-router";
import { classesRoutes } from "../modules/classes/classes-router";
import { noticesRoutes } from "../modules/notices/notices-router";
import { staffsRoutes } from "../modules/staffs/staffs-router";
import { departmentRoutes } from "../modules/departments/department-router";
import { sectionRoutes } from "../modules/sections/section-router";
import { classTeacherRoutes } from "../modules/class-teacher/class-teacher-router";
import { accountRoutes } from "../modules/account/account-router";
import { dashboardRoutes } from "../modules/dashboard/dashboard-router";
import { accessControlRoutes } from "../modules/access-control/access-control-router";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", authenticateToken, csrfProtection, rpRoutes);
router.use("/students", authenticateToken, csrfProtection, studentsRoutes);
router.use("/leave", authenticateToken, csrfProtection, leaveRoutes);
router.use("/classes", authenticateToken, csrfProtection, classesRoutes);
router.use("/notices", authenticateToken, csrfProtection, noticesRoutes);
router.use("/staffs", authenticateToken, csrfProtection, staffsRoutes);
router.use("/departments", authenticateToken, csrfProtection, departmentRoutes);
router.use("/sections", authenticateToken, csrfProtection, sectionRoutes);
router.use("/class-teachers", authenticateToken, csrfProtection, classTeacherRoutes);
router.use("/account", authenticateToken, csrfProtection, accountRoutes);
router.use("/dashboard", authenticateToken, csrfProtection, dashboardRoutes);
router.use("/access-controls", authenticateToken, csrfProtection, accessControlRoutes);
router.use(handle404Error);

export { router as v1Routes };

