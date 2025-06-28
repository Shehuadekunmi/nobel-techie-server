import Winner from '../models/Winner.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { cloudinary } from '../utils/cloudinary.js';

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
    year,
    role,
    company,
    country,
    description,
    blogContent,
    juryName
  } = req.body;

  console.log(req.body);

  
  let imageUrl = null;
  let juryImageUrl = null;
  
  if (req.files?.image) {
    const imageUpload = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: "uploads", 
    });
    imageUrl = imageUpload.secure_url;  
  };

//   console.log("🔥 FULL req.body:", JSON.stringify(req.body, null, 2));
// console.log("🔥 FULL req.files:", JSON.stringify(req.files, null, 2));


  if (req.files?.juryImage) { 
    console.log("✅ juryImage detected, uploading...");
    const juryImageUpload = await cloudinary.uploader.upload(req.files.juryImage.tempFilePath, {
      folder: "upload",
    });
    juryImageUrl = juryImageUpload.secure_url;
  }
  
  if (!candidateName || !certificateNumber) {
    return next(new AppError('Candidate name and certificate number are required.', 400));
  }

//   console.log("🔥 Request Body:", req.body);
// console.log("🔥 Request Files:", req.files);

  const winner = await Winner.create({
    candidateName,
    certificateNumber,
    year,
    role,
    company,
    country,
    description,
    blogContent,
    image: imageUrl,
    juryName,
    juryImage: juryImageUrl
       
  }); 

  res.status(201).json({
    status: 'success',
    data: { winner }
  });
});


const updateWinner = catchAsync(async (req, res, next) => {
  // 1. Handle file uploads to Cloudinary
  const uploadFile = async (file) => {
    if (!file) return null;
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    return result.secure_url;
  };

  // 2. Process image uploads (if new files were uploaded)
  if (req.files?.image) {
    req.body.image = await uploadFile(req.files.image);
  }
  if (req.files?.juryImage) {
    req.body.juryImage = await uploadFile(req.files.juryImage);
  }

  // 3. Update winner data
  const winner = await Winner.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!winner) {
    return next(new AppError('No winner found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { winner }
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