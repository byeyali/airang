const authController = require("../controllers/auth");
const authorization = require("../middlewares/auth");
const express = require("express");
const router = express.Router(); // ✅ 반드시 Router()를 호출해야 합니다

// 로그인
router.post("/login", authController.login);

// 로그아웃 (선택적 - 클라이언트에서 토큰 삭제 방식)
router.post("/logout", authorization, authController.logout);

module.exports = router;
