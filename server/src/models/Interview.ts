import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewQuestion {
  question: string;
  category: string;
  answer?: string;
  feedback?: string;
  score?: number;
}

export interface IInterview extends Document {
  templateId: mongoose.Types.ObjectId;
  userId: string;
  resumeId?: mongoose.Types.ObjectId;
  jobDescription?: string;
  mode: "text" | "voice";
  questions: IInterviewQuestion[];
  status: "pending" | "in_progress" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const interviewQuestionSchema = new Schema<IInterviewQuestion>({
  question: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  feedback: {
    type: String,
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
  },
});

const interviewSchema = new Schema<IInterview>(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "InterviewTemplate",
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
    },
    jobDescription: {
      type: String,
    },
    mode: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },
    questions: [interviewQuestionSchema],
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ userId: 1, status: 1 });
interviewSchema.index({ templateId: 1 });

export const Interview = mongoose.model<IInterview>(
  "Interview",
  interviewSchema
);
