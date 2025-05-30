import express from 'express';
const router = express.Router();
import { createCategory, getCategoryList, updateCategory } from './controller.js';


router.post("/createCategory",createCategory);
router.put("/updateCategory/:id",updateCategory);
router.get("/getCategoryList",getCategoryList);


export default router;