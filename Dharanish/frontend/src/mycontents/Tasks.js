import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tasks.css';

export default function Tasks() {
  const [alltasks, setAlltasks] = useState([]);
  const [taskname, setTaskname] = useState('');
  const [date, setDate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setAlltasks(response.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddOrUpdate = async () => {
    if (editMode && editTaskId) {
      await updateTask(editTaskId);
    } else {
      await addTask();
    }
  };

  const addTask = async () => {
    const newTask = {
      taskname: taskname,
      date: date
    };
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask);
      setAlltasks([...alltasks, response.data]);
      setTaskname('');
      setDate('');
    } catch (error) {
      alert(error.message);
    }
  };

  const updateTask = async (taskId) => {
    const updatedTask = {
      taskname: taskname,
      date: date
    };
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask);
      fetchTasks(); 
      setEditMode(false);
      setEditTaskId(null);
      setTaskname('');
      setDate('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = async (taskId) => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${taskId}`);
      const { taskname, date } = response.data;
      setTaskname(taskname);
      setDate(date);
      setEditMode(true);
      setEditTaskId(taskId);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="total">
      <h1>TASK SCHEDULER</h1>
      <div className="task-container">
        <label>Task</label><br></br>
        <input required
          placeholder="write your taskname"
          value={taskname}
          onChange={(e) => setTaskname(e.target.value)}
        /><br></br>
        <label>Deadline</label><br></br>
        <input
          type="date" required
          value={date}
          onChange={(e) => setDate(e.target.value)
          }
        /><br></br>
        <button onClick={handleAddOrUpdate}>{editMode ? 'Update Task' : 'Add Task'}</button>
      </div>
      <div class="results">
        {alltasks.map((task) => (
          <div class="result"key={task.id}>
            <label>Taskname</label><br></br>
            <p>{task.taskname}</p>
            <label>Deadline</label><br></br>
            <p>{task.date}</p>
            <button onClick={() => handleEdit(task.id)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
