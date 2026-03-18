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
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "member",
            required: true,
        },
        position: {
            type: String,
            default: "Unassigned",
        }
    }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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