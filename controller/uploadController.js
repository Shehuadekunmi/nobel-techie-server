import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const uploadFile = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    }
  });
});


export default {uploadFile}