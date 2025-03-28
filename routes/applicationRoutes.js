import express  from 'express';
const router = express.Router();
import {createApplication, getAllApplications, updateApplicationStatus, deleteApplication, getApplication} from '../controller/applicationController.js'

// Public routes
router.post('/', createApplication);

// Protected routes (admin only)
// router.use(authController.protect, authController.restrictTo('admin', 'super-admin'));

router.get('/', getAllApplications);
router.get('/:id', getApplication);
router.patch('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default  router;