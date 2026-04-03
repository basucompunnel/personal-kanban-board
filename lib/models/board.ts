import mongoose from "mongoose";

export interface IBoard extends mongoose.Document {
  title: string;
  owner: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new mongoose.Schema<IBoard>(
  {
    title: {
      type: String,
      required: [true, "Please provide a board title"],
      minlength: 1,
      maxlength: 100,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Board must be assigned to a user"],
    },
  },
  { timestamps: true }
);

// Index for faster queries of user's boards
boardSchema.index({ owner: 1, createdAt: -1 });

export const Board =
  mongoose.models.Board || mongoose.model<IBoard>("Board", boardSchema);
