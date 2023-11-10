import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal';
import ResizableTextarea from './ResizableTextarea';

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

  const formatTextWithLineBreaks = (text) => {
    return text.split('\n').map((line) => (
      <React.Fragment key={uuidv4()}>
        {line}
        <br />
      </React.Fragment>
    ));
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
        <p>Do you really want to delete the task named "{taskObj.title}"?</p>
        <p className='right'>This action cannot be undone.</p>
      </Modal>
      <div className={`task ${taskObj.status}`}>
      {isModalOpen && <div className="deletingOverlay"></div>}
        <div className='taskContent'>
          <div className='taskText'>
            {isEditing ? (
              <div className='editTask'>
                <input 
                  className='editTaskTitle'
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                />
                <ResizableTextarea 
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  editing={isEditing}
                />
              </div>
            ) : (
              <>
                <h3>{taskObj.title}</h3>
                <p>{formatTextWithLineBreaks(taskObj.text)}</p>
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
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={() => setIsModalOpen(true)} className="delete-button">Del</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;