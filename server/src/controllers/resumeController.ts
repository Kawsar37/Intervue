import fs from "fs";
import { Response } from "express";
import { AuthRequest } from "../types";
import { Resume } from "../models/Resume";
import { AppError } from "../middleware/errorHandler";
import { extractTextFromPDF } from "../services/pdfService";
import { analyzeResume } from "../services/aiService";

export const uploadResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;

  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  // Extract text from PDF
  const extractedText = await extractTextFromPDF(req.file.path);

  // Analyze resume with AI
  const analysis = await analyzeResume(extractedText);

  // Create resume with extracted data
  const resume = await Resume.create({
    userId,
    fileName: req.file.originalname,
    fileUrl: req.file.path,
    extractedText,
    skills: analysis.skills,
    experience: analysis.experience,
    education: analysis.education,
  });

  res.status(201).json({
    success: true,
    data: resume,
  });
};

export const getResumes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;

  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: resumes,
  });
};

export const getResumeById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

export const deleteResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { id } = req.params;

  const resume = await Resume.findOneAndDelete({ _id: id, userId });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  // Delete the file from disk
  if (fs.existsSync(resume.fileUrl)) {
    fs.unlinkSync(resume.fileUrl);
  }

  res.json({
    success: true,
    message: "Resume deleted successfully",
  });
};
