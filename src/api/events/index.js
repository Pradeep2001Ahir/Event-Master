import express from 'express'
import { createEvent, editEvent, getEventDetails, getFilterEventList,  } from './contoller.js';
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { validator } from '../../helper/common/validator.js';
import upload from '../../helper/common/multerConfig.js';


const router = express.Router();

router.post("/createEvent",validator("evnetRegisterValidation"),authMiddleware,createEvent);
router.put("/editEvent/:id", validator("editEventValidation"), authMiddleware,editEvent);
router.get("/getEventDetails/:id", authMiddleware,getEventDetails);
router.post("/getFiletEventData", authMiddleware ,getFilterEventList);





// router.post("/uploadEventIamge/:id/:folder", authMiddleware, upload.array("images",5), uploadEventImagesController);
// router.post("/getEventList", authMiddleware ,getEventList);
export default router;