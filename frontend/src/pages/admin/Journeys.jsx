import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createJourney,
  getJourneys,
  getBuses,
  getLocations,
} from "../../api/admin.api";

export default function Journeys() {
  const [locations, setLocations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [form, setForm] = useState({
    busId: "",
    sourceId: "",
    destinationId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [locRes, busRes, journeyRes] = await Promise.all([
        getLocations(),
        getBuses(),
        getJourneys(),
      ]);
      setLocations(locRes.data);
      setBuses(busRes.data);
      setJourneys(journeyRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const busMap = useMemo(
    () => Object.fromEntries(buses.map((b) => [b._id, b])),
    [buses]
  );

  const handleBusChange = (busId) => {
    setForm((prev) => ({ ...prev, busId }));
    const matchedJourney = journeys.find((j) => j.bus?._id === busId);
    if (matchedJourney) {
      setForm({
        busId,
        sourceId: matchedJourney.source?._id,
        destinationId: matchedJourney.destination?._id,
      });
    }
  };

  const handleLocationChange = (key, value) => {
    const updated = { ...form, [key]: value };
    // Auto-fill bus if a journey with same route exists
    if (updated.sourceId && updated.destinationId) {
      const found = journeys.find(
        (j) =>
          j.source?._id === updated.sourceId &&
          j.destination?._id === updated.destinationId
      );
      if (found) {
        updated.busId = found.bus?._id || "";
      }
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.busId || !form.sourceId || !form.destinationId) {
      setError("Bus, source, and destination are required");
      return;
    }
    if (form.sourceId === form.destinationId) {
      setError("Source and destination must be different");
      return;
    }

    const existingForBus = journeys.find((j) => j.bus?._id === form.busId);
    if (existingForBus) {
      setError("This bus is already assigned to a journey");
      return;
    }

    setLoading(true);
    try {
      await createJourney({
        busId: form.busId,
        sourceId: form.sourceId,
        destinationId: form.destinationId,
      });
      setForm({ busId: "", sourceId: "", destinationId: "" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create journey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Create Journey</h2>
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Bus Number</label>
          <select
            style={styles.input}
            value={form.busId}
            onChange={(e) => handleBusChange(e.target.value)}
          >
            <option value="">Select bus</option>
            {buses.map((b) => (
              <option key={b._id} value={b._id}>
                {b.busNumber} ({b.seatCapacity} seats)
              </option>
            ))}
          </select>
          {form.busId && journeys.find((j) => j.bus?._id === form.busId) && (
            <div style={styles.warning}>
              This bus already has a journey assigned.
            </div>
          )}
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Source</label>
            <select
              style={styles.input}
              value={form.sourceId}
              onChange={(e) => handleLocationChange("sourceId", e.target.value)}
            >
              <option value="">Select source</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Destination</label>
            <select
              style={styles.input}
              value={form.destinationId}
              onChange={(e) =>
                handleLocationChange("destinationId", e.target.value)
              }
            >
              <option value="">Select destination</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Journey"}
        </button>
      </form>

      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Existing Journeys</h3>
        {journeys.length === 0 ? (
          <p style={styles.muted}>No journeys yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Bus</th>
                <th>Route</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {journeys.map((j) => (
                <tr key={j._id}>
                  <td>{j.bus?.busNumber}</td>
                  <td>
                    {j.source?.name} → {j.destination?.name}
                  </td>
                  <td>{j.bus?.seatCapacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "2rem", maxWidth: "900px", margin: "0 auto" },
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
  formGroup: { marginBottom: "1rem" },
  label: { display: "block", marginBottom: "0.5rem", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  button: {
    width: "100%",
    padding: "0.75rem",
    background: "#007bff",
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  warning: {
    marginTop: "0.25rem",
    color: "#d48806",
    fontSize: "0.9rem",
  },
};
