import express from 'express';
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { bookingTicket, getMyTickets } from './controller.js';
import { validator } from '../../helper/common/validator.js';
const router = express.Router();


router.post("/bookTicket", validator("bookingValidation"), authMiddleware, bookingTicket);
router.get("/myTicket",authMiddleware, getMyTickets);

export default router;