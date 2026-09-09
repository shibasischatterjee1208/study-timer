function TimerDisplay({ secondsLeft }) {
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <div className="clock">
      {minutes}:{String(seconds).padStart(2, "0")}
    </div>
  )
}

export default TimerDisplay