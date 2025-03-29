import express from 'express';
import {getAllWinners, getWinner, createWinner, updateWinner, deleteWinner} from '../controller/winnerController.js';
import {login, logout, protect, restrictTo, createAdmin} from '../controller/authController.js'
import {updatePassword, getAllApplications, getApplication, getMe} from '../controller/adminController.js'


const router = express.Router();

router.route("/").post(createAdmin);
router.post('/login', login);
router.get('/logout', logout);
router.get('/winners', getAllWinners)
router.get('/winners/:id', getWinner);

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);
router.patch('/update-password', updatePassword);

// Restrict to admin and super-admin
router.use(restrictTo('admin', 'super-admin'));

router.route('/winners')
  // .get(getAllWinners)
  .post(createWinner);

router.route('/winners/:id')
  // .get(getWinner)
  .patch(updateWinner)
  .delete(deleteWinner);

router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplication);

export default router;