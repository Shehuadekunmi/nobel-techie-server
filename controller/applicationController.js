import Application from '../models/Application.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { cloudinary } from "../utils/cloudinary.js";

const createApplication = catchAsync(async (req, res, next) => {
  const organization = JSON.parse(req.body.organization || "{}");
  console.log("Parsed Organization:", organization);

  const {
    surname,
    firstName,
    email,
    contribution,
    outcome, 
  } = req.body;   



  let evidenceUrl = null;
  let cvUrl = null;

  // Upload files to Cloudinary if they exist
  if (req.files?.evidence) {
    const evidenceUpload = await cloudinary.uploader.upload(req.files.evidence.tempFilePath, {
      folder: "uploads",
    });
    evidenceUrl = evidenceUpload.secure_url;
  }


  if (req.files?.cv) {
    const cvUpload = await cloudinary.uploader.upload(req.files.cv.tempFilePath, {
      folder: "uploads",
    });
    cvUrl = cvUpload.secure_url;
  }

  // console.log("🔥 FULL req.body:", JSON.stringify(req.body, null, 2));
  // console.log("🔥 FULL req.files:", JSON.stringify(req.files, null, 2));
  
   
 
  const application = await Application.create({
    surname,
    firstName,
    email, 
    organization: {
      name: organization.name || "",
      website: organization.website || "",
      position: organization.position || "",
    },
    contribution,
    outcome,
    files: {
      evidence: evidenceUrl,
      cv: cvUrl,
    },
  });

  res.status(201).json({
    status: "success",
    data: { application },
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

const updateApplicationStatus = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  
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

const deleteApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  
  if (!application) {
    return next(new AppError('No application found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});



export  {createApplication, getAllApplications, updateApplicationStatus, deleteApplication, getApplication}