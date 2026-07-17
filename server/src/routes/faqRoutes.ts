import { Router } from "express";
import { Faq } from "../models/Faq";

const router = Router();

router.get("/", async (req, res) => {
  const faqs = await Faq.find().sort({ order: 1 });
  res.json({ success: true, data: faqs });
});

export default router;
