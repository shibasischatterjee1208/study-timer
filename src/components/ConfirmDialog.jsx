function ConfirmDialog({ message, onConfirm, onCancel }) {
  if (message === null) return null

  return (
    <div className="overlay">
      <div className="dialog">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default ConfirmDialog