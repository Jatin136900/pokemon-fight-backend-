// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         username: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//     },
//     { timestamps: true }
// );

// const Users = mongoose.model("Users", userSchema);

// export default Users;



import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    pokemon1: String,
    pokemon2: String,
    winner: String,
    power1: Number,
    power2: Number,
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ ADD THIS
    history: [historySchema],
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
