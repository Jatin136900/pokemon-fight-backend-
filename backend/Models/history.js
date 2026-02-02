import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pokemon1: String,
    pokemon2: String,
    winner: String,
    power1: Number,
    power2: Number,
  },
  { timestamps: true } // 🔥 createdAt auto save
);

export default mongoose.model("History", historySchema);
