import express from 'express';
import {getAllWinners, getWinner, createWinner, updateWinner, deleteWinner} from '../controller/winnerController.js';
import {login, logout, createAdmin} from '../controller/authController.js'
import {updatePassword, getAllApplications, getApplication, getMe} from '../controller/adminController.js'


const router = express.Router();

router.route("/").post(createAdmin);
router.post('/login', login);
router.get('/logout', logout);
router.get('/winners/:id', getWinner);
router.route('/winners') 
  .get(getAllWinners)
  .post(createWinner);


router.get('/me', getMe);
router.patch('/update-password', updatePassword);


router.route('/winners/:id')
  .patch(updateWinner)
  .delete(deleteWinner);

router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplication);

export default router;