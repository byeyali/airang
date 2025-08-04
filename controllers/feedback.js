const fs = require("fs");
const { error } = require("console");
const { TutorJob, Tutor, TutorFeedback } = require("../models");

const createTutorFeedback = async(req, res) => {
  try {
    const tutorId = req.member.id;
    const {job_id, target_name, session_date, start_flag, content, next_plan, parent_confirm_flag, parent_comment} = req.body;
    
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}
module.exports = {
  createTutorFeedback
};