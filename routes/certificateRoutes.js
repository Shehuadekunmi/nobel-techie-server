import express from "express";
import {verifyCertificate} from "../controller/certificateController.js";


const router = express.Router();

router.get("/:certificateNumber", verifyCertificate);

export default router;
