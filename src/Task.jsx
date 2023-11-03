const borderStyles = {
  Planned: { borderColor: 'red', borderStyle: 'dotted' },
  Ongoing: { borderColor: 'orange', borderStyle: 'dashed' },
  Done: {
    borderColor: 'green',
    borderStyle: 'solid',
    boxShadow: '0 0 50px 2px rgba(0, 255, 0, 0.2)',
  },
};

const Task = ({ taskObj, updateTaskStatus, deleteTask, statuses }) => {
  const getBorderStyle = (status) => ({
    borderWidth: '4px',
    ...borderStyles[status] || {},
  });
  
  return (
    <div className='task' style={getBorderStyle(taskObj.status)}>
      <div className='fr'>
        <div>
          <div className='fr'><h3>{taskObj.title}</h3></div>
          <p>{taskObj.text}</p>
        </div>
        <div className='fc'>
          <h3>{taskObj.datestamp}</h3>
          <h5>Marked as<br />{taskObj.status}<br />{taskObj.updateddatestamp}<br />{taskObj.updatedtimestamp}</h5>
        </div>
      </div>
      <div className='fr'>
        <div className='status-container'>
          {statuses.map((status) => (
            <label key={status}>
              <input
                type="radio"
                name={`status-${taskObj.id}`}
                value={status}
                checked={taskObj.status === status}
                onChange={() => updateTaskStatus(taskObj.id, status)}
              />
              {status}
            </label>
          ))}
        </div>
        <button onClick={() => deleteTask(taskObj.id)}>Delete</button>
      </div>
    </div>
  );
};

export default Task;