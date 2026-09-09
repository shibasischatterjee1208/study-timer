function SubjectManager({
  subjects,
  newSubject,
  onNewSubjectChange,
  onAddSubject,
  onRemoveSubject
}) {
  return (
    <div>
      <h2>Subjects</h2>

      <div className="add-row">
        <input
          value={newSubject}
          onChange={onNewSubjectChange}
          placeholder="New subject"
        />
        <button onClick={onAddSubject}>Add</button>
      </div>

      <ul>
        {subjects.map(s => (
          <li key={s} className="subject-row">
            <span>{s}</span>
            <button onClick={() => onRemoveSubject(s)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SubjectManager