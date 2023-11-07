import React, { useState } from 'react';

const borderStyles = {
  Planned: { borderColor: 'red', borderStyle: 'dotted' },
  Ongoing: { borderColor: 'orange', borderStyle: 'dashed' },
  Done: { borderColor: 'green', borderStyle: 'solid',
          boxShadow: '0 0 50px 2px rgba(0, 255, 0, 0.2)',
  },
};

const Task = ({ taskObj, updateTaskStatus, deleteTask, editTask, statuses }) => {
  const getBorderStyle = (status) => ({
    borderWidth: '4px',
    ...borderStyles[status] || {},
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(taskObj.title);
  const [editableText, setEditableText] = useState(taskObj.text);

  const handleEdit = () => {
    if (isEditing) {
      editTask(taskObj.id, editableTitle, editableText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className='task' style={getBorderStyle(taskObj.status)}>
      <div className='taskContent'>
        <div className='taskText'>
          {isEditing ? (
            <div className='editTask'>
              <input 
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
              />
              <textarea 
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
              />
            </div>
          ) : (
            <>
              <h3>{taskObj.title}</h3>
              <p>{taskObj.text}</p>
            </>
          )}
        </div>
        <div className='taskDates'>
          <h3>{taskObj.dateCreated}</h3>
          <div className="updated">
            <h5>{taskObj.status}</h5>
            <h6>{taskObj.dateUpdated}</h6>
          </div>
        </div>
      </div>
      <div className='taskStatusbar'>
        <div className="taskStatus">
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
        <div className="taskButtons">
          <button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
          <button onClick={() => deleteTask(taskObj.id)}>Del</button>
        </div>
      </div>
    </div>
  );
};

export default Task;