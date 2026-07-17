import { Router } from "express";
import { Testimonial } from "../models/Testimonial";

const router = Router();

router.get("/", async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json({ success: true, data: testimonials });
});

export default router;
