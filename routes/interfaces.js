const express = require("express");
const router = express.Router();
const { getRegionFromAddress } = require("../controllers/interfaces");

router.post("/region", async (req, res) => {
  const { address } = req.body; // 클라이언트가 보낸 JSON body에서 address 추출

  if (!address) {
    return res.status(400).json({ error: "주소가 입력되지 않았습니다." });
  }

  try {
    const regionData = await getRegionFromAddress(address); // 파라미터로 넘겨줌
    res.json(regionData);
  } catch (error) {
    res.status(500).json({ error: error.message || "서버 오류" });
  }
});

module.exports = router;
