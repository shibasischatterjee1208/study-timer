function SessionHistory({ sessions, totalSeconds }) {
  if (sessions.length === 0) {
    return (
      <div>
        <h2>History</h2>
        <p>No sessions logged yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>History</h2>
      <p>
        Total: {Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s across{" "}
        {sessions.length} sessions
      </p>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            {session.subject} — {Math.floor(session.seconds / 60)}m{" "}
            {session.seconds % 60}s — {session.completedAt}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SessionHistory