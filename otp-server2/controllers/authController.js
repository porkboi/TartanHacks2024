// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const OTP = require('../models/otpModel');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;
    // Check if all details are provided
    if (!name || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required',
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }
    // Secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message,
      });
    }
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};


// User login
exports.login = async (req, res) => {
    try {
      const { email, password, otp } = req.body;
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Find the most recent OTP for the email
      const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
      console.log('otp:', response[0]);
      if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({
          success: false,
          message: 'The OTP is not valid',
        });
      }
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'secretKey');
      console.log('User logged in successfully');
      res.status(200).json({ token });
      
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  };