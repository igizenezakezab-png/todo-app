import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);

  const [Activity, setActivity] = useState("");
  const [Date, setDate] = useState("");
  const [Reminder, setReminder] = useState("");

  const [editId, setEditId] = useState(null);

  // GET
  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  // EDIT
  const editTodo = (item) => {
    setActivity(item.Activity);
    setDate(item.Date);
    setReminder(item.Reminder);
    setEditId(item.id);
  };

  // ADD + UPDATE
  const addTodo = async () => {
    if (!Activity || !Date || !Reminder) return;

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, {
        Activity,
        Date,
        Reminder,
      });
      setEditId(null);
    } else {
      await axios.post(API_URL, {
        Activity,
        Date,
        Reminder,
      });
    }

    setActivity("");
    setDate("");
    setReminder("");

    getTodos();
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

        <input
          placeholder="Activity"
          value={Activity}
          onChange={(e) => setActivity(e.target.value)}
        />

        <input
          placeholder="Date"
          value={Date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          placeholder="Reminder"
          value={Reminder}
          onChange={(e) => setReminder(e.target.value)}
        />

        <button onClick={addTodo}>
          {editId ? "Update" : "Add"}
        </button>

        {todos.map((item) => (
          <div key={item.id} className="item">

            <p>{item.Activity}</p>
            <p>{item.Date}</p>
            <p>{item.Reminder}</p>

            {/* ✅ IMPORTANT BUTTONS */}
            <button onClick={() => editTodo(item)}>Edit</button>
            <button onClick={() => deleteTodo(item.id)}>Delete</button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default App;