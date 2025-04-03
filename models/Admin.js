import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { timeStamp } from 'console';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 3,
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {timeStamps: true});


export default  mongoose.model('Admin', adminSchema);