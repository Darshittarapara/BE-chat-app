import mongoose from "mongoose";
const GroupMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    default: ""
  },
  images: [
    {
      type: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("GroupMessage", GroupMessageSchema);
