import Winner from '../models/Winner.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const verifyCertificate = catchAsync(async (req, res, next) => {
  const winner = await Winner.findOne({ 
    certificateNumber: req.params.certificateNumber,
    published: true
  });
  
  if (!winner) {
    return next(new AppError('No valid certificate found with that number', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      winner
    }
  });
});

export  {verifyCertificate}