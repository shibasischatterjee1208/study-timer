import { useState, useEffect } from "react"

function App() {
  const [durationMin, setDurationMin] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [status, setStatus] = useState("idle")

  const [subjects, setSubjects] = useState(["Calculus", "Physics", "DSA"])
  const [newSubject, setNewSubject] = useState("")
  const [selected, setSelected] = useState("Calculus")

  const [pendingRemoval, setPendingRemoval] = useState(null)
  const [sessions, setSessions] = useState([])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const totalSeconds = sessions.reduce((sum, s) => sum + s.seconds, 0)

  const totalsBySubject = subjects.map(subject => {
    const seconds = sessions
      .filter(s => s.subject === subject)
      .reduce((sum, s) => sum + s.seconds, 0)
    return { subject, seconds }
  })

  const maxSeconds = Math.max(...totalsBySubject.map(t => t.seconds), 1)

  function logSession(elapsed) {
    if (elapsed <= 0) return
    setSessions(prev => [
      ...prev,
      {
        id: Date.now(),
        subject: selected,
        seconds: elapsed,
        completedAt: new Date().toLocaleTimeString()
      }
    ])
  }

  // Runs the countdown while status is "running"
  useEffect(() => {
    if (status !== "running") return
    const id = setInterval(() => {
      setSecondsLeft(s => s - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [status])

  // Logs the session and stops the timer when it reaches zero
  useEffect(() => {
    if (secondsLeft > 0) return
    if (status !== "running") return

    logSession(durationMin * 60)
    setStatus("idle")
    setSecondsLeft(durationMin * 60)
  }, [secondsLeft, status])

  // Resets the timer if the selected subject is missing or empty
  useEffect(() => {
    if (selected !== "" && subjects.includes(selected)) return
    setStatus("idle")
    setSecondsLeft(durationMin * 60)
  }, [selected, subjects, durationMin])

  function handleStop() {
    logSession(durationMin * 60 - secondsLeft)
    setStatus("idle")
    setSecondsLeft(durationMin * 60)
  }

  function handleReset() {
    setStatus("idle")
    setSecondsLeft(durationMin * 60)
  }

  function handleDurationChange(e) {
    const value = Number(e.target.value)
    setDurationMin(value)
    if (status === "idle") {
      setSecondsLeft(value * 60)
    }
  }

  function handleAddSubject() {
    const name = newSubject.trim()
    if (name === "") return
    if (subjects.includes(name)) return
    setSubjects([...subjects, name])
    setNewSubject("")
  }

  function handleRemoveSubject(name) {
    setPendingRemoval(name)
  }

  function confirmRemoval() {
    setSubjects(subjects.filter(s => s !== pendingRemoval))
    if (selected === pendingRemoval) {
      setSelected("")
    }
    setPendingRemoval(null)
  }

  function cancelRemoval() {
    setPendingRemoval(null)
  }

  return (
    <div>
      <h1>Study Timer</h1>

      <p>{minutes}:{String(seconds).padStart(2, "0")}</p>

      <div>
        <label>Session length (minutes): </label>
        <input
          type="number"
          min="1"
          value={durationMin}
          onChange={handleDurationChange}
          disabled={status !== "idle"}
        />
      </div>

      <div>
        <label>Subject: </label>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">-- pick one --</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <button
          onClick={() => setStatus("running")}
          disabled={selected === "" || status === "running"}
        >
          Start
        </button>
        <button onClick={() => setStatus("paused")}>Pause</button>
        <button onClick={handleStop} disabled={status === "idle"}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <h2>Subjects</h2>

      <div>
        <input
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
          placeholder="New subject"
        />
        <button onClick={handleAddSubject}>Add</button>
      </div>

      <ul>
        {subjects.map(s => (
          <li key={s}>
            {s}
            <button onClick={() => handleRemoveSubject(s)}>×</button>
          </li>
        ))}
      </ul>

      <h2>Time by subject</h2>

      {sessions.length === 0 ? (
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

      <h2>History</h2>

      {sessions.length === 0 ? (
        <p>No sessions logged yet.</p>
      ) : (
        <>
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
        </>
      )}

      {pendingRemoval !== null && (
        <div>
          <p>Are you sure you want to remove "{pendingRemoval}"?</p>
          <button onClick={confirmRemoval}>Yes, remove</button>
          <button onClick={cancelRemoval}>Cancel</button>
        </div>
      )}
    </div>
  )
}

export default App