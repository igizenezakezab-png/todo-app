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
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (error) {
      console.log("GET ERROR:", error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // ADD or UPDATE
  const handleSubmit = async () => {
    if (!activity || !date || !reminder) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          activity,
          date,
          reminder,
        });
        setEditId(null);
      } else {
        await axios.post(API_URL, {
          activity,
          date,
          reminder,
        });
      }

      setActivity("");
      setDate("");
      setReminder("");

      getTodos();
    } catch (error) {
      console.log("POST ERROR:", error.message);
      alert("Backend not connected. Check server.");
    }
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
    try {
      await axios.delete(`${API_URL}/${id}`);
      getTodos();
    } catch (error) {
      console.log("DELETE ERROR:", error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>TODO APP</h1>

        Activity:<input
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />

        Date:<input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        Reminder:<input
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update Todo" : "Add Todo"}
        </button>

        {todos.map((item) => (
          <div key={item.id} className="item">
            <p><b>{item.activity}</b></p>
            <p>{item.date}</p>
            <p>{item.reminder}</p>

            <button onClick={() => editTodo(item)}>Edit</button>
            <button onClick={() => deleteTodo(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
