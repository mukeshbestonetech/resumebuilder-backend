const httpStatus = require('http-status-codes');
const User = require('../models/user.model');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, users));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user));
});

module.exports = {
  getUsers,
  getUserById,
  getUserDetails
};
