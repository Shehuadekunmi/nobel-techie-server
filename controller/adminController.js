import Admin from '../models/Admin.js';
import Application from  '../models/Application.js';
import AppError from  '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

 const getMe = (req, res, next) => {
    req.params.id = req.admin.id;
    next();
  };

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get admin from collection
  const admin = await Admin.findById(req.admin.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await admin.correctPassword(req.body.passwordCurrent, admin.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  await admin.save();

  // 4) Log admin in, send JWT
  const token = admin.getSignedJwtToken();

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  admin.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
});

const getAllApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.find().sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: {
      applications
    }
  });
});

const getApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(new AppError('No application found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      application
    }
  });
});

export {updatePassword, getAllApplications, getApplication, getMe};