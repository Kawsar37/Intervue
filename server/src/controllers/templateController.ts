import { Response } from "express";
import { AuthRequest, PaginationQuery } from "../types";
import { InterviewTemplate } from "../models/InterviewTemplate";
import { AppError } from "../middleware/errorHandler";
import {
  getPaginationParams,
  getPaginationMeta,
} from "../utils/pagination";

export const getTemplates = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { category, difficulty, search, page, limit } = req.query as {
    category?: string;
    difficulty?: string;
    search?: string;
  } & PaginationQuery;

  const { page: pageNum, limit: limitNum, skip } = getPaginationParams(
    page,
    limit
  );

  const filter: Record<string, unknown> = {};

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const [templates, total] = await Promise.all([
    InterviewTemplate.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    InterviewTemplate.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: templates,
    pagination: getPaginationMeta(total, pageNum, limitNum),
  });
};

export const getTemplateById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const template = await InterviewTemplate.findById(id);

  if (!template) {
    throw new AppError("Template not found", 404);
  }

  res.json({
    success: true,
    data: template,
  });
};

export const createTemplate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const template = await InterviewTemplate.create(req.body);

  res.status(201).json({
    success: true,
    data: template,
  });
};

export const updateTemplate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const template = await InterviewTemplate.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!template) {
    throw new AppError("Template not found", 404);
  }

  res.json({
    success: true,
    data: template,
  });
};

export const deleteTemplate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const template = await InterviewTemplate.findByIdAndDelete(id);

  if (!template) {
    throw new AppError("Template not found", 404);
  }

  res.json({
    success: true,
    message: "Template deleted successfully",
  });
};
