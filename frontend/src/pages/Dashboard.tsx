import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Card,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // For responsive hamburger icon
import "../styles/Dashboard.css"; // Import the custom CSS for responsive navbar

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
}

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "Pending",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchTasks(token);
    } else {
      setIsLoggedIn(false);
      navigate("/");
    }
  }, []);

  const fetchTasks = async (token: string) => {
    const response = await fetch("http://localhost:5002/api/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const tasksData = await response.json();
      setTasks(tasksData);
    } else {
      console.error("Failed to fetch tasks");
      setError("Failed to fetch tasks");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setSnackbarOpen(true);
        setModalOpen(false);
        setNewTask({
          title: "",
          dueDate: "",
          priority: "",
          status: "Pending",
        });
        fetchTasks(localStorage.getItem("token") || "");
      } else {
        setError("Failed to add task");
      }
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Responsive Navbar */}
      <nav>
        <input type="checkbox" id="check" />
        <label htmlFor="check" className="checkbtn">
          <MenuIcon />
        </label>
        <label className="logo">Task Manager</label>
        <ul>
          <li>
            <a href="#" onClick={() => setModalOpen(true)}>
              Add New Task
            </a>
          </li>
          <li>
            <a href="#">Profile</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Dashboard Content */}
      <Box sx={{ padding: "20px", backgroundColor: "#f4f4f4" }}>
        {/* Task Grid */}
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card
                sx={{
                  padding: "16px",
                  margin: "8px 0",
                  boxShadow: 3,
                  borderRadius: "12px",
                }}
              >
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">Due: {task.dueDate}</Typography>
                <Typography variant="body2">
                  Priority: {task.priority}
                </Typography>
                <Typography variant="body2">Status: {task.status}</Typography>
                <Typography variant="body2">
                  Description: {task.description}
                </Typography>{" "}
                {/* Displaying Description */}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal for Adding Task */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#fff",
            margin: "10% auto",
            width: "400px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Add New Task
          </Typography>
          <TextField
            label="Title"
            name="title"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={handleTextFieldChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            fullWidth
            variant="outlined"
            value={newTask.dueDate}
            onChange={handleTextFieldChange}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={newTask.priority}
              onChange={handleSelectChange}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newTask.description}
            onChange={handleTextFieldChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Task"}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>

      {/* Snackbar for Success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Task added successfully"
      />
    </Box>
  );
};

export default Dashboard;
