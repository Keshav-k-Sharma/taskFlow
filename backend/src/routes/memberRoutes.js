const {adminonly ,protect } = require("../middleware/authMiddleware")
const { getAllmembers, CreateMember } = require("../controllers/memberController")
const express = require("express");
const router = express.Router();


router.post("/",protect,adminonly,CreateMember);

router.get("/", protect, getAllmembers);

module.exports = router;