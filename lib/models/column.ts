import mongoose from "mongoose";

export interface IColumn extends mongoose.Document {
  title: string;
  boardId: mongoose.Schema.Types.ObjectId;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new mongoose.Schema<IColumn>(
  {
    title: {
      type: String,
      required: [true, "Please provide a column title"],
      minlength: 1,
      maxlength: 100,
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Column must be assigned to a board"],
    },
    position: {
      type: Number,
      required: [true, "Column position is required"],
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries of columns in a board
columnSchema.index({ boardId: 1, position: 1 });

export const Column =
  mongoose.models.Column || mongoose.model<IColumn>("Column", columnSchema);
