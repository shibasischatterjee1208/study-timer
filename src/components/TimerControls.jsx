function TimerControls({
  durationMin,
  status,
  selected,
  subjects,
  onDurationChange,
  onSelectChange,
  onStart,
  onPause,
  onStop,
  onReset
}) {
  return (
    <div>
      <div className="field">
        <label>Session length (min)</label>
        <input
          type="number"
          min="1"
          value={durationMin}
          onChange={onDurationChange}
          disabled={status !== "idle"}
        />
      </div>

      <div className="field">
        <label>Subject</label>
        <select value={selected} onChange={onSelectChange}>
          <option value="">-- pick one --</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="controls">
        <button onClick={onStart} disabled={selected === "" || status === "running"}>
          Start
        </button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onStop} disabled={status === "idle"}>Stop</button>
        <button onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}

export default TimerControls