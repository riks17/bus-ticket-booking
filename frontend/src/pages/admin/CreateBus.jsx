import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createBus } from "../../api/admin.api";

export default function CreateBus() {
  const navigate = useNavigate();
  const [bus, setBus] = useState({
    busNumber: "",
    source: "",
    destination: "",
    totalSeats: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!bus.busNumber || !bus.source || !bus.destination || !bus.totalSeats) {
      setError("All fields are required");
      return;
    }

    if (bus.totalSeats < 1 || bus.totalSeats > 100) {
      setError("Total seats must be between 1 and 100");
      return;
    }

    setLoading(true);

    try {
      await createBus({
        ...bus,
        totalSeats: parseInt(bus.totalSeats),
      });
      alert("Bus created successfully!");
      navigate("/admin");
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
          <label style={styles.label}>Source</label>
          <input
            style={styles.input}
            placeholder="e.g., New York"
            value={bus.source}
            onChange={(e) => setBus({ ...bus, source: e.target.value })}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Destination</label>
          <input
            style={styles.input}
            placeholder="e.g., Los Angeles"
            value={bus.destination}
            onChange={(e) => setBus({ ...bus, destination: e.target.value })}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Total Seats</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            max="100"
            placeholder="e.g., 40"
            value={bus.totalSeats}
            onChange={(e) => setBus({ ...bus, totalSeats: e.target.value })}
            required
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Bus"}
        </button>
      </form>
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
};
