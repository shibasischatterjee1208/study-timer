function DailyRecord({ days, totalSeconds, onClear }) {
  if (days.length === 0) {
    return (
      <div>
        <h2>Daily record</h2>
        <p className="muted">No sessions logged yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Daily record</h2>

      <p className="muted">
        All time: {Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s
      </p>

      {days.map(day => (
        <div key={day.date} className="day-group">
          <div className="day-header">
            <strong>{day.date}</strong>
            <span className="muted">
              {Math.floor(day.seconds / 60)}m {day.seconds % 60}s
            </span>
          </div>
          <ul>
            {day.items.map(session => (
              <li key={session.id} className="session-row">
                {session.subject} — {Math.floor(session.seconds / 60)}m{" "}
                {session.seconds % 60}s — {session.completedAt}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={onClear} style={{ marginTop: "12px" }}>
        Clear history
      </button>
    </div>
  )
}

export default DailyRecord