import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema({
  service: String,
  remark: String,
});

const customerSchema = new mongoose.Schema({
  website: String,
  name: String,
  company: String,
});

const ArchiveTaskSchema = new mongoose.Schema(
  {
    user_id: String,
    id: Number,
    title: String,
    notes: String,
    contacts: [String],
    metadata: metadataSchema,
    customer: customerSchema,
    createdBy: String,
    deleteUser: String,
    lastStatus: String,
    labels: [String],
  },
  { timestamps: true }
);

export default mongoose.models.ArchiveTask ||
  mongoose.model("ArchiveTask", ArchiveTaskSchema);
