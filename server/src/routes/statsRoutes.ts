import { Router } from "express";
import { Interview } from "../models/Interview";
import { Resume } from "../models/Resume";

const router = Router();

router.get("/", async (req, res) => {
  const [totalInterviews, totalResumes, totalUsers] = await Promise.all([
    Interview.countDocuments({ status: "completed" }),
    Resume.countDocuments(),
    Interview.distinct("userId").then((ids) => ids.length),
  ]);

  res.json({
    success: true,
    data: {
      totalInterviews,
      totalResumes,
      totalUsers,
    },
  });
});

export default router;
