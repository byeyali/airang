const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "not authorized" });
    }
    // 토근 검증
    jwt.verify(token, "access_token", (err, member) => {
      if (err) {
        return res.status(401).json({ message: "not authorized" });
      }
      req.member = member;
      next(); // 다음으로 이동
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = authorization;
