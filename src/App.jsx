import { useState, useEffect } from "react"
import "./App.css"
import TimerDisplay from "./components/TimerDisplay"
import TimerControls from "./components/TimerControls"
import SubjectManager from "./components/SubjectManager"
import SubjectChart from "./components/SubjectChart"
import DailyRecord from "./components/DailyRecord"
import ConfirmDialog from "./components/ConfirmDialog"

function App() {
  const [durationMin, setDurationMin] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [status, setStatus] = useState("idle")

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("subjects")
    return saved ? JSON.parse(saved) : ["Calculus", "Physics", "DSA"]
  })

  const [newSubject, setNewSubject] = useState("")
  const [selected, setSelected] = useState("")

  const [pendingRemoval, setPendingRemoval] = useState(null)

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("sessions")
    return saved ? JSON.parse(saved) : []
  })

  const totalSeconds = sessions.reduce((sum, s) => sum + s.seconds, 0)

  const totalsBySubject = subjects.map(subject => {
    const seconds = sessions
      .filter(s => s.subject === subject)
      .reduce((sum, s) => sum + s.seconds, 0)
    return { subject, seconds }
  })

  const maxSeconds = Math.max(...totalsBySubject.map(t => t.seconds), 1)

  const days = [...new Set(sessions.map(s => s.date))]
    .sort()
    .reverse()
    .map(date => ({
      date,
      seconds: sessions
        .filter(s => s.date === date)
        .reduce((sum, s) => sum + s.seconds, 0),
      items: sessions.filter(s => s.date === date)
    }))

  function logSession(elapsed) {
    if (elapsed <= 0) return
    const now = new Date()
    setSessions(prev => [
      ...prev,
      {
        id: Date.now(),
        subject: selected,
        seconds: elapsed,
        date: now.toISOString().slice(0, 10),
        completedAt: now.toLocaleTimeString()
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

  // Saves subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects))
  }, [subjects])

  // Saves sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions))
  }, [sessions])

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

  function handleClearHistory() {
    setSessions([])
  }

  return (
    <div className="app">
      <h1>Study Timer</h1>

      <div className="card">
        <TimerDisplay secondsLeft={secondsLeft} />

        <TimerControls
          durationMin={durationMin}
          status={status}
          selected={selected}
          subjects={subjects}
          onDurationChange={handleDurationChange}
          onSelectChange={e => setSelected(e.target.value)}
          onStart={() => setStatus("running")}
          onPause={() => setStatus("paused")}
          onStop={handleStop}
          onReset={handleReset}
        />
      </div>

      <div className="card">
        <SubjectManager
          subjects={subjects}
          newSubject={newSubject}
          onNewSubjectChange={e => setNewSubject(e.target.value)}
          onAddSubject={handleAddSubject}
          onRemoveSubject={handleRemoveSubject}
        />
      </div>

      <div className="card">
        <SubjectChart
          totalsBySubject={totalsBySubject}
          maxSeconds={maxSeconds}
          hasSessions={sessions.length > 0}
        />
      </div>

      <div className="card">
        <DailyRecord
          days={days}
          totalSeconds={totalSeconds}
          onClear={handleClearHistory}
        />
      </div>

      <ConfirmDialog
        subject={pendingRemoval}
        onConfirm={confirmRemoval}
        onCancel={cancelRemoval}
      />
    </div>
  )
}

export default App