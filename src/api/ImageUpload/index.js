import express from 'express';
const router = express.Router();
import upload from '../../helper/common/multerConfig.js';
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { uploadImageController } from './contoller.js';


router.post("/uploadImage/:type", authMiddleware, upload.array('images', 5),uploadImageController );

export default router;