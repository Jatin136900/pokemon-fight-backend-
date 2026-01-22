import express from "express";
import {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
} from "../Controllers/user.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.post("/add", addUser);
router.put("/edit/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
