import mongoose from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  columnId: mongoose.Schema.Types.ObjectId;
  boardId: mongoose.Schema.Types.ObjectId;
  priority: TaskPriority;
  dueDate?: Date;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      minlength: 1,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 2000,
      trim: true,
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: [true, "Task must be assigned to a column"],
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Task must be assigned to a board"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    position: {
      type: Number,
      required: [true, "Task position is required"],
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
taskSchema.index({ columnId: 1, position: 1 });
taskSchema.index({ boardId: 1 });

export const Task =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);
