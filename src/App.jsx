import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);

  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [reminder, setReminder] = useState("");

  const [editId, setEditId] = useState(null);

  // GET TODOS
  const getTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // ADD or UPDATE
  const handleSubmit = async () => {
    if (!activity || !date || !reminder) return;

    if (editId) {
      // UPDATE
      await axios.put(`${API_URL}/${editId}`, {
        activity,
        date,
        reminder,
      });

      // refresh from backend
      await getTodos();

      setEditId(null);
    } else {
      // ADD
      await axios.post(API_URL, {
        activity,
        date,
        reminder,
      });

      // refresh from backend
      await getTodos();
    }

    // clear inputs
    setActivity("");
    setDate("");
    setReminder("");
  };

  // EDIT
  const editTodo = (item) => {
    setActivity(item.activity);
    setDate(item.date);
    setReminder(item.reminder);
    setEditId(item.id);
  };

  // DELETE
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    getTodos();
  };

  return (
    <div className="container">
      <div className="card">
        <h1>TODO APP</h1>

        <label>Activity</label>
        <input
          placeholder="Enter activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />

        <label>date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Reminder</label>
        <input
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update Todo" : "Add Todo"}
        </button>

        {todos.map((item) => (
          <div key={item.id} className="item">
            <p><strong>{item.activity}</strong></p>
            <p>📅 {item.date}</p>
            <p>⏰ {item.reminder}</p>

            <button onClick={() => editTodo(item)}>Edit</button>
            <button onClick={() => deleteTodo(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;