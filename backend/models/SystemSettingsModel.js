import mongoose from "mongoose";

const SystemSettingsSchema = new mongoose.Schema(
  {
    razorpayKeyId: {
      type: String,
      required: true,
      default: "rzp_test_SHtEFbhVVh6JIs",
    },
    razorpaySecret: {
      type: String,
      required: true,
      default: "iYM71zTceW19cIiaZSzAc0Pm",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSettings", SystemSettingsSchema);
