import express from 'express';
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { bookingTicket } from './controller.js';
import { validator } from '../../helper/common/validator.js';
const router = express.Router();


router.post("/bookTicket", validator("bookingValidation"), authMiddleware, bookingTicket);

export default router;