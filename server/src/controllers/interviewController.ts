import { Response } from "express";
import { AuthRequest } from "../types";
import { Interview } from "../models/Interview";
import { InterviewResult } from "../models/InterviewResult";
import { AppError } from "../middleware/errorHandler";

export const startInterview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { templateId, resumeId, jobDescription, questions } = req.body;

  const interview = await Interview.create({
    templateId,
    userId,
    resumeId,
    jobDescription,
    questions,
    status: "in_progress",
    startedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    data: interview,
  });
};

export const getInterviews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { status } = req.query as { status?: string };

  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;

  const interviews = await Interview.find(filter)
    .populate("templateId", "title category difficulty")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: interviews,
  });
};

export const getInterviewById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;

  const interview = await Interview.findOne({ _id: id, userId }).populate(
    "templateId",
    "title category difficulty"
  );

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  res.json({
    success: true,
    data: interview,
  });
};

export const submitAnswer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;
  const { questionIndex, answer, feedback, score } = req.body;

  const interview = await Interview.findOne({ _id: id, userId });

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  if (interview.status !== "in_progress") {
    throw new AppError("Interview is not in progress", 400);
  }

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    throw new AppError("Invalid question index", 400);
  }

  interview.questions[questionIndex].answer = answer;
  interview.questions[questionIndex].feedback = feedback;
  interview.questions[questionIndex].score = score;

  await interview.save();

  res.json({
    success: true,
    data: interview,
  });
};

export const completeInterview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;

  const interview = await Interview.findOne({ _id: id, userId });

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  if (interview.status !== "in_progress") {
    throw new AppError("Interview is not in progress", 400);
  }

  interview.status = "completed";
  interview.completedAt = new Date();
  await interview.save();

  res.json({
    success: true,
    data: interview,
  });
};

export const getInterviewResult = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;

  const result = await InterviewResult.findOne({
    interviewId: id,
    userId,
  }).populate("interviewId", "templateId questions");

  if (!result) {
    throw new AppError("Interview result not found", 404);
  }

  res.json({
    success: true,
    data: result,
  });
};
