function TimerDisplay({ secondsLeft }) {
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <p>{minutes}:{String(seconds).padStart(2, "0")}</p>
  )
}

export default TimerDisplay