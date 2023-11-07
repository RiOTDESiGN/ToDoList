import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Task from './Task';

const LOCAL_STORAGE_KEY = "tasks";

const loadSavedTasks = () => {
  const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
  return savedTasks ? JSON.parse(savedTasks) : [];
};

const App = () => {
  const [tasks, setTasks] = useState(loadSavedTasks);
  const [task, setTask] = useState({ title: '', text: '', status: 'Planned' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('time');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const generateTimestamp = () => {
    return new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '.');
  };

  const addTask = () => {
    if (task.title.trim() && task.text.trim()) {
      setTasks(prevTasks => [{
        id: uuidv4(),
        title: task.title.trim(),
        text: task.text.trim(),
        status: 'Planned',
        dateCreated: generateTimestamp(),
        dateUpdated: generateTimestamp(),
      }, ...prevTasks]);
      setTask({ title: '', text: '', status: 'Planned' });
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  }; 

  const updateTaskStatus = (taskId, status) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status, dateUpdated: generateTimestamp() } : t));
  };

  const statuses = ['Planned', 'Ongoing', 'Done'];

  const getTime = dateString => new Date(dateString).getTime();

  const sortTasks = (a, b) => {
    let comparison = 0;
    if (sortOption === 'time') {
      comparison = getTime(a.dateCreated) - getTime(b.dateCreated);
    } else if (sortOption === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortOption === 'updated') {
      comparison = getTime(a.dateUpdated) - getTime(b.dateUpdated);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  };

  const filterTasks = (task) => {
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const editTask = (id, newTitle, newText) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle, text: newText, dateUpdated: generateTimestamp() } : task
      )
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='addTaskTitle'>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={task.title}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={!task.title.trim() || !task.text.trim()}>
            Add
          </button>
        </div>
        <textarea
          name="text"
          placeholder="Text"
          value={task.text}
          onChange={handleInputChange}
        />
      </form>
      <div className="searchAndSort">
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
            editTask={editTask}
          />
      ))}
      </div>
    </div>
  );
};

export default App;