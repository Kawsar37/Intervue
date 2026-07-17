import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  startInterview,
  getInterviews,
  getInterviewById,
  submitAnswer,
  completeInterview,
  getInterviewResult,
} from "../controllers/interviewController";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("templateId").notEmpty().withMessage("Template ID is required"),
  ],
  validate,
  startInterview
);

router.get("/", getInterviews);

router.get("/:id", getInterviewById);

router.post(
  "/:id/answer",
  [
    body("questionIndex")
      .isInt({ min: 0 })
      .withMessage("Question index must be a non-negative integer"),
    body("answer").notEmpty().withMessage("Answer is required"),
  ],
  validate,
  submitAnswer
);

router.post("/:id/complete", completeInterview);

router.get("/:id/result", getInterviewResult);

export default router;
