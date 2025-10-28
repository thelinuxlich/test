import express, { Router } from "express";
import * as noticeController from "./notices-controller";
import { checkApiAccess } from "../../middlewares";

const router: Router = express.Router();

router.get(
  "/recipients/list",
  checkApiAccess,
  noticeController.handleFetchNoticeRecipients
);
router.get(
  "/recipients",
  checkApiAccess,
  noticeController.handleGetNoticeRecipients
);
router.get(
  "/recipients/:id",
  checkApiAccess,
  noticeController.handleGetNoticeRecipient
);
router.post(
  "/recipients",
  checkApiAccess,
  noticeController.handleAddNoticeRecipient
);
router.put(
  "/recipients/:id",
  checkApiAccess,
  noticeController.handleUpdateNoticeRecipient
);
router.delete(
  "/recipients/:id",
  checkApiAccess,
  noticeController.handleDeleteNoticeRecipient
);
router.post("/:id/status", checkApiAccess, noticeController.handleNoticeStatus);
router.get(
  "/pending",
  checkApiAccess,
  noticeController.handleFetchAllPendingNotices
);
router.get(
  "/:id",
  checkApiAccess,
  noticeController.handleFetchNoticeDetailById
);
router.get("", checkApiAccess, noticeController.handleFetchAllNotices);
router.post("", checkApiAccess, noticeController.handleAddNotice);
router.put("/:id", checkApiAccess, noticeController.handleUpdateNotice);

export { router as noticesRoutes };

