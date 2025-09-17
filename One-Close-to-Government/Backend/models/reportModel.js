import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  issueType: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  voiceNote: { type: String },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
