import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  fetchNoticeRecipients,
  fetchAllNotices,
  fetchNoticeDetailById,
  addNotice,
  updateNotice,
  processNoticeStatus,
  processAddNoticeRecipient,
  processUpdateNoticeRecipient,
  processGetNoticeRecipients,
  processDeleteNoticeRecipient,
  processGetNoticeRecipient,
  processGetAllPendingNotices,
} from "./notices-service";

const handleFetchNoticeRecipients = asyncHandler(async (req: Request, res: Response) => {
  const noticeRecipients = await fetchNoticeRecipients();
  res.json({ noticeRecipients });
});

const handleGetNoticeRecipients = asyncHandler(async (req: Request, res: Response) => {
  const noticeRecipients = await processGetNoticeRecipients();
  res.json({ noticeRecipients });
});

const handleGetNoticeRecipient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const noticeRecipient = await processGetNoticeRecipient(Number(id));
  res.json(noticeRecipient);
});

const handleAddNoticeRecipient = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const message = await processAddNoticeRecipient(payload);
  res.json(message);
});

const handleUpdateNoticeRecipient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const message = await processUpdateNoticeRecipient({ ...payload, id: Number(id) });
  res.json(message);
});

const handleDeleteNoticeRecipient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await processDeleteNoticeRecipient(Number(id));
  res.json(message);
});

const handleFetchAllNotices = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = (req as any).user;
  const notices = await fetchAllNotices(userId);
  res.json({ notices });
});

const handleFetchAllPendingNotices = asyncHandler(async (req: Request, res: Response) => {
  const notices = await processGetAllPendingNotices();
  res.json({ notices });
});

const handleFetchNoticeDetailById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notice = await fetchNoticeDetailById(Number(id));
  res.json(notice);
});

const handleAddNotice = asyncHandler(async (req: Request, res: Response) => {
  const { id: authorId } = (req as any).user;
  const payload = req.body;
  const message = await addNotice({ ...payload, authorId });
  res.json(message);
});

const handleUpdateNotice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const message = await updateNotice({ ...payload, id: Number(id) });
  res.json(message);
});

const handleNoticeStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id: currentUserId, role: currentUserRole } = (req as any).user;
  const { id: noticeId } = req.params;
  const { status } = req.body;
  const payload = { noticeId: Number(noticeId), status, currentUserId, currentUserRole };
  const message = await processNoticeStatus(payload);
  res.json(message);
});

export {
  handleFetchNoticeRecipients,
  handleGetNoticeRecipients,
  handleFetchAllNotices,
  handleFetchNoticeDetailById,
  handleAddNotice,
  handleUpdateNotice,
  handleNoticeStatus,
  handleAddNoticeRecipient,
  handleUpdateNoticeRecipient,
  handleDeleteNoticeRecipient,
  handleGetNoticeRecipient,
  handleFetchAllPendingNotices,
};

