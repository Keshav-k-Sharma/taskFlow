const {adminonly ,protect } = require("../middleware/authMiddleware")
const { getAllmembers, CreateMember ,updateMember} = require("../controllers/memberController")
const express = require("express");
const router = express.Router();


router.post("/",protect,adminonly,CreateMember);

router.get("/", protect, getAllmembers);

router.patch("/:id", protect, adminonly, updateMember);

module.exports = router;