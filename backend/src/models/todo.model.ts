import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
}

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>('Todo', todoSchema); 