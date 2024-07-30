import mongoose from "mongoose";

const { Schema } = mongoose;

const metadataSchema = new mongoose.Schema({
  service: String,
  remark: String,
});

const customerSchema = new mongoose.Schema({
  website: String,
  name: String,
  company: String,
});

const taskSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    notes: String,
    contacts: [String],
    metadata: metadataSchema,
    customer: customerSchema,
    createdBy: String,
    calls: [String],
    labels: [String],
  },
  { timestamps: true }
);

const columnSchema = new mongoose.Schema({
  id: String,
  color: String,
  title: String,
  taskIds: [Number],
});

const userTaskLayoutSchema = new mongoose.Schema(
  {
    user_id: String,
    tasks: [taskSchema],
    columns: [columnSchema],
    columnOrder: [String],
  },
  { timestamps: true }
);

export default mongoose.models.CallCenterTask ||
  mongoose.model("CallCenterTask", userTaskLayoutSchema);
