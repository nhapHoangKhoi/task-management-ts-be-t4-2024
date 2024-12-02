import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
   {
      title: String,
      status: String,
      content: String,
      timeStart: Date,
      timeFinish: Date,
      createdBy: String,
      updatedBy: String,
      listParticipants: Array,
      parentId: String,
      deleted: {
         type: Boolean,
         default: false
      },
      deletedAt: Date
   },
   {
      timestamps: true // automatically insert field createdAt, updatedAt
   }
);

const TaskModel = mongoose.model("Task", taskSchema, "tasks");

export default TaskModel;