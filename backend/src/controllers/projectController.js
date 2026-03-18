const Project = require("../models/project");

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("members", "name email position")
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
        const { memberId } = req.body;
        const updated = await Project.findByIdAndUpdate(
            id,
            { $push: { members: memberId } },
            { new: true }
        ).populate("members", "name email position");
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

module.exports = { getAllProjects, createProject, addMemberToProject, updateProjectStatus };