import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "./ThemeContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

import Signup from "./Signup";
import Task from "./Task";
import ResizableTextarea from "./ResizableTextarea";
import ThemeSwitcher from "./ThemeSwitcher";
import SortSwitcher from "./SortSwitcher";

import "./themes.css";
import "./index.css";
import "./assets/Antro_Vectra_Bolder.otf";
import "./assets/JMH_Typewriter.otf";

const App = () => {
  console.log("Component has mounted.");
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", text: "", status: "Planned" });
  const [searchQuery, setSearchQuery] = useState("");
  const [resetKey, setResetKey] = useState(0); // Reset textarea height to default
  const [sortedTasks, setSortedTasks] = useState([]);
  const navigate = useNavigate();
  const { resetTheme } = useTheme();
  const [user, setUser] = useState(null);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setTasks([]);
        setTask({ title: "", text: "", status: "Planned" });
        setSearchQuery("");
        setSortedTasks([]);
        resetTheme();
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      console.log("No user logged in");
      return;
    }

    const userId = auth.currentUser.uid;
    const tasksCollectionRef = collection(db, `users/${userId}/tasks`);

    // Fetch tasks from Firestore
    const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
      const loadedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const generateTimestamp = () => {
    const datePart = new Date()
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");

    const timePart = new Date().toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const dayName = new Date().toLocaleString("en-US", { weekday: "long" });

    return `${dayName}\n${datePart}\n${timePart}`;
  };

  const addTask = () => {
    if (task.title.trim() || task.text.trim()) {
      const newTask = {
        title: task.title.trim(),
        text: task.text.trim(),
        status: "Planned",
        dateCreated: generateTimestamp(),
        dateUpdated: null,
      };

      // Get the user ID
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("No authenticated user found");
        return;
      }

      // Add the new task to the user's folder in the Firestore Database
      addDoc(collection(db, `users/${userId}/tasks`), newTask)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      // Update the local Task in the user's browser
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      setTask({ title: "", text: "", status: "Planned" });
      setResetKey((prevKey) => prevKey + 1);
    }
  };

  const deleteTask = (taskId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("No authenticated user found");
      return;
    }

    deleteDoc(doc(db, `users/${userId}/tasks`, taskId))
      .then(() => {
        console.log("Document successfully deleted");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const updateTaskStatus = (taskId, status) => {
    const userId = auth.currentUser?.uid;
    const update = {
      status,
      dateUpdated: generateTimestamp(),
    };

    if (!userId) {
      console.error("No authenticated user found");
      return;
    }

    updateDoc(doc(db, `users/${userId}/tasks`, taskId), update)
      .then(() => {
        console.log("Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating status: ", error);
      });
  };

  const filteredTasks = useMemo(() => {
    return searchQuery
      ? tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tasks;
  }, [tasks, searchQuery]);

  const editTask = (id, newTitle, newText) => {
    const userId = auth.currentUser?.uid;
    const updatedTask = {
      title: newTitle,
      text: newText,
      dateUpdated: generateTimestamp(),
    };

    if (!userId) {
      console.error("No authenticated user found");
      return;
    }

    updateDoc(doc(db, `users/${userId}/tasks`, id), updatedTask)
      .then(() => {
        console.log("Document successfully updated");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const isDisabled = !task.title.trim();

  return (
    <>
      <div>
        <div className="background-image-blur"></div>
        <div className="appTitle">
          <div className="mainTitle">
            Traffic Lights
            <div className="subTitle subTitleShadow">Taskmanager</div>
            <div className="subTitle subTitleFront">Taskmanager</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="addTaskTitle">
            <input
              className={`createTaskTitle ${
                task.title.length > 0 ? "contains-text" : ""
              }`}
              type="text"
              name="title"
              placeholder="Give your task a title.."
              value={task.title}
              onChange={handleInputChange}
            />
            <button
              className={`add-button ${!isDisabled ? "add-button-active" : ""}`}
              type="submit"
              disabled={isDisabled}
            >
              Add
            </button>
          </div>
          <ResizableTextarea
            className={`${task.title.length > 0 ? "contains-text" : ""}`}
            name="text"
            placeholder="..and write your task objectives here."
            value={task.text}
            onChange={handleInputChange}
            resetKey={resetKey}
          />
        </form>
        <div className="searchAndSort">
          <input
            className="searchfield"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {user && (
            <div className="themeswitcher-container">
              <ThemeSwitcher />
            </div>
          )}
          <SortSwitcher
            tasks={filteredTasks}
            onSortedTasksChange={setSortedTasks}
          />
        </div>
      </div>
      <div>
        {sortedTasks.map((taskObj) => {
          console.log(taskObj.id);
          return (
            <Task
              key={taskObj.id}
              taskObj={taskObj}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          );
        })}
      </div>
      <br />
      <br />
      <br />
      <div className="test-firebase">
        {!user ? (
          <Signup />
        ) : (
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
