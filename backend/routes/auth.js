import express from "express";
import { register, login, logout } from "../Controllers/auth.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, (req, res) => {
    return res.status(200).json({
        message: "User authenticated",
        userId: req.userId
    });
});
export default router;
