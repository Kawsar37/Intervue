import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
  userId: string;
  templateId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "InterviewTemplate",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ userId: 1, templateId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
