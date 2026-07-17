import { Response } from "express";
import { AuthRequest } from "../types";
import { Interview } from "../models/Interview";
import { InterviewResult } from "../models/InterviewResult";
import { Resume } from "../models/Resume";
import { InterviewTemplate } from "../models/InterviewTemplate";
import { AppError } from "../middleware/errorHandler";
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generateOverallFeedback,
} from "../services/aiService";

export const startInterview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { templateId, resumeId, jobDescription } = req.body;

  const template = await InterviewTemplate.findById(templateId);
  if (!template) {
    throw new AppError("Template not found", 404);
  }

  let resumeText: string | undefined;
  if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (resume) {
      resumeText = resume.extractedText;
    }
  }

  const questions = await generateInterviewQuestions(
    template.title,
    template.category,
    template.difficulty,
    Math.min(template.questionCount, 10),
    resumeText,
    jobDescription
  );

  const interview = await Interview.create({
    templateId,
    userId,
    resumeId: resumeId || undefined,
    jobDescription: jobDescription || undefined,
    questions: questions.map((q) => ({
      question: q.question,
      category: q.category,
    })),
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
  const { questionIndex, answer } = req.body;

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

  const question = interview.questions[questionIndex];

  const evaluation = await evaluateAnswer(
    question.question,
    answer,
    question.category
  );

  interview.questions[questionIndex].answer = answer;
  interview.questions[questionIndex].feedback = evaluation.feedback;
  interview.questions[questionIndex].score = evaluation.score;

  await interview.save();

  res.json({
    success: true,
    data: {
      interview,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
      },
    },
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

  const answeredQuestions = interview.questions.filter(
    (q) => q.answer && q.score !== undefined
  );

  if (answeredQuestions.length > 0) {
    const overallFeedback = await generateOverallFeedback(
      answeredQuestions.map((q) => ({
        question: q.question,
        category: q.category,
        answer: q.answer || "",
        score: q.score || 0,
      }))
    );

    await InterviewResult.create({
      interviewId: interview._id,
      userId,
      overallScore: overallFeedback.overallScore,
      categoryScores: overallFeedback.categoryScores,
      feedback: overallFeedback.feedback,
      recommendations: overallFeedback.recommendations,
      completedAt: new Date(),
    });
  }

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
