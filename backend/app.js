import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-router.js";
import adminRouter from "./routes/admin-router.js";
import movieRouter from "./routes/movie-router.js";
import bookingsRouter from "./routes/booking-router.js";
import cors from "cors";

dotenv.config();
console.log("SECRET_KEY:", process.env.SECRET_KEY);
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });





  
