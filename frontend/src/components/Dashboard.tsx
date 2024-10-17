// src/components/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { AppBar, Container, Toolbar, Typography, Grid, Snackbar } from '@mui/material';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const addTask = (task: any) => {
        setTasks((prevTasks) => [...prevTasks, task]);
        setSnackbarMessage('Task added successfully!');
        setOpenSnackbar(true);
    };

    const updateTask = (updatedTask: any) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        setSnackbarMessage('Task updated successfully!');
        setOpenSnackbar(true);
    };

    const deleteTask = (taskId: number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setSnackbarMessage('Task deleted successfully!');
        setOpenSnackbar(true);
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Task Management Dashboard</Typography>
                </Toolbar>
            </AppBar>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <TaskForm onAddTask={addTask} onUpdateTask={updateTask} />
                </Grid>
                <Grid item xs={12}>
                    <TaskList tasks={tasks} onDeleteTask={deleteTask} onUpdateTask={updateTask} />
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default Dashboard;
