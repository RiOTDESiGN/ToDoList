import React, { useState } from 'react';
import Modal from './Modal';

const statuses = ['Planned', 'Ongoing', 'Done'];

const Task = ({ taskObj, updateTaskStatus, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(taskObj.title);
  const [editableText, setEditableText] = useState(taskObj.text);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    if (isEditing) {
      editTask(taskObj.id, editableTitle, editableText);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableTitle(taskObj.title);
    setEditableText(taskObj.text);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          deleteTask(taskObj.id);
          setIsModalOpen(false);
        }}
      >
        <h2>Are you sure?</h2>
        <p>Do you really want to delete this task? This action cannot be undone.</p>
      </Modal>
      <div className={`task ${taskObj.status}`}>
      {isModalOpen && <div className="deletingOverlay">DELETING</div>}
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
          </div>
        </div>
        <div className='taskStatusbar'>
          <div className="taskStatus">
            {statuses.map((status) => (
              <div key={status}>
                <input
                  id={`status-${status}-${taskObj.id}`}
                  type="radio"
                  name={`status-${taskObj.id}`}
                  value={status}
                  checked={taskObj.status === status}
                  onChange={() => updateTaskStatus(taskObj.id, status)}
                  className="statusRadio"
                />
                <label htmlFor={`status-${status}-${taskObj.id}`}>
                  {status}
                </label>
              </div>
            ))}
          </div>
          <div className="updated">
            {taskObj.dateUpdated ? (
              <>
                <h4>Updated</h4>&nbsp;:&nbsp;<h4>{taskObj.dateUpdated}</h4>
              </>
            ) : (
              <h4></h4>
            )}
          </div>
          <div className="actionButtons">
            {isEditing ? (
              <>
                <button onClick={handleEdit}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={() => setIsModalOpen(true)}>Del</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;