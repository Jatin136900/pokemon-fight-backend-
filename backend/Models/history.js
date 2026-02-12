import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    pokemon1: { type: String, required: true },
    pokemon2: { type: String, required: true },
    winner: { type: String, required: true },
    power1: { type: Number, required: true },
    power2: { type: Number, required: true },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

export default History;
