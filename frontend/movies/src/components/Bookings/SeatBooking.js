import React, { useState, useEffect } from "react";
import "./SeatBooking.css";
import { getBookingsByDate, newBooking } from "../../api-helpers/api-helpers";

const TOTAL_SEATS = 80;

// Estados possíveis: livre, selecionado, reservado, masculino, feminino
const initialSeats = Array.from({ length: TOTAL_SEATS }, (_, i) => ({
  id: i + 1,
  status: "livre", // outros: 'selecionado', 'reservado', 'masculino', 'feminino'
}));

const SeatBooking = ({ movieId, selectedDate }) => {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (selectedDate && movieId) {
      // Buscar reservas existentes para a data selecionada
      getBookingsByDate(movieId, selectedDate)
        .then((res) => {
          const bookedSeats = res.bookings.map(booking => booking.seatNumber);
          setSeats(prev => prev.map(seat => ({
            ...seat,
            status: bookedSeats.includes(seat.id) ? "reservado" : "livre"
          })));
        })
        .catch((err) => console.log(err));
    }
  }, [selectedDate, movieId]);

  const handleSeatClick = (id) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === id) {
          if (seat.status === "livre" && selectedCount < 80) {
            setSelectedCount((c) => c + 1);
            return { ...seat, status: "selecionado" };
          } else if (seat.status === "selecionado") {
            setSelectedCount((c) => c - 1);
            return { ...seat, status: "livre" };
          }
        }
        return seat;
      })
    );
  };

  const handleConfirm = async () => {
    const selectedSeats = seats.filter((s) => s.status === "selecionado").map((s) => s.id);
    
    try {
      // Salvar cada assento selecionado
      for (const seatNumber of selectedSeats) {
        await newBooking({
          movie: movieId,
          seatNumber,
          date: selectedDate
        });
      }

      alert(`Assentos reservados com sucesso: ${selectedSeats.join(", ")}`);
      
      // Atualizar o estado dos assentos
      setSeats((prev) =>
        prev.map((seat) =>
          seat.status === "selecionado"
            ? { ...seat, status: "reservado" }
            : seat
        )
      );
      setSelectedCount(0);

      // Recarregar as reservas para a data atual
      const res = await getBookingsByDate(movieId, selectedDate);
      const bookedSeats = res.bookings.map(booking => booking.seatNumber);
      setSeats(prev => prev.map(seat => ({
        ...seat,
        status: bookedSeats.includes(seat.id) ? "reservado" : "livre"
      })));
    } catch (err) {
      console.error("Erro ao reservar assentos:", err);
      alert("Erro ao realizar a reserva. Por favor, tente novamente.");
    }
  };

  // Contadores
  const livre = seats.filter((s) => s.status === "livre").length;
  const reservado = seats.filter((s) => s.status === "reservado").length;
  const selecionado = seats.filter((s) => s.status === "selecionado").length;

  return (
    <div className="seat-booking-container">
      <h2>Reserva de Assentos</h2>
      <div className="seats-grid">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat ${seat.status}`}
            onClick={() => handleSeatClick(seat.id)}
          >
            {seat.id.toString().padStart(2, "0")}
          </div>
        ))}
      </div>
      <div className="legend">
        <span className="seat livre"></span> Livre
        <span className="seat selecionado"></span> Selecionado
        <span className="seat reservado"></span> Reservado
      </div>
      <div className="counters">
        Livre: {livre} | Selecionado: {selecionado} | Reservado: {reservado}
      </div>
      <button onClick={handleConfirm} disabled={selecionado === 0}>
        Confirmar Reserva
      </button>
    </div>
  );
};


SeatBooking.propTypes = {
  movieId: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
};

export default SeatBooking; 
