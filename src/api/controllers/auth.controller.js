const httpStatus = require('http-status-codes');
const User = require('../models/user.model');
const tokenService = require('../../services/token.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User with this email already exists');
  }

  const user = await User.create({ email, password });
  
  // Do not send password back
  const createdUser = await User.findById(user._id).select('-password');

  return res.status(httpStatus.CREATED).json(
    new ApiResponse(httpStatus.CREATED, createdUser, 'User registered successfully')
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = tokenService.generateTokens({ id: user._id, email: user.email });
  await tokenService.saveRefreshToken(user._id, refreshToken);
  
  const loggedInUser = await User.findById(user._id).select('-password');

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { user: loggedInUser, accessToken, refreshToken }, 'Login successful')
  );
});

module.exports = {
  signup,
  login,
};
