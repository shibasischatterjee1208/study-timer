import { useState, useEffect } from "react"
import TimerDisplay from "./components/TimerDisplay"
import TimerControls from "./components/TimerControls"
import SubjectManager from "./components/SubjectManager"
import SubjectChart from "./components/SubjectChart"
import SessionHistory from "./components/SessionHistory"
import ConfirmDialog from "./components/ConfirmDialog"

function App() {
  const [durationMin, setDurationMin] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [status, setStatus] = useState("idle")

  const [subjects, setSubjects] = useState(["Calculus", "Physics", "DSA"])
  const [newSubject, setNewSubject] = useState("")
  const [selected, setSelected] = useState("Calculus")

  const [pendingRemoval, setPendingRemoval] = useState(null)
  const [sessions, setSessions] = useState([])

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

      <SubjectManager
        subjects={subjects}
        newSubject={newSubject}
        onNewSubjectChange={e => setNewSubject(e.target.value)}
        onAddSubject={handleAddSubject}
        onRemoveSubject={handleRemoveSubject}
      />

      <SubjectChart
        totalsBySubject={totalsBySubject}
        maxSeconds={maxSeconds}
        hasSessions={sessions.length > 0}
      />

      <SessionHistory sessions={sessions} totalSeconds={totalSeconds} />

      <ConfirmDialog
        subject={pendingRemoval}
        onConfirm={confirmRemoval}
        onCancel={cancelRemoval}
      />
    </div>
  )
}

export default App