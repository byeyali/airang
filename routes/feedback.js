const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const feedbackController = require("../controllers/feedbacks");

router.post("/", authorization, jobController.createTutorFeedback);