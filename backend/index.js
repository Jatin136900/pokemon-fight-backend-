import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectToDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import pokemonRouter from "./routes/pokemon.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);


connectToDB();


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use ("/pokemon",pokemonRouter)


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

