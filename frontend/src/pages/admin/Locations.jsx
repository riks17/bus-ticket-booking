import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createLocation, getLocations } from "../../api/admin.api";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load locations");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Location name is required");
      return;
    }
    setLoading(true);
    try {
      await createLocation({ name });
      setName("");
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Locations</h2>
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Location Name</label>
        <div style={styles.row}>
          <input
            style={styles.input}
            value={name}
            placeholder="e.g., Andheri"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Location"}
          </button>
        </div>
      </form>

      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Saved Locations</h3>
        {locations.length === 0 ? (
          <p style={styles.muted}>No locations yet.</p>
        ) : (
          <ul style={styles.list}>
            {locations.map((loc) => (
              <li key={loc._id} style={styles.listItem}>
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "2rem", maxWidth: "720px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: { margin: 0, color: "#333" },
  backLink: { color: "#007bff", textDecoration: "none" },
  error: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "0.75rem 1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  form: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    marginBottom: "1.5rem",
  },
  label: { display: "block", marginBottom: "0.5rem", fontWeight: "bold" },
  row: { display: "flex", gap: "0.75rem", alignItems: "center" },
  input: {
    flex: 1,
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem 1.2rem",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  listSection: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  listTitle: { marginTop: 0 },
  muted: { color: "#666" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" },
  listItem: {
    padding: "0.75rem 1rem",
    border: "1px solid #eee",
    borderRadius: "6px",
    background: "#f9fafb",
  },
};
