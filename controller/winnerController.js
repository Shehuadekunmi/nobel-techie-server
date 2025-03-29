import Winner from '../models/Winner.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const getAllWinners = catchAsync(async (req, res, next) => {
  const winners = await Winner.find().sort('-issuedAt');
  
  res.status(200).json({
    status: 'success',
    results: winners.length,
    data: {
      winners
    }
  });
});

const getWinner = catchAsync(async (req, res, next) => {
  const winner = await Winner.findById(req.params.id);
  
  if (!winner) {
    return next(new AppError('No winner found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      winner
    }
  });
});

const createWinner = catchAsync(async (req, res, next) => {
  const {
    candidateName,
    certificateNumber,
    role,
    company,
    country,
    description,
    blogContent,
    juryName
  } = req.body;

  // Basic validation
  if (!candidateName || !certificateNumber) {
    return next(new AppError('candidateName and certificateNumber are required.', 400));
  }

  // Safely handle images
  const image = req.files?.image ? req.files.image[0].filename : null;
  const juryImage = req.files?.juryImage ? req.files.juryImage[0].filename : null;

  // Create the winner
  const winner = await Winner.create({
    candidateName,
    certificateNumber,
    role,
    company,
    country,
    description,
    blogContent,
    image,
    jury: {
      name: juryName,
      image: juryImage
    }
  });

  res.status(201).json({
    status: 'success',
    data: { winner }
  });
});


const updateWinner = catchAsync(async (req, res, next) => {
  const winner = await Winner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!winner) {
    return next(new AppError('No winner found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      winner
    }
  });
});

const deleteWinner = catchAsync(async (req, res, next) => {
  const winner = await Winner.findByIdAndDelete(req.params.id);
  
  if (!winner) {
    return next(new AppError('No winner found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});


export  {getAllWinners, getWinner, createWinner, updateWinner, deleteWinner}