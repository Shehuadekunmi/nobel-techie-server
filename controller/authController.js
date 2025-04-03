import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from "bcryptjs";
import createToken from '../utils/createToken.js'

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please fill all the inputs");
  }

  const userExist = await Admin.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
  if (userExist) {
    return res.status(400).send("Admin already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const newAdmin = new Admin({ email, password: hashedPassword });

  try {
    await newAdmin.save();
    createToken(res, newAdmin._id);

    return res.status(201).json({
      _id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    });
  } catch (error) {
    console.error("Error saving admin:", error.message);
    res.status(500).json({ message: "Invalid admin data", error: error.message });
  }
});


const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  console.log("🛠️ Received login request:", { email, password });

  const existingAdmin = await Admin.findOne({ email }).select("+password"); 

  if (!existingAdmin) {
    console.log("❌ Admin not found");
    throw new Error("Invalid email or password");
  }

  const isPasswordValidate = await bcrypt.compare(password, existingAdmin.password);

  if (!isPasswordValidate) {
    console.log("❌ Password does not match");
    throw new Error("Invalid email or password");
  }

  createToken(res, existingAdmin._id);

  res.status(200).json({
    _id: existingAdmin._id,
    email: existingAdmin.email,
    role: existingAdmin.role,
  });
});



const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Use decoded.adminId to fetch the full admin data from the DB
    const currentAdmin = await Admin.findById(decoded.adminId).select('+password');
    if (!currentAdmin) {
      return next(new AppError('The admin belonging to this token does no longer exist.', 401));
    }
    req.user = currentAdmin; // Attach the full admin object which includes 'role'
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
};






export {createAdmin, login, logout, protect} 