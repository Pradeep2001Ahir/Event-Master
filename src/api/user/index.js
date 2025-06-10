import express from 'express'
const router = express.Router();

import authMiddleware from '../../helper/common/jwtMiddleware.js';
import {validator} from '../../helper/common/validator.js'
import { changePassword, editProfile, forgotPassword, getUserDetails, resetPassword, userLogin, userRegister } from './controller.js';




router.post("/userRegisterd",validator("registerValidation"),userRegister);
router.post("/userLogin",userLogin);
router.get("/getUserDetails", authMiddleware, getUserDetails);
router.patch("/changePassword", authMiddleware,changePassword);
router.put("/editProfile",authMiddleware,editProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);





export default router;