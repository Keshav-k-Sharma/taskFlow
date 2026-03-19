const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require("../models/member");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await User.create({ name, email, password: hashedPassword, role });

        let memberId = null;
        if (role !== "admin") {
            const newMember = await Member.create({
                name: newuser.name,
                email: newuser.email,
                position: "Unassigned",
            });
            memberId = newMember._id;
        }

        const token = jwt.sign(
            { id: newuser._id, role: newuser.role, memberId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ token, user: { name, email, role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const verifyPass = await bcrypt.compare(password, foundUser.password);
        if (!verifyPass) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        let memberId = null;
        if (foundUser.role !== "admin") {
            const memberRecord = await Member.findOne({ email: foundUser.email });
            if (memberRecord) memberId = memberRecord._id;
        }

        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.role, memberId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ token, user: { name: foundUser.name, email: foundUser.email, role: foundUser.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login };