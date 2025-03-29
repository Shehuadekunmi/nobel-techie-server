import express from 'express';
import { uploadFile } from '../controller/uploadController.js';
import  uploadSingle  from '../utils/upload.js';


const router = express.Router();


router.post(
  '/winners', uploadSingle, uploadFile 
);


export default  router;