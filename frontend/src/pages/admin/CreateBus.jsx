import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createBus, getBuses } from "../../api/admin.api";

export default function CreateBus() {
  const [bus, setBus] = useState({
    busNumber: "",
    seatCapacity: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);

  const capacityOptions = [16, 20, 28, 40];

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await getBuses();
        setBuses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!bus.busNumber || !bus.seatCapacity) {
      setError("Bus number and seat capacity are required");
      return;
    }

    setLoading(true);

    try {
      await createBus({
        ...bus,
        seatCapacity: parseInt(bus.seatCapacity),
      });
      alert("Bus created successfully!");
      setBus({ busNumber: "", seatCapacity: "" });
      const res = await getBuses();
      setBuses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Create Bus</h2>
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Bus Number</label>
          <input
            style={styles.input}
            placeholder="e.g., BUS001"
            value={bus.busNumber}
            onChange={(e) => setBus({ ...bus, busNumber: e.target.value })}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Seat Capacity</label>
          <select
            style={styles.input}
            value={bus.seatCapacity}
            onChange={(e) => setBus({ ...bus, seatCapacity: e.target.value })}
            required
          >
            <option value="">Select capacity</option>
            {capacityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} seats
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Bus"}
        </button>
      </form>
      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Existing Buses</h3>
        {buses.length === 0 ? (
          <p style={styles.muted}>No buses yet.</p>
        ) : (
          <ul style={styles.busList}>
            {buses.map((b) => (
              <li key={b._id} style={styles.busItem}>
                <span>{b.busNumber}</span>
                <span style={styles.muted}>{b.seatCapacity} seats</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
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
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  listSection: {
    marginTop: "2rem",
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
  },
  listTitle: {
    marginTop: 0,
  },
  busList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  busItem: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    paddingBottom: "0.5rem",
  },
  muted: {
    color: "#666",
  },
};
