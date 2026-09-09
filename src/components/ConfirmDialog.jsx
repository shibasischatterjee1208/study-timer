function ConfirmDialog({ subject, onConfirm, onCancel }) {
  if (subject === null) return null

  return (
    <div className="overlay">
      <div className="dialog">
        <p>Are you sure you want to remove "{subject}"?</p>
        <button onClick={onConfirm}>Yes, remove</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default ConfirmDialog