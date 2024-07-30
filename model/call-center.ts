import mongoose from "mongoose";

const { Schema } = mongoose;

const callCenterSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    managerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CallCenter ||
  mongoose.model("CallCenter", callCenterSchema);
