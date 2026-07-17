import { Response } from "express";
import { AuthRequest } from "../types";
import { Interview } from "../models/Interview";

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;

  const interviews = await Interview.find({ userId });

  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(
    (i) => i.status === "completed"
  ).length;

  // Calculate average score
  let totalScore = 0;
  let scoreCount = 0;

  interviews.forEach((interview) => {
    interview.questions.forEach((question) => {
      if (question.score !== undefined) {
        totalScore += question.score * 10; // Convert 0-10 to 0-100
        scoreCount++;
      }
    });
  });

  const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

  // Get recent results
  const recentResults = interviews
    .filter((i) => i.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completedAt || b.createdAt).getTime() -
        new Date(a.completedAt || a.createdAt).getTime()
    )
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      totalInterviews,
      completedInterviews,
      averageScore,
      recentResults,
    },
  });
};
