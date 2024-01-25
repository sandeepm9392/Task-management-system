const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileControllers");
const { verifyAccessToken } = require("../middlewares.js");

//api/profile
router.get("/", verifyAccessToken, getProfile);

module.exports = router;