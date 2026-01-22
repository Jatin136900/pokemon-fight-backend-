// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import "dotenv/config";

// import connectToDB from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.js";
// import pokemonRouter from "./routes/pokemon.js";

// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//     cors({
//         origin: process.env.FRONTEND_URL,
//         credentials: true,
//     })
// );


// connectToDB();


// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use ("/pokemon",pokemonRouter)


// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectToDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import pokemonRouter from "./routes/pokemon.js";

const app = express();

// ✅ CORS — THIS IS ENOUGH (NO app.options NEEDED)
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(cookieParser());

connectToDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/pokemon", pokemonRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
