import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getJourneys } from "../../api/bus.api";
import { AuthContext } from "../../context/AuthContext";

export default function BusList() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await getJourneys();
        setJourneys(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load journeys");
      } finally {
        setLoading(false);
      }
    };
    fetchJourneys();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Available Journeys</h2>
        <div style={styles.nav}>
          <Link to="/my-tickets" style={styles.navLink}>My Tickets</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>Loading journeys...</div>
      ) : journeys.length === 0 ? (
        <div style={styles.empty}>No journeys available</div>
      ) : (
        <div style={styles.busGrid}>
          {journeys.map((j) => {
            const availableSeats = j.availableSeats ?? 0;
            return (
              <div key={j._id} style={styles.busCard}>
                <div style={styles.busHeader}>
                  <h3 style={styles.busNumber}>
                    {j.source?.name} → {j.destination?.name}
                  </h3>
                  <div style={styles.seatInfo}>{availableSeats} seats available</div>
                </div>
                <div style={styles.route}>
                  <span style={styles.source}>{j.source?.name}</span>
                  <span style={styles.arrow}>→</span>
                  <span style={styles.destination}>{j.destination?.name}</span>
                </div>
                <div style={styles.meta}>
                  <span>Bus: {j.bus?.busNumber || "N/A"}</span>
                  <span>Capacity: {j.bus?.seatCapacity || "--"}</span>
                </div>
                <Link to={`/journeys/${j._id}`} style={styles.viewBtn}>View Seats</Link>
              </div>
            );
          })}
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
    padding: "2rem",
    color: "#666",
  },
  busGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  busCard: {
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
    marginBottom: "1rem",
  },
  busNumber: {
    margin: 0,
    color: "#333",
  },
  seatInfo: {
    fontSize: "0.9rem",
    color: "#28a745",
    fontWeight: "bold",
  },
  route: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    fontSize: "1.1rem",
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
  viewBtn: {
    display: "block",
    textAlign: "center",
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    marginTop: "1rem",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#555",
  },
};
