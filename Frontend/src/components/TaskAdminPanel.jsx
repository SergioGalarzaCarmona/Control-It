import React, { useEffect, useState } from "react";

export function TaskAdminPanel() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", completed: false });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from backend (Django DRF)
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tasks/");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create Task
  const createTask = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setNewTask({ title: "", completed: false });
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Update Task
  const updateTask = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTask),
      });
      if (res.ok) {
        setEditingTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">Task Admin</aside>

      <main className="main">
        <h1>Manage Tasks</h1>

        {/* Create Form */}
        <div className="form">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <button onClick={createTask}>Add Task</button>
        </div>

        {/* Tasks Table */}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) =>
              editingTask?.id === task.id ? (
                <tr key={task.id}>
                  <td>
                    <input
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editingTask.completed}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          completed : e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => updateTask(task.id)}>Save</button>
                    <button onClick={() => setEditingTask(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.completed ? '✅' : '❌' }</td>
                  <td>
                    <button onClick={() => setEditingTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}