const Project = require("../models/project");
const member = require("../models/member");

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        .populate("members.member", "name email")
        .populate("createdBy", "name");

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, description, deadline } = req.body;
        const project = await Project.create({
            name,
            description,
            deadline,
            createdBy: req.user._id,
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addMemberToProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId, position } = req.body;
        const updated = await Project.findByIdAndUpdate(
            id,
            { $push: { members: { member: memberId, position: position || "Unassigned" } } },
            { new: true }
        ).populate("members.member", "name email");
        if (!updated) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Project.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeMemberFromProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;
    
        const updated = await Project.findByIdAndUpdate(
            id,
            { $pull: { members: { _id: memberId } } },
            { new: true }
        ).populate("members.member", "name email");
        if (!updated) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMemberPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { entryId, position } = req.body;
        const updated = await Project.findOneAndUpdate(
            { _id: id, "members._id": entryId },
            { $set: { "members.$.position": position } },
            { new: true }
        ).populate("members.member", "name email");
        if (!updated) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getAllProjects, createProject, addMemberToProject, updateProjectStatus ,removeMemberFromProject,updateMemberPosition};