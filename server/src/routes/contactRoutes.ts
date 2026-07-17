import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { Contact } from "../models/Contact";

const router = Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
  ],
  validate,
  async (req: Request, res: Response) => {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      success: true,
      data: contact,
      message: "Your message has been received. We'll get back to you soon.",
    });
  }
);

export default router;
