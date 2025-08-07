require("dotenv").config();
const axios = require("axios");
const { error } = require("console");

// 행안부 주소검색
const ADDR_BASE_URL = process.env.ADDRESS_BASE_URL;
const ADDR_API_KEY = process.env.ADDRESS_API_KEY;

const getAddress = async (req, res) => {
  const { keyword, currentPage = 1, countPerpage = 10 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "주소를 입력하세요." });
  }

  try {
    const response = await axios.get(ADDR_BASE_URL, {
      params: {
        confmKey: ADDR_API_KEY,
        currentPage,
        countPerpage,
        keyword,
        resultType: "json",
      },
    });

    const results = response.data.results;

    if (results.common.errorCode !== "0") {
      return res.status(500).json({ error: results.common.errorMessage });
    }

    return res.status(200).json({ addresses: results.juso });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 카카오맵 주소검색 .env 가져오기
const headers = {
  Authorization: process.env.KAKAO_REST_API_KEY,
};

const BASE_URL = process.env.KAKAO_ADDRESS_URL; // 환경변수에서 URL prefix 불러오기

const getRegionFromAddress = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "주소를 입력하세요" });
  }

  try {
    // 1. 주소 -> 좌표 변환
    const addrRes = await axios.get(`${BASE_URL}/search/address.json`, {
      headers,
      params: { query: address },
    });

    const doc = addrRes.data.documents[0];
    if (!doc) {
      return res.status(404).json({ error: "주소를 찾을수 없습니다." });
    }

    const { x, y } = doc;

    // 2. 좌표를 행정구역으로 변환
    const regionRes = await axios.get(`${BASE_URL}/geo/coord2regioncode.json`, {
      headers,
      params: { x, y },
    });

    const region = regionRes.data.documents[0];
    if (!region) {
      return res
        .status(404)
        .json({ error: "행정구역 정보를 찾을수 없습니다." });
    }

    // 3. 결과 반환
    return res.status(200).json({
      address_name: doc.address_name,
      coordinates: { x, y },
      region: {
        sido: region.region_1depth_name,
        gugun: region.region_2depth_name,
        dong: region.region_3depth_name,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAddress, getRegionFromAddress };
