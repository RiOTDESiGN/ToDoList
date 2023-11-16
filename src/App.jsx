import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from './ThemeContext';

import Task from './Task';
import ResizableTextarea from './ResizableTextarea';
import ThemeSwitcher from './ThemeSwitcher';
import SortSwitcher from './SortSwitcher';

// ! Testing Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
// import Logout from './Logout';

import './themes.css'
import './index.css'
import "./assets/Antro_Vectra_Bolder.otf";
import "./assets/JMH_Typewriter.otf";

const LOCAL_STORAGE_KEY = "tasks";

const loadSavedTasks = () => {
  const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
  return savedTasks ? JSON.parse(savedTasks) : [];
};

const App = () => {
  const [tasks, setTasks] = useState(loadSavedTasks);
  const [task, setTask] = useState({ title: '', text: '', status: 'Planned' });
  const [searchQuery, setSearchQuery] = useState('');
  const [resetKey, setResetKey] = useState(0); // Reset textarea height to default
  const [sortedTasks, setSortedTasks] = useState([]);
  // ! Testing Firebase
  const { resetTheme } = useTheme();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          // ...
          console.log("uid", uid)
        } else {
          // User is signed out
          // ...
          resetTheme();
          console.log("user is logged out")
        }
      });

  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {               
    signOut(auth).then(() => {
    // Sign-out successful.
      resetTheme();
      navigate("/");
      console.log("Signed out successfully");
    }).catch((error) => {
    // An error happened.
    console.log("Error.");
    });
  }
  // ! End Testing Firebase

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

  const filteredTasks = useMemo(() => {
    return searchQuery
      ? tasks.filter(task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.text.toLowerCase().includes(searchQuery.toLowerCase()))
      : tasks;
  }, [tasks, searchQuery]);

  const editTask = (id, newTitle, newText) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle, text: newText, dateUpdated: generateTimestamp() } : task
      )
    );
  };

  const isDisabled = !task.title.trim();

  return (
    <>
      <div>
        <div className='background-image-blur'></div>
        <div className="appTitle">
          <div className="mainTitle">
            Traffic Lights
            <div className="subTitle subTitleShadow">Taskmanager</div>
            <div className="subTitle subTitleFront">Taskmanager</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='addTaskTitle'>
            <input
              className={`createTaskTitle ${task.title.length > 0 ? 'contains-text' : ''}`}
              type="text"
              name="title"
              placeholder="Give your task a title.."
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
            className={`${task.title.length > 0 ? 'contains-text' : ''}`}
            name="text"
            placeholder="..and write your task objectives here."
            value={task.text}
            onChange={handleInputChange}
            resetKey={resetKey}
          />
        </form>
        <div className="searchAndSort">
          <input
            className='searchfield'
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {user && 
          <div className="themeswitcher-container">
          <ThemeSwitcher user={user} />
          </div>
          }
          <SortSwitcher
            tasks={filteredTasks}
            onSortedTasksChange={setSortedTasks}
          />
        </div>
      </div>
      <div>
        {sortedTasks.map((taskObj) => (
          <Task
            key={taskObj.id}
            taskObj={taskObj}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </div>
      <br />
      <br />
      <br />
      {/* Testing Firebase */}
      <div className="test-firebase">
        {!user ? (<Signup />) : (
          <div>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default App;