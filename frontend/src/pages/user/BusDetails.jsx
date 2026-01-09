import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { getJourneyDetails, bookSeat } from "../../api/bus.api";

export default function BusDetails() {
  const { journeyId } = useParams();
  const [journey, setJourney] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingSeat, setBookingSeat] = useState("");

  const fetchJourney = async () => {
    try {
      const res = await getJourneyDetails(journeyId);
      setJourney(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load journey details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyId]);

  const handleBookSeat = async (seatNumber) => {
    if (!window.confirm(`Book seat ${seatNumber}?`)) return;
    setError("");
    setBookingSeat(seatNumber);
    try {
      await bookSeat({ journeyId, seatNumber });
      await fetchJourney();
      alert(`Seat ${seatNumber} booked successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book seat");
    } finally {
      setBookingSeat("");
    }
  };

  const seatRows = useMemo(() => {
    if (!journey?.bus?.seats) return [];
    const rows = journey.bus.seats.reduce((acc, seat) => {
      const rowKey = seat.row || Number((seat.seatNumber || "0").match(/\d+/)?.[0]);
      if (!acc[rowKey]) acc[rowKey] = {};
      acc[rowKey][seat.position] = seat;
      return acc;
    }, {});

    const orderedRows = Object.keys(rows)
      .map(Number)
      .sort((a, b) => a - b);

    const positionOrder = ["LW", "LA", "RA", "RW"];
    return orderedRows.map((row) => ({
      row,
      seats: positionOrder.map((pos) => rows[row][pos]).filter(Boolean),
      map: rows[row],
    }));
  }, [journey]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading journey details...</div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Journey not found</div>
        <Link to="/journeys" style={styles.backLink}>Back to Journeys</Link>
      </div>
    );
  }

  const availableSeats =
    journey.bus?.seats?.filter((s) => !s.isBooked).length ?? 0;
  const bookedSeats =
    journey.bus?.seats?.filter((s) => s.isBooked).length ?? 0;

  const renderSeat = (seat) => {
    if (!seat) return <div style={{ width: "64px" }} />;
    const disabled = seat.isBooked || !!bookingSeat;
    return (
      <button
        key={seat.seatNumber}
        style={{
          ...styles.seat,
          ...(seat.isBooked ? styles.seatBooked : styles.seatAvailable),
          ...(bookingSeat === seat.seatNumber ? styles.seatLoading : {}),
        }}
        disabled={disabled}
        onClick={() => handleBookSeat(seat.seatNumber)}
        title={seat.isBooked ? "Already booked" : `Book ${seat.seatNumber}`}
      >
        {seat.seatNumber}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            {journey.source?.name} → {journey.destination?.name}
          </h2>
          <div style={styles.subTitle}>Bus: {journey.bus?.busNumber}</div>
        </div>
        <Link to="/journeys" style={styles.backLink}>← Back to Journeys</Link>
      </div>

      <div style={styles.info}>
        <div style={styles.stats}>
          <span>Capacity: {journey.bus?.seatCapacity}</span>
          <span style={styles.available}>Available: {availableSeats}</span>
          <span style={styles.booked}>Booked: {bookedSeats}</span>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.seatMap}>
        <div style={styles.seatHeader}>
          <h3 style={styles.seatTitle}>Select a Seat</h3>
          <span style={styles.frontLabel}>Front</span>
        </div>

        <div style={styles.seatLayout}>
          {seatRows.map(({ row, map }) => (
            <div key={row} style={styles.rowWrapper}>
              <div style={styles.rowLabel}>Row {row}</div>
              <div style={styles.rowSeats}>
                <div style={styles.seatGroup}>
                  {renderSeat(map["LW"])}
                  {renderSeat(map["LA"])}
                </div>
                <div style={styles.aisle}>AISLE</div>
                <div style={styles.seatGroup}>
                  {renderSeat(map["RA"])}
                  {renderSeat(map["RW"])}
                </div>
              </div>
            </div>
          ))}
          <div style={styles.backLabel}>Back</div>
        </div>

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.seat, ...styles.seatAvailable }}></div>
            <span>Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.seat, ...styles.seatBooked }}></div>
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
  subTitle: {
    color: "#555",
    marginTop: "0.25rem",
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
  stats: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.95rem",
    flexWrap: "wrap",
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
  seatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  seatTitle: {
    marginTop: 0,
    marginBottom: 0,
    color: "#333",
  },
  seatLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },
  rowWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  rowLabel: {
    width: "70px",
    textAlign: "right",
    color: "#555",
    fontWeight: "bold",
  },
  rowSeats: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  seatGroup: {
    display: "flex",
    gap: "0.5rem",
  },
  aisle: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "#f1f3f5",
    color: "#666",
    borderRadius: "4px",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
  },
  seat: {
    width: "64px",
    padding: "0.75rem",
    border: "2px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
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
  seatLoading: {
    opacity: 0.6,
  },
  legend: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    marginTop: "1.5rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  frontLabel: {
    backgroundColor: "#e9ecef",
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    color: "#555",
    fontSize: "0.85rem",
  },
  backLabel: {
    alignSelf: "center",
    color: "#777",
    fontSize: "0.85rem",
    marginTop: "0.5rem",
  },
};