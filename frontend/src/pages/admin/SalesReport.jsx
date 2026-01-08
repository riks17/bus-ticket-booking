import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSales, resetBus } from "../../api/admin.api";

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await getSales();
        setSales(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load sales report");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleResetBus = async (busId, busNumber) => {
    if (!window.confirm(`Are you sure you want to reset bus ${busNumber}? This will cancel all bookings for this bus.`)) {
      return;
    }

    setError("");
    setResetting(busId);

    try {
      await resetBus(busId);
      alert(`Bus ${busNumber} reset successfully!`);
      // Refresh sales data
      const res = await getSales();
      setSales(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset bus");
    } finally {
      setResetting(null);
    }
  };

  // Group bookings by bus
  const bookingsByBus = sales.reduce((acc, booking) => {
    const busId = booking.bus._id;
    if (!acc[busId]) {
      acc[busId] = {
        bus: booking.bus,
        bookings: [],
      };
    }
    acc[busId].bookings.push(booking);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Sales Report</h2>
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>Loading sales report...</div>
      ) : sales.length === 0 ? (
        <div style={styles.empty}>No bookings found</div>
      ) : (
        <div style={styles.report}>
          {Object.values(bookingsByBus).map((group) => (
            <div key={group.bus._id} style={styles.busSection}>
              <div style={styles.busHeader}>
                <div>
                  <h3 style={styles.busNumber}>{group.bus.busNumber}</h3>
                  <div style={styles.route}>
                    {group.bus.source} → {group.bus.destination}
                  </div>
                </div>
                <button
                  onClick={() => handleResetBus(group.bus._id, group.bus.busNumber)}
                  disabled={resetting === group.bus._id}
                  style={styles.resetBtn}
                >
                  {resetting === group.bus._id ? "Resetting..." : "Reset Bus"}
                </button>
              </div>
              <div style={styles.bookingsList}>
                {group.bookings.map((booking) => (
                  <div key={booking._id} style={styles.bookingCard}>
                    <div style={styles.bookingInfo}>
                      <div>
                        <strong>{booking.user.name}</strong> ({booking.user.email})
                      </div>
                      <div style={styles.seatInfo}>
                        Seat: <strong>{booking.seatNumber}</strong>
                      </div>
                      <div style={styles.status}>
                        Status: <span style={booking.status === "BOOKED" ? styles.statusBooked : styles.statusCancelled}>
                          {booking.status}
                        </span>
                      </div>
                      <div style={styles.date}>
                        Booked: {new Date(booking.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
  backLink: {
    color: "#007bff",
    textDecoration: "none",
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
    padding: "2rem",
    color: "#666",
  },
  report: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  busSection: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  busHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #eee",
  },
  busNumber: {
    margin: 0,
    color: "#333",
  },
  route: {
    color: "#666",
    marginTop: "0.25rem",
  },
  resetBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  bookingCard: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "4px",
  },
  bookingInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0.5rem",
  },
  seatInfo: {
    color: "#666",
  },
  status: {
    color: "#666",
  },
  statusBooked: {
    color: "#28a745",
    fontWeight: "bold",
  },
  statusCancelled: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  date: {
    color: "#666",
    fontSize: "0.9rem",
  },
};
