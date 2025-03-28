import mongoose from 'mongoose';
import validator from 'validator';

const applicationSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, 'Please provide your surname'],
    trim: true,
    maxlength: [50, 'Surname cannot be more than 50 characters']
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  organization: {
    name: String,
    website: String,
    position: String
  },
  contribution: {
    description: {
      type: String,
      required: [true, 'Please describe your contribution'],
      // minlength: [500, 'Description must be at least 500 characters']
    },
    outcomes: String
  },
  files: {
    evidence: String,
    cv: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Application', applicationSchema);