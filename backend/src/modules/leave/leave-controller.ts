import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  addNewLeaveRequest,
  reviewPendingLeaveRequest,
  makeNewLeavePolicy,
  fetchLeavePolicies,
  updateLeavePolicy,
  updatePolicyUsers,
  fetchPolicyUsers,
  deletePolicyUser,
  fetchPolicyEligibleUsers,
  reviewLeavePolicy,
  getUserLeaveHistory,
  deleteLeaveRequest,
  fetchPendingLeaveRequests,
  updateLeaveRequest,
  processGetMyLeavePolicy,
} from "./leave-service";

const handleMakeNewPolicy = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPolicy = await makeNewLeavePolicy(name);
  res.json(newPolicy);
});

const handleGetLeavePolicies = asyncHandler(async (req: Request, res: Response) => {
  const leavePolicies = await fetchLeavePolicies();
  res.json({ leavePolicies });
});

const handleGetMyLeavePolicy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = (req as any).user;
  const leavePolicies = await processGetMyLeavePolicy(id);
  res.json({ leavePolicies });
});

const handleUpdateLeavePlicy = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const updatedPolicy = await updateLeavePolicy(name, Number(id));
  res.json(updatedPolicy);
});

const handleUpdatePolicyUsers = asyncHandler(async (req: Request, res: Response) => {
  const { users } = req.body;
  const { id } = req.params;
  const message = await updatePolicyUsers(Number(id), users);
  res.json(message);
});

const handleGetPolicyUsers = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const users = await fetchPolicyUsers(Number(id));
  res.json({ users });
});

const handleRemovePolicyUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const message = await deletePolicyUser(user, Number(id));
  res.json(message);
});

const handleFetchPolicyEligibleUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await fetchPolicyEligibleUsers();
  res.json({ users });
});

const handleCreateNewLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = (req as any).user;
  const { policy, from, to, note } = req.body;
  const message = await addNewLeaveRequest({ policy, from, to, note, userId });
  res.json(message);
});

const handleReviewLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id: userId } = (req as any).user;
  const { id: leaveRequestId } = req.params;

  const message = await reviewPendingLeaveRequest(userId, Number(leaveRequestId), status);
  res.json(message);
});

const handleReviewLeavePolicy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const message = await reviewLeavePolicy(status, Number(id));
  res.json(message);
});

const handleUpdateLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  const payload = { ...body, id: Number(id) };

  const message = await updateLeaveRequest(payload);
  res.json(message);
});

const handleGetUserLeaveHistory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = (req as any).user;
  const leaveHistory = await getUserLeaveHistory(id);
  res.json({ leaveHistory });
});

const handleDeleteLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await deleteLeaveRequest(Number(id));
  res.json(message);
});

const handleFetchPendingLeaveRequests = asyncHandler(async (req: Request, res: Response) => {
  const pendingLeaves = await fetchPendingLeaveRequests();
  res.json({ pendingLeaves });
});

export {
  handleCreateNewLeaveRequest,
  handleReviewLeaveRequest,
  handleMakeNewPolicy,
  handleGetLeavePolicies,
  handleUpdateLeavePlicy,
  handleUpdatePolicyUsers,
  handleGetPolicyUsers,
  handleRemovePolicyUser,
  handleFetchPolicyEligibleUsers,
  handleReviewLeavePolicy,
  handleUpdateLeaveRequest,
  handleGetUserLeaveHistory,
  handleDeleteLeaveRequest,
  handleFetchPendingLeaveRequests,
  handleGetMyLeavePolicy,
};

