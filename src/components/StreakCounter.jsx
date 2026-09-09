function StreakCounter({ streak }) {
  return (
    <div className="streak">
      <div className="streak-number">{streak}</div>
      <div className="muted">
        {streak === 1 ? "day streak" : "day streak"}
      </div>
      {streak === 0 && (
        <p className="muted">Study today to start a streak.</p>
      )}
    </div>
  )
}

export default StreakCounter