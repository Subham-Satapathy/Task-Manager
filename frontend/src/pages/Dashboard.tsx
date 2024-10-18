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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [isEditing, setIsEditing] = useState<boolean>(false); // Track if editing
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // Track the task being edited

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

        if (token) {
          // Check if token is not null
          fetchTasks(token);
        } else {
          setError("Token is null.");
        }
      } else {
        setError("Failed to add task");
      }
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5002/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        }
      );

      if (response.ok) {
        setSnackbarOpen(true);
        setModalOpen(false);
        setNewTask({
          title: "",
          dueDate: "",
          priority: "",
          status: "Pending",
        });

        if (token) {
          // Check if token is not null
          fetchTasks(token);
        } else {
          setError("Token is null.");
        }
      } else {
        setError("Failed to edit task");
      }
    } catch (err) {
      setError("Failed to edit task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(
          `http://localhost:5002/api/tasks/${taskId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          if (token) {
            // Check if token is not null
            fetchTasks(token);
          } else {
            setError("Token is null.");
          }
        } else {
          setError("Failed to delete task");
        }
      } catch (err) {
        setError("Failed to delete task");
      }
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

  const handleEditOpen = (task: Task) => {
    setNewTask(task);
    setEditingTaskId(task._id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "",
      status: "Pending",
    });
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
            <a
              href="#"
              onClick={() => {
                setModalOpen(true);
                setIsEditing(false);
              }}
            >
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
                {/* Title and Priority */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "'Poppins', sans-serif", // Custom font style
                      fontSize: "1.5rem", // Larger font size
                      color: "#333", // Darker color for title
                      letterSpacing: "0.5px", // Slight spacing between letters
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      marginLeft: "10px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      backgroundColor:
                        task.priority === "Low"
                          ? "green"
                          : task.priority === "Medium"
                          ? "orange"
                          : "red",
                      flexShrink: 0,
                    }}
                  >
                    {task.priority}
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" sx={{ marginTop: "8px" }}>
                  {task.description}
                </Typography>

                {/* Due date and status */}
                <Box
                  sx={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#757575" }}>
                    {new Date(task.dueDate).toLocaleDateString()}{" "}
                    {/* Format due date */}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: task.status === "Completed" ? "green" : "orange",
                    }}
                  >
                    {task.status}
                  </Typography>
                </Box>

                {/* Edit and Delete buttons */}
                <Box
                  sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleEditOpen(task)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteTask(task._id)}
                    aria-label="delete"
                    sx={{ marginLeft: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal for Adding or Editing Task */}
      <Modal open={modalOpen} onClose={handleModalClose}>
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
            {isEditing ? "Edit Task" : "Add New Task"}
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

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={newTask.priority}
              onChange={handleSelectChange}
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          {/* New Status Dropdown */}
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newTask.status} // Make sure newTask has a 'status' property
              onChange={handleSelectChange}
              label="Status"
            >
              <MenuItem value="TO DO">TO DO</MenuItem>
              <MenuItem value="BLOCKED">BLOCKED</MenuItem>
              <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
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

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={isEditing ? handleEditTask : handleAddTask}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Task"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={handleModalClose}
              sx={{ marginLeft: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Task saved successfully!"
      />
    </Box>
  );
};

export default Dashboard;
