import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    // Get the tasks from local storage when the component mounts
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState({
    title: '',
    text: '',
    status: 'Planned',
  });

  useEffect(() => {
    // Save the tasks to local storage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.title.trim() && task.text.trim()) {
      const newTask = {
        ...task,
        id: uuidv4(),
        datestamp: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '.'),
      };
      setTasks([newTask, ...tasks]);
      setTask({
        title: '',
        text: '',
        status: 'Planned',
      });
    }
  };

  const deleteTask = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const getBorderStyle = (status) => {
    const styles = {
      Planned: { borderColor: 'red', borderStyle: 'dotted' },
      Ongoing: { borderColor: 'orange', borderStyle: 'dashed' },
      Done: {
        borderColor: 'green',
        borderStyle: 'solid',
        boxShadow: '0 0 50px 2px rgba(0, 255, 0, 0.2)'
      },
    };
  
    return {
      borderWidth: '4px',
      ...styles[status] || {},
    };
  };  

  const updateTaskStatus = (taskId, status) => {
    const now = new Date();
    const timestampFormat = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const datestampFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
  
    const updatedtimestamp = now.toLocaleString('en-GB', timestampFormat).replace(/\//g, '.');
    const updateddatestamp = now.toLocaleString('en-GB', datestampFormat).replace(/\//g, '.');
  
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status, updatedtimestamp, updateddatestamp };
      }
      return task;
    }));
  };

  const statuses = ['Planned', 'Ongoing', 'Done'];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='fr'>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={task.title}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={!task.title.trim() || !task.text.trim()}>
            Add Task
          </button>
        </div>
        <textarea
          name="text"
          placeholder="Text"
          value={task.text}
          onChange={handleInputChange}
        />
      </form>
      <div>
        {tasks.map((taskObj) => (
          <div 
            className='task' 
            key={taskObj.id}
            style={{ ...getBorderStyle(taskObj.status) }}
          >
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
        ))}
      </div>
    </div>
  );
};

export default App;