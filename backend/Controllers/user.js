import Users from "../Models/user.js";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addUser = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({ message: "Data not found" });
        }

        const emailExists = await Users.findOne({ email: data.email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const usernameExists = await Users.findOne({ username: data.username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = await Users.create(data);
        res.status(201).json({ message: "User added", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUser = await Users.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(202).json({ message: "User updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await Users.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(202).json({ message: "User deleted", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
