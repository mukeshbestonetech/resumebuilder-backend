const jwt = require('jsonwebtoken');
const Token = require('../api/models/token.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');
const User = require('../api/models/user.model');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, token) => {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Token.create({ userId, token, expires });
};

const verifyRefreshToken = async (refreshToken) => {
    const tokenDoc = await Token.findOne({ token: refreshToken });
    if (!tokenDoc) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
        }
        return user;
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
};

module.exports = {
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
};
