import mongoose from "mongoose";

const SystemSettingsSchema = new mongoose.Schema(
  {
    razorpayKeyId: {
      type: String,
      required: true,
      default: "placeholder_key",
    },
    razorpaySecret: {
      type: String,
      required: true,
      default: "placeholder_secret",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSettings", SystemSettingsSchema);
