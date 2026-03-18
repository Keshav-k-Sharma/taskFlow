const express = require("express");
const { getAllProjects, createProject, addMemberToProject, updateProjectStatus } = require("../controllers/projectController");
const { protect, adminonly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllProjects);
router.post("/", protect, adminonly, createProject);
router.patch("/:id/members", protect, adminonly, addMemberToProject);
router.patch("/:id/status", protect, adminonly, updateProjectStatus);

module.exports = router;