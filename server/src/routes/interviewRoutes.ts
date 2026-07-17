import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import {
  startInterview,
  getInterviews,
  getInterviewById,
  submitAnswer,
  completeInterview,
  getInterviewResult,
} from "../controllers/interviewController";

const router = Router();

router.post(
  "/",
  [
    body("templateId").notEmpty().withMessage("Template ID is required"),
    body("questions")
      .isArray({ min: 1 })
      .withMessage("At least one question is required"),
    body("questions.*.question")
      .notEmpty()
      .withMessage("Question text is required"),
    body("questions.*.category")
      .notEmpty()
      .withMessage("Question category is required"),
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
    body("score")
      .isFloat({ min: 0, max: 10 })
      .withMessage("Score must be between 0 and 10"),
  ],
  validate,
  submitAnswer
);

router.post("/:id/complete", completeInterview);

router.get("/:id/result", getInterviewResult);

export default router;
