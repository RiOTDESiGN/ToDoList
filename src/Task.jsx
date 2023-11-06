const borderStyles = {
  Planned: { borderColor: 'red', borderStyle: 'dotted' },
  Ongoing: { borderColor: 'orange', borderStyle: 'dashed' },
  Done: { borderColor: 'green', borderStyle: 'solid',
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

      <div className='taskContent'>
        <div className='taskText'>
          <h3>{taskObj.title}</h3>
          <p>{taskObj.text}</p>
        </div>
        <div className='taskDates'>
          <h3>{taskObj.dateCreated}</h3>
          <h5>Marked as<br />{taskObj.status}<br />{taskObj.dateUpdated}</h5>
        </div>
      </div>

      <div className='taskStatusbar'>
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