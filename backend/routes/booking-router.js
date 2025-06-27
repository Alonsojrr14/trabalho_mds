import express from "express";
import { deleteBooking, getBookingById, newBooking, getBookingsByDate } from "../controller/booking-controller.js";

const bookingsRouter = express.Router();

bookingsRouter.get("/:id", getBookingById);
bookingsRouter.get("/movie/:movieId/date/:date", getBookingsByDate);
bookingsRouter.post("/", newBooking);
bookingsRouter.delete("/:id", deleteBooking);

export default bookingsRouter;