import { Response } from "express";
import { AuthRequest } from "../types";
import { Resume } from "../models/Resume";
import { AppError } from "../middleware/errorHandler";

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = req;

  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const resume = await Resume.create({
    userId,
    fileName: req.file.originalname,
    fileUrl: req.file.path,
    extractedText: "", // Will be populated by AI analysis
  });

  res.status(201).json({
    success: true,
    data: resume,
  });
};

export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = req;

  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: resumes,
  });
};

export const getResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;

  const resume = await Resume.findOne({ _id: id, userId });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  res.json({
    success: true,
    data: resume,
  });
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;

  const resume = await Resume.findOneAndDelete({ _id: id, userId });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  res.json({
    success: true,
    message: "Resume deleted successfully",
  });
};
