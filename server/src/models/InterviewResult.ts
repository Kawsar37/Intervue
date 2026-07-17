import mongoose, { Document, Schema } from "mongoose";

export interface ICategoryScore {
  category: string;
  score: number;
  feedback: string;
}

export interface IInterviewResult extends Document {
  interviewId: mongoose.Types.ObjectId;
  userId: string;
  overallScore: number;
  categoryScores: ICategoryScore[];
  feedback: string;
  recommendations: string[];
  completedAt: Date;
  createdAt: Date;
}

const categoryScoreSchema = new Schema<ICategoryScore>({
  category: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const interviewResultSchema = new Schema<IInterviewResult>(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    categoryScores: [categoryScoreSchema],
    feedback: {
      type: String,
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interviewResultSchema.index({ userId: 1, completedAt: -1 });

export const InterviewResult = mongoose.model<IInterviewResult>(
  "InterviewResult",
  interviewResultSchema
);
