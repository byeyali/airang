const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notices");

router.post("/", noticeController.createNotice);
router.put("/:id", noticeController.updateNotice);
router.get("/", noticeController.getNoticeList);
router.get("/:id", noticeController.getNoticeById);
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;
