import { ApiError } from "../../utils";
import {
  getNoticeRecipients,
  getNoticeById,
  addNewNotice,
  updateNoticeById,
  manageNoticeStatus,
  getNotices,
  addNoticeRecipient,
  updateNoticeRecipient,
  getNoticeRecipientList,
  deleteNoticeRecipient,
  getNoticeRecipientById,
  getAllPendingNotices,
} from "./notices-repository";

interface NoticeStatusPayload {
  noticeId: number;
  status: number;
  currentUserId: number;
  currentUserRole: string;
}

const fetchNoticeRecipients = async (): Promise<any[]> => {
  const recipients = await getNoticeRecipientList();
  if (!Array.isArray(recipients) || recipients.length <= 0) {
    throw new ApiError(404, "Recipients not found");
  }
  return recipients;
};

const processGetNoticeRecipients = async (): Promise<any[]> => {
  const recipients = await getNoticeRecipients();
  if (!Array.isArray(recipients) || recipients.length <= 0) {
    throw new ApiError(404, "Recipients not found");
  }
  return recipients;
};

const processGetNoticeRecipient = async (id: number): Promise<any> => {
  const recipient = await getNoticeRecipientById(id);
  if (!recipient) {
    throw new ApiError(404, "Recipient detail not found");
  }

  return recipient;
};

const fetchAllNotices = async (userId: number): Promise<any[]> => {
  const notices = await getNotices(userId);
  if (notices.length <= 0) {
    throw new ApiError(404, "Notices not found");
  }
  return notices;
};

const fetchNoticeDetailById = async (id: number): Promise<any> => {
  const noticeDetail = await getNoticeById(id);
  if (!noticeDetail) {
    throw new ApiError(404, "Notice detail not found");
  }
  return noticeDetail;
};

const addNotice = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await addNewNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new notice");
  }

  return { message: "Notice added successfully" };
};

const updateNotice = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await updateNoticeById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update notice");
  }

  return { message: "Notice updated successfully" };
};

const processNoticeStatus = async (payload: NoticeStatusPayload): Promise<{ message: string }> => {
  const { noticeId, status, currentUserId, currentUserRole } = payload;
  const notice = await getNoticeById(noticeId);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  const now = new Date();
  const {
    authorId,
    reviewer_id: reviewerIdFromDB,
    reviewed_dt: reviewedDateFromDB,
  } = notice;
  const userCanManageStatus = handleStatusCheck(
    currentUserRole,
    currentUserId,
    authorId,
    status
  );
  if (!userCanManageStatus) {
    throw new ApiError(
      403,
      "Forbidden. You do not have permission to access to this resource."
    );
  }

  const affectedRow = await manageNoticeStatus({
    noticeId,
    status,
    reviewerId: currentUserRole === "admin" ? currentUserId : reviewerIdFromDB,
    reviewDate: currentUserRole === "admin" ? now : reviewedDateFromDB,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to review notice");
  }

  return { message: "Success" };
};

const handleStatusCheck = (
  currentUserRole: string,
  currentUserId: number,
  authorId: number,
  status: number
): boolean => {
  if (currentUserRole === "admin") {
    return true;
  } else if (authorId === currentUserId) {
    switch (status) {
      case 1:
      case 2:
      case 3:
        return true;
      default:
        return false;
    }
  }

  return false;
};

const processAddNoticeRecipient = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await addNoticeRecipient(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add notice recipient");
  }

  return { message: "Notice Recipient added successfully" };
};

const processUpdateNoticeRecipient = async (payload: any): Promise<{ message: string }> => {
  const affectedRow = await updateNoticeRecipient(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update notice recipient");
  }

  return { message: "Notice Recipient updated successfully" };
};

const processDeleteNoticeRecipient = async (id: number): Promise<{ message: string }> => {
  const affectedRow = await deleteNoticeRecipient(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete notice recipient");
  }

  return { message: "Notice Recipient deleted successfully" };
};

const processGetAllPendingNotices = async (): Promise<any[]> => {
  const notices = await getAllPendingNotices();
  if (notices.length <= 0) {
    throw new ApiError(404, "Pending Notices not found");
  }

  return notices;
};

export {
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
};

