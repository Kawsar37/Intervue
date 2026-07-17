import { Router } from "express";
import { upload } from "../config/multer";
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController";

const router = Router();

router.post("/", upload.single("resume"), uploadResume);

router.get("/", getResumes);

router.get("/:id", getResumeById);

router.delete("/:id", deleteResume);

export default router;
