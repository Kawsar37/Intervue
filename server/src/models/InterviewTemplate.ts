import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewTemplate extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number;
  questionCount: number;
  tags: string[];
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const interviewTemplateSchema = new Schema<IInterviewTemplate>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    estimatedDuration: {
      type: Number,
      required: true,
    },
    questionCount: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

interviewTemplateSchema.index({ category: 1, difficulty: 1 });

export const InterviewTemplate = mongoose.model<IInterviewTemplate>(
  "InterviewTemplate",
  interviewTemplateSchema
);
