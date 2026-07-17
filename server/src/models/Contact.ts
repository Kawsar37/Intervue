import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "replied";
  createdAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "replied"], default: "pending" },
  },
  { timestamps: true }
);

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
