import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templateController";

const router = Router();

router.get("/", getTemplates);

router.get("/:id", getTemplateById);

router.use(authMiddleware);

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Difficulty must be beginner, intermediate, or advanced"),
    body("estimatedDuration")
      .isNumeric()
      .withMessage("Estimated duration must be a number"),
    body("questionCount")
      .isNumeric()
      .withMessage("Question count must be a number"),
  ],
  validate,
  createTemplate
);

router.put(
  "/:id",
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("category")
      .optional()
      .notEmpty()
      .withMessage("Category cannot be empty"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Difficulty must be beginner, intermediate, or advanced"),
  ],
  validate,
  updateTemplate
);

router.delete("/:id", deleteTemplate);

export default router;
