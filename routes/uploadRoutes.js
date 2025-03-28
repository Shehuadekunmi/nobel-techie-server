import express from 'express';
import uploadController from '../controller/uploadController.js';
// import authController from '../controller/authController.js';
import { protect, restrictTo } from '../controller/authController.js';

import  uploadSingle  from '../utils/upload.js';


const router = express.Router();

// router.post(
//   '/',
//   authController.protect,
//   authController.restrictTo('admin', 'super-admin'),
//   uploadSingle,
//   uploadController.uploadFile
// );


router.post(
  '/',
  protect,
  restrictTo('admin', 'super-admin'),
  uploadSingle,
  uploadController.uploadFile
);


export default  router;