import { Response } from "express";
import { AuthRequest } from "../types";
import { Favorite } from "../models/Favorite";

export const toggleFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { templateId } = req.params;

  const existing = await Favorite.findOne({ userId, templateId });

  if (existing) {
    await Favorite.deleteOne({ _id: existing._id });
    res.json({ success: true, data: { favorited: false } });
  } else {
    await Favorite.create({ userId, templateId });
    res.json({ success: true, data: { favorited: true } });
  }
};

export const getFavorites = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;

  const favorites = await Favorite.find({ userId })
    .populate("templateId")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: favorites.map((f) => f.templateId),
  });
};

export const checkFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req;
  const { templateId } = req.params;

  const existing = await Favorite.findOne({ userId, templateId });

  res.json({
    success: true,
    data: { favorited: !!existing },
  });
};
