require("dotenv").config();
const axios = require("axios");

const headers = {
  Authorization: process.env.KAKAO_REST_API_KEY,
};

const BASE_URL = process.env.KAKAO_ADDRESS_URL; // 환경변수에서 URL prefix 불러오기

async function getRegionFromAddress(address) {
  if (!address) throw new Error("주소가 없습니다.");

  const addressRes = await axios.get(`${BASE_URL}/search/address.json`, {
    headers,
    params: { query: address },
  });

  const doc = addressRes.data.documents[0];
  if (!doc) throw new Error("주소를 찾을 수 없습니다.");

  const { x, y } = doc;

  const regionRes = await axios.get(`${BASE_URL}/geo/coord2regioncode.json`, {
    headers,
    params: { x, y },
  });

  const region = regionRes.data.documents[0];
  if (!region) throw new Error("행정구역 정보를 찾을 수 없습니다.");

  return {
    sido: region.region_1depth_name,
    gugun: region.region_2depth_name,
    dong: region.region_3depth_name,
  };
}

module.exports = { getRegionFromAddress };
