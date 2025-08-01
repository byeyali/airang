const express = require("express");
const router = express.Router();
const { uploadSingle, uploadMultiple } = require("../middlewares/upload"); // 구조분해 할당
const {
  createTutor,
  updateTutor,
  addTutorCategory,
  deleteTutorCategory,
  addTutorRegion,
  deleteTutorRegion,
  addTutorFile,
  deleteTutorFile,
} = require("../controllers/tutors");

router.post("/", uploadSingle, createTutor);
router.put("/:id", uploadSingle, updateTutor);
router.post("/:tutorId/category", addTutorCategory);
router.delete("/:tutorId/category", deleteTutorCategory);
router.post("/:tutorId/region", addTutorRegion);
router.delete("/:tutorId/region", deleteTutorRegion);
router.post("/:tutorId/files", uploadMultiple, addTutorFile);
router.delete("/:tutorId/files", deleteTutorFile);

module.exports = router;
