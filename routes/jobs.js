const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobs");

router.post("/", jobController.createTutorJob);
router.put("/:id", jobController.updateTutorJob);

module.exports = router;
