import { signal } from "@preact/signals-react"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Task from './Task';

const LOCAL_STORAGE_KEY = "tasks";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState({
    title: '',
    text: '',
    status: 'Planned',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('time');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
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
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
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

  const sortTasks = (a, b) => {
    const parseDateWithFallback = (task) => {
      const updated = task.updateddatestamp && task.updatedtimestamp
        ? new Date(`${task.updateddatestamp} ${task.updatedtimestamp}`).getTime()
        : null;
      const created = new Date(task.datestamp).getTime();
      return updated || created;
    };
  
    if (sortOption === 'time') {
      const timeA = new Date(a.datestamp).getTime();
      const timeB = new Date(b.datestamp).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    } else if (sortOption === 'status') {
      return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    } else if (sortOption === 'updated') {
      const dateA = parseDateWithFallback(a);
      const dateB = parseDateWithFallback(b);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  };  

  const filterTasks = (task) => {
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.text.toLowerCase().includes(searchQuery.toLowerCase());
  };
  

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
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="time">Sort by creation time</option>
          <option value="status">Sort by status</option>
          <option value="updated">Sort by time updated</option>
        </select>
        <button onClick={() => setSortOrder('asc')}>Asc</button>
        <button onClick={() => setSortOrder('desc')}>Desc</button>
      </div>
      <div>
      {tasks
        .filter(filterTasks)
        .sort(sortTasks)
        .map((taskObj) => (
          <Task
            key={taskObj.id}
            taskObj={taskObj}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
            statuses={statuses}
          />
      ))}
      </div>
    </div>
  );
};

export default App;