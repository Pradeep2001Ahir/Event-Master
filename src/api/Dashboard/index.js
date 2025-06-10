import express from "express";
const router  = express.Router();
import authMiddleware from '../../helper/common/jwtMiddleware.js';
import { getAdminDashboardData, getOrganizerDashboard, getUserDashboard } from "./controller.js";



router.get("/orgniser/dashboard",authMiddleware, getOrganizerDashboard);
router.get("/admin",authMiddleware, getAdminDashboardData);
router.get("/user",authMiddleware, getUserDashboard)

export default router;

