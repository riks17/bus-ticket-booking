import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import { getBusDetails, bookSeat } from "../../api/bus.api";

export default function BusDetails() {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // Initial Fetch
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await getBusDetails(busId);
        setBus(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bus details");
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [busId]);

  // Real-time Updates via Socket.io
  useEffect(() => {
    // Connect to the backend server
    const socket = io("http://localhost:5001"); 

    // Listen for single seat updates (Booking or Cancellation)
    socket.on("seatUpdate", ({ busId: updatedBusId, seatNumber, action }) => {
      if (updatedBusId === busId) {
        setBus((prevBus) => {
          if (!prevBus) return prevBus;
          return {
            ...prevBus,
            seats: prevBus.seats.map((s) =>
              s.seatNumber === seatNumber
                ? { ...s, isBooked: action === "BOOKED" }
                : s
            ),
          };
        });
      }
    });

    // Listen for full bus reset
    socket.on("busReset", ({ busId: resetBusId }) => {
      if (resetBusId === busId) {
        setBus((prevBus) => {
          if (!prevBus) return prevBus;
          return {
            ...prevBus,
            seats: prevBus.seats.map((s) => ({ ...s, isBooked: false })),
          };
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [busId]);

  const handleBookSeat = async (seatNumber) => {
    if (!window.confirm(`Book seat ${seatNumber}?`)) return;

    setError("");
    setBooking(true);

    try {
      await bookSeat({ busId, seatNumber });
      // Note: We don't strictly need to refetch here anymore because
      // the socket event will update the UI, but keeping it for safety is fine.
      alert(`Seat ${seatNumber} booked successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book seat");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading bus details...</div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Bus not found</div>
        <Link to="/buses" style={styles.backLink}>Back to Buses</Link>
      </div>
    );
  }

  const availableSeats = bus.seats.filter(s => !s.isBooked).length;
  const bookedSeats = bus.seats.filter(s => s.isBooked).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{bus.busNumber}</h2>
        <Link to="/buses" style={styles.backLink}>← Back to Buses</Link>
      </div>
      <div style={styles.info}>
        <div style={styles.route}>
          <span style={styles.source}>{bus.source}</span>
          <span style={styles.arrow}>→</span>
          <span style={styles.destination}>{bus.destination}</span>
        </div>
        <div style={styles.stats}>
          <span>Total Seats: {bus.totalSeats}</span>
          <span style={styles.available}>Available: {availableSeats}</span>
          <span style={styles.booked}>Booked: {bookedSeats}</span>
        </div>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.seatMap}>
        <h3 style={styles.seatTitle}>Select a Seat</h3>
        <div style={styles.seatGrid}>
          {bus.seats.map((s) => (
            <button
              key={s.seatNumber}
              style={{
                ...styles.seat,
                ...(s.isBooked ? styles.seatBooked : styles.seatAvailable),
              }}
              disabled={s.isBooked || booking}
              onClick={() => handleBookSeat(s.seatNumber)}
              title={s.isBooked ? "Already booked" : `Book ${s.seatNumber}`}
            >
              {s.seatNumber}
            </button>
          ))}
        </div>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{...styles.seat, ...styles.seatAvailable}}></div>
            <span>Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.seat, ...styles.seatBooked}}></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  title: {
    color: "#333",
    margin: 0,
  },
  backLink: {
    color: "#007bff",
    textDecoration: "none",
  },
  info: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  route: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  source: {
    fontWeight: "bold",
    color: "#007bff",
  },
  arrow: {
    color: "#666",
  },
  destination: {
    fontWeight: "bold",
    color: "#007bff",
  },
  stats: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.9rem",
  },
  available: {
    color: "#28a745",
    fontWeight: "bold",
  },
  booked: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  error: {
    color: "#dc3545",
    padding: "1rem",
    backgroundColor: "#f8d7da",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
  },
  seatMap: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  seatTitle: {
    marginTop: 0,
    marginBottom: "1.5rem",
    color: "#333",
  },
  seatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  seat: {
    padding: "0.75rem",
    border: "2px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  seatAvailable: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    color: "#155724",
  },
  seatBooked: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
    color: "#721c24",
    cursor: "not-allowed",
  },
  legend: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
};