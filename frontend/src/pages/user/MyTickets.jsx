import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../../api/bus.api";
import { AuthContext } from "../../context/AuthContext";

export default function MyTickets() {
  const { logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getMyBookings();
        setTickets(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setError("");
    setCancelling(bookingId);

    try {
      await cancelBooking(bookingId);
      // Refresh tickets
      const res = await getMyBookings();
      setTickets(res.data);
      alert("Booking cancelled successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Tickets</h2>
        <div style={styles.nav}>
          <Link to="/journeys" style={styles.navLink}>Browse Journeys</Link>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div style={styles.empty}>
          <p>You don't have any active bookings.</p>
          <Link to="/journeys" style={styles.browseLink}>Browse Journeys</Link>
        </div>
      ) : (
        <div style={styles.ticketList}>
          {tickets.map((t) => (
            <div key={t._id} style={styles.ticketCard}>
              <div style={styles.ticketHeader}>
                <h3 style={styles.busNumber}>{t.bus?.busNumber}</h3>
                <span style={styles.status}>{t.status}</span>
              </div>
              <div style={styles.ticketInfo}>
                <div style={styles.route}>
                  <span style={styles.source}>{t.journey?.source?.name}</span>
                  <span style={styles.arrow}>→</span>
                  <span style={styles.destination}>{t.journey?.destination?.name}</span>
                </div>
                <div style={styles.seatInfo}>
                  <strong>Seat:</strong> {t.seatNumber}
                </div>
                <div style={styles.dateInfo}>
                  <strong>Booked on:</strong> {new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>
              {t.status === "BOOKED" && (
                <button
                  onClick={() => handleCancel(t._id)}
                  disabled={cancelling === t._id}
                  style={styles.cancelBtn}
                >
                  {cancelling === t._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
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
    marginBottom: "2rem",
  },
  title: {
    color: "#333",
  },
  nav: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  navLink: {
    color: "#007bff",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    border: "1px solid #007bff",
    borderRadius: "4px",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
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
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },
  browseLink: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
  },
  ticketList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  ticketCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  busNumber: {
    margin: 0,
    color: "#333",
  },
  status: {
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  ticketInfo: {
    marginBottom: "1rem",
  },
  route: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1.1rem",
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
  seatInfo: {
    marginBottom: "0.5rem",
    color: "#666",
  },
  dateInfo: {
    color: "#666",
    fontSize: "0.9rem",
  },
  cancelBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
