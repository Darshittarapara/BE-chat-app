import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Group name is required"],
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  ],
  image: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model("Group", GroupSchema);
