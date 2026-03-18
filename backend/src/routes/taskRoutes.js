const express = require("express");
const {getAlltasks, CreateTask, UpdateStatus} = require("../controllers/taskController");
const {protect, adminonly } = require("../middleware/authMiddleware");

const router =express.Router();

router.get("/",protect,getAlltasks);
router.post("/",protect ,adminonly,CreateTask);
router.patch("/:id/status",protect,adminonly,UpdateStatus);


module.exports =router;