import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao buscar filme ou usuário", error: err.message });
  }
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found with given id" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID " });
  }
   let booking;

  try {
    booking = new Bookings({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save();
    await existingMovie.save();
    await booking.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao criar reserva", error: err.message });
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking});
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao buscar reserva", error: err.message });
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    console.log(booking);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao deletar reserva", error: err.message });
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};

export const getBookingsByDate = async (req, res, next) => {
  const { movieId, date } = req.params;
  let bookings;
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    bookings = await Bookings.find({
      movie: movieId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao buscar reservas", error: err.message });
  }
  return res.status(200).json({ bookings });
};
