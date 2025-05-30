import express from 'express'
import { createEvent, editEvent, getEventDetails, getEventList, getFilterEventList } from './contoller.js';
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { validator } from '../../helper/common/validator.js';
const router = express.Router();

router.post("/createEvent",validator("evnetRegisterValidation"),authMiddleware,createEvent);
router.put("/editEvent/:id",editEvent);
router.get("/getEventDetails/:id", getEventDetails);
router.post("/getEventList", getEventList);
router.post("/getFiletEventData",getFilterEventList);

export default router;