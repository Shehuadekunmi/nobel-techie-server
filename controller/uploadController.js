import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const uploadFile = catchAsync(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new AppError('Please upload a file', 400));
  }

  // Return uploaded files info
  res.status(200).json({
    status: 'success',
    data: {
      uploadedFiles: Object.keys(req.files).map((key) => ({
        field: key,
        filename: req.files[key][0].filename,
        path: `/uploads/${req.files[key][0].filename}`
      }))
    }
  });
});



export {uploadFile}