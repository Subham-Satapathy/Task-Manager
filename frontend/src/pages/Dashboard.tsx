import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface Task {
  _id: string; // Changed to use MongoDB style ID
  title: string;
  dueDate: string;
  priority: string;
  status: string;
}

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    dueDate: '',
    priority: '',
    status: 'Pending',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    console.log('Found token in localStorage');
    
    if (token) {
      setIsLoggedIn(true);
      fetchTasks(token); // Call function to fetch tasks if logged in
    } else {
      setIsLoggedIn(false);
      navigate('/'); 
      // Handle redirect or show message for unauthenticated users
    }
  }, []);

  const fetchTasks = async (token: string) => {
    const response = await fetch('http://localhost:5002/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token
      },
    });

    if (response.ok) {
      const tasksData = await response.json();
      setTasks(tasksData);
    } else {
      console.error('Failed to fetch tasks');
      setError('Failed to fetch tasks');
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const toggleModal = (open: boolean) => () => {
    setModalOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirects to the homepage
    // Optionally redirect to login page or perform additional actions
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setSnackbarOpen(true);
        setModalOpen(false);
        setNewTask({
          title: '',
          dueDate: '',
          priority: '',
          status: 'Pending',
        }); // Reset newTask to initial state
        fetchTasks(localStorage.getItem('token') || ''); // Re-fetch tasks
      } else {
        setError('Failed to add task');
      }
    } catch (err) {
      setError('Failed to add task');
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
      <AppBar position="static" sx={{ backgroundColor: '#424242' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, backgroundColor: '#333', color: '#fff' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['All Tasks', 'Completed Tasks', 'Pending Tasks', 'Add New Task', 'Profile', 'Settings'].map((text, index) => (
              <ListItem key={text}>
                <ListItemText primary={text} sx={{ color: '#fff' }} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ backgroundColor: '#555' }} />
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
        <Typography variant="h4" gutterBottom>
          Task Overview
        </Typography>

        {/* Add Task Button */}
        <Button variant="contained" color="primary" onClick={toggleModal(true)} sx={{ mb: 2 }}>
          Add Task
        </Button>

        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card sx={{ padding: '16px', margin: '8px 0', boxShadow: 3, borderRadius: '12px' }}>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">Due: {task.dueDate}</Typography>
                <Typography variant="body2">Priority: {task.priority}</Typography>
                <Typography variant="body2">Status: {task.status}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal for Adding Task */}
      <Modal open={modalOpen} onClose={toggleModal(false)}>
        <Box sx={{ padding: '20px', backgroundColor: '#fff', margin: '10% auto', width: '400px', boxShadow: 24 }}>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            disabled={loading}  // Disable button when loading
          >
            {loading ? <CircularProgress size={24} /> : 'Save Task'}
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
