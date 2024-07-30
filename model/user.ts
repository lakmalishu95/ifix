import mongoose from "mongoose";

const { Schema } = mongoose;

const nameSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});

const userSchema = new Schema(
  {
    role: {
      type: String,
    },
    name: nameSchema,
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    profile: {
      type: String,
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastseen: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
