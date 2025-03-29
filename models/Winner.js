import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Please provide the winner name']
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: String,
  company: String,
  country: String,
  description: String,
  blogContent: String,
  image: String,
  jury: {
    name: String,
    image: String
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: false
  }
});

// winnerSchema.index({ certificateNumber: 1 }); 

export default mongoose.model('Winner', winnerSchema);