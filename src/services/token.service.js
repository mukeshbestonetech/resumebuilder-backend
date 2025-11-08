const jwt = require('jsonwebtoken');
const Token = require('../api/models/token.model');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, token) => {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Token.create({ userId, token, expires });
};

module.exports = {
  generateTokens,
  saveRefreshToken,
};
