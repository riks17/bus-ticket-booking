import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
      <div style={styles.menu}>
        <Link to="/admin/locations" style={styles.menuCard}>
          <h3>Manage Locations</h3>
          <p>Add pickup/drop points</p>
        </Link>
        <Link to="/admin/buses" style={styles.menuCard}>
          <h3>Manage Buses</h3>
          <p>Create physical buses with capacity</p>
        </Link>
        <Link to="/admin/journeys" style={styles.menuCard}>
          <h3>Create Journey</h3>
          <p>Assign buses to routes</p>
        </Link>
        <Link to="/admin/sales" style={styles.menuCard}>
          <h3>View Sales Report</h3>
          <p>See all bookings and reset buses</p>
        </Link>
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
    marginBottom: "2rem",
  },
  title: {
    color: "#333",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  menu: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  menuCard: {
    display: "block",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "2rem",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s",
  },
};
