function SubjectChart({ totalsBySubject, maxSeconds, hasSessions }) {
  return (
    <div>
      <h2>Time by subject</h2>

      {!hasSessions ? (
        <p>Log a session to see your chart.</p>
      ) : (
        <div>
          {totalsBySubject.map(({ subject, seconds }) => (
            <div key={subject} style={{ marginBottom: "8px" }}>
              <div>
                {subject} — {Math.floor(seconds / 60)}m {seconds % 60}s
              </div>
              <div style={{ background: "#333", height: "20px", width: "100%" }}>
                <div
                  style={{
                    background: "#4ade80",
                    height: "100%",
                    width: `${(seconds / maxSeconds) * 100}%`
                  }}
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