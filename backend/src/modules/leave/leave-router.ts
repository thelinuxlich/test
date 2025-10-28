import express, { Router } from "express";
import * as leaveController from "./leave-controller";
import { checkApiAccess } from "../../middlewares";

const router: Router = express.Router();

router.post("/policies", checkApiAccess, leaveController.handleMakeNewPolicy);
router.get("/policies", checkApiAccess, leaveController.handleGetLeavePolicies);
router.get("/policies/me", checkApiAccess, leaveController.handleGetMyLeavePolicy);
router.put("/policies/:id", checkApiAccess, leaveController.handleUpdateLeavePlicy);
router.post("/policies/:id/status", checkApiAccess, leaveController.handleReviewLeavePolicy);
router.post("/policies/:id/users", checkApiAccess, leaveController.handleUpdatePolicyUsers);
router.get("/policies/:id/users", checkApiAccess, leaveController.handleGetPolicyUsers);
router.delete("/policies/:id/users", checkApiAccess, leaveController.handleRemovePolicyUser);
router.get("/policies/eligible-users", checkApiAccess, leaveController.handleFetchPolicyEligibleUsers);

router.get("/request", checkApiAccess, leaveController.handleGetUserLeaveHistory);
router.post("/request", checkApiAccess, leaveController.handleCreateNewLeaveRequest);
router.put("/request/:id", checkApiAccess, leaveController.handleUpdateLeaveRequest);
router.delete("/request/:id", checkApiAccess, leaveController.handleDeleteLeaveRequest);

router.get("/pending", checkApiAccess, leaveController.handleFetchPendingLeaveRequests);
router.post("/pending/:id/status", checkApiAccess, leaveController.handleReviewLeaveRequest);

export { router as leaveRoutes };

