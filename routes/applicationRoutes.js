import express  from 'express';
const router = express.Router();
import {createApplication, getAllApplications, updateApplicationStatus, deleteApplication, getApplication} from '../controller/applicationController.js'


router.post('/', createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplication);
router.patch('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default  router;