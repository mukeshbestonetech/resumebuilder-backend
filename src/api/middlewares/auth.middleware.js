const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded?._doc; // Attach user payload to request
    next();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: Invalid token');
  }
});

module.exports = authMiddleware;
