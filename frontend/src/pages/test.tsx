import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/Dashboard.css";

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
    try {
      const response = await fetch("http://localhost:5002/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if the response is OK
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else if (response.status === 401) {
        // Token is invalid or expired
        console.error("Unauthorized: Invalid or expired token");
        setError("Session expired. Please log in again.");
        // Optionally, clear the token and redirect to login page
        localStorage.removeItem('token');
      } else {
        console.error("Failed to fetch tasks");
        setError("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("An error occurred while fetching tasks");
    }
  };
  

  // Task Card Component
  const TaskCard = ({ task }: { task: Task }) => (
    <Card
      sx={{
        padding: "16px",
        marginBottom: "16px",
        boxShadow: 2,
        borderRadius: "8px",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.2rem",
            color: "#333",
            letterSpacing: "0.5px",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
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
            fontSize: "0.75rem",
            backgroundColor:
              task.priority === "Low"
                ? "#4caf50"
                : task.priority === "Medium"
                ? "#ff9800"
                : "#f44336",
          }}
        >
          {task.priority}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          marginTop: "8px",
          color: "#666",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "40px",
        }}
      >
        {task.description}
      </Typography>

      <Box
        sx={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "#757575" }}>
  {new Date(task.dueDate).toLocaleDateString()}
</Typography>

<Typography
  variant="body2"
  sx={{
    color: "#757575",
    marginLeft: "8px", // Add some spacing
  }}
>
  {(() => {
    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    const timeDifference = dueDate.getTime() - currentDate.getTime(); // in milliseconds
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // convert to days

    // Return the appropriate message based on days remaining
    if (daysRemaining < 0) {
      return "Overdue"; // If due date has passed
    } else if (daysRemaining === 0) {
      return "Due Today"; // If due date is today
    } else {
      return `Due in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`; // Display remaining days
    }
  })()}
</Typography>

        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditOpen(task)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteTask(task._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );

  // Function to get tasks by status
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
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

      {/* Kanban Board Layout */}
      <Box sx={{ padding: "20px", backgroundColor: "#f4f4f4" }}>
        <Grid container spacing={2}>
          {/* BLOCKED Column */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#f8f8f8",
                borderRadius: "12px",
                height: "calc(100vh - 120px)",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  p: 1,
                  mb: 2,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#333",
                }}
              >
                BLOCKED ({getTasksByStatus("BLOCKED").length})
              </Typography>
              {getTasksByStatus("BLOCKED").map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </Paper>
          </Grid>


          {/* IN PROGRESS Column */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#f8f8f8",
                borderRadius: "12px",
                height: "calc(100vh - 120px)",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  p: 1,
                  mb: 2,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#333",
                }}
              >
                IN PROGRESS ({getTasksByStatus("IN PROGRESS").length})
              </Typography>
              {getTasksByStatus("IN PROGRESS").map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </Paper>
          </Grid>

          {/* COMPLETED Column */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#f8f8f8",
                borderRadius: "12px",
                height: "calc(100vh - 120px)",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  p: 1,
                  mb: 2,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#333",
                }}
              >
                COMPLETED ({getTasksByStatus("COMPLETED").length})
              </Typography>
              {getTasksByStatus("COMPLETED").map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </Paper>
          </Grid>
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
