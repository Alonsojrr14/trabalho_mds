import express from "express";
import { addAdmin, adminLogin, getAdminById, getAdmins } from "../controller/admin-controller.js";
import Admin from "../models/Admin.js";
import Bookings from "../models/Bookings.js";

const adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);

export default adminRouter;