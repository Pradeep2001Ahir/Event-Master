import express from 'express';
const router = express.Router();
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { getAllUsers, updateUserRole } from './controller.js';

router.get("/getAllusers", authMiddleware,getAllUsers);
router.post("/updateUserRole/:id",authMiddleware,updateUserRole);

export default router;