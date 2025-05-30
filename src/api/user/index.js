import express from 'express'
const router = express.Router();

import authMiddleware from '../../helper/common/jwtMiddleware.js';
import {validator} from '../../helper/common/validator.js'
import { changePassword, editProfile, getUserDetails, uploadProfileImage, userLogin, userRegister } from './controller.js';
import upload from '../../helper/common/multerConfig.js';

router.post("/userRegisterd",validator("registerValidation"),userRegister);
router.post("/userLogin",userLogin);
router.get("/getUserDetails", authMiddleware, getUserDetails);
router.patch("/changePassword", authMiddleware,changePassword);
router.post("/uploadProfileImage",authMiddleware, upload.single("profileImage"),uploadProfileImage);
router.put("/editProfile",authMiddleware,editProfile)


export default router;