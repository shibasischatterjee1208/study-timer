function SubjectChart({ totalsBySubject, maxSeconds, hasSessions }) {
  return (
    <div>
      <h2>Time by subject</h2>

      {!hasSessions ? (
        <p className="muted">Log a session to see your chart.</p>
      ) : (
        <div>
          {totalsBySubject.map(({ subject, seconds }) => (
            <div key={subject} className="bar-group">
              <div className="bar-label">
                {subject} — {Math.floor(seconds / 60)}m {seconds % 60}s
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(seconds / maxSeconds) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SubjectChart