import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController";

const router = Router();

router.post(
  "/",
  [
    body("fileName").optional().isString(),
  ],
  validate,
  uploadResume
);

router.get("/", getResumes);

router.get("/:id", getResumeById);

router.delete("/:id", deleteResume);

export default router;
