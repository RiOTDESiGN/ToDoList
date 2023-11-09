import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Task from './Task';
import ResizableTextarea from './ResizableTextarea';
import CustomSelect from './CustomSelect';

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
  const [resetKey, setResetKey] = useState(0); // Reset textarea height to default

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const generateTimestamp = () => {
    const datePart = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.');
  
    const timePart = new Date().toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const dayName = new Date().toLocaleString('en-US', { weekday: 'long' });
  
    return `${dayName}\n${datePart}\n${timePart}`;
  };  

  const addTask = () => {
    if (task.title.trim() || task.text.trim()) {
      setTasks(prevTasks => [{
        id: uuidv4(),
        title: task.title.trim(),
        text: task.text.trim(),
        status: 'Planned',
        dateCreated: generateTimestamp(),
        dateUpdated: null,
      }, ...prevTasks]);
      setTask({ title: '', text: '', status: 'Planned' });
      setResetKey(prevKey => prevKey + 1);
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

  const anyTaskUpdated = tasks.some(task => task.dateUpdated);

  const getTime = dateString => new Date(dateString).getTime();

  const sortTasks = (a, b) => {
    let comparison = 0;
    if (sortOption === 'time') {
      comparison = getTime(a.dateCreated) - getTime(b.dateCreated);
    } else if (sortOption === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortOption === 'updated') {
      comparison = getTime(a.dateUpdated) - getTime(b.dateUpdated);
    } else if (sortOption === 'title') {
      comparison = a.title.localeCompare(b.title);
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

  const SortButton = ({ order }) => (
    <button
      onClick={() => setSortOrder(order)}
      className={`sort-button
                  ${sortOrder === order ? 'sort-button-active' : ''}
                  ${order === "desc" ? 'desc-button' : ''}
                `}
    >
      {order.charAt(0).toUpperCase() + order.slice(1)}
    </button>
  );

  const isDisabled = !task.title.trim();

  const options = [
    { value: 'time', label: 'Sort by creation time', disabled: false },
    { value: 'status', label: 'Sort by status', disabled: false },
    { value: 'updated', label: 'Sort by time updated', disabled: !anyTaskUpdated },
    { value: 'title', label: 'Sort by title', disabled: false },
  ];
  
  const disabledOptions = anyTaskUpdated ? [] : ['updated'];

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className='addTaskTitle'>
            <input
              className='createTaskTitle'
              type="text"
              name="title"
              placeholder="Title"
              value={task.title}
              onChange={handleInputChange}
            />
            <button className={`add-button ${!isDisabled ? 'add-button-active' : ''}`}
                    type="submit"
                    disabled={isDisabled}>
              Add
            </button>
          </div>
          <ResizableTextarea
            name="text"
            placeholder="Text"
            value={task.text}
            onChange={handleInputChange}
            resetKey={resetKey}
          />
        </form>
        { tasks.length >= 2 ? (
          <div className="searchAndSort">
            <input
              className='searchfield'
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <CustomSelect
              value={sortOption}
              onChange={setSortOption}
              options={options}
            />
            <SortButton order="asc" />
            <SortButton order="desc" />
          </div>
          ) : (
            <></>
          )
        }
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
              editTask={editTask}
            />
        ))}
      </div>
    </>
  );
};

export default App;