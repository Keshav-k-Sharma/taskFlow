const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    deadline: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);