import { Router } from "express";
import { upload } from "../config/multer";
import { authMiddleware } from "../middleware/auth";
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController";

const router = Router();

router.use(authMiddleware);

router.post("/", upload.single("resume"), uploadResume);

router.get("/", getResumes);

router.get("/:id", getResumeById);

router.delete("/:id", deleteResume);

export default router;
