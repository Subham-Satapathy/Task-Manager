import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const Tasks: React.FC = () => {
    const [task, setTask] = React.useState('');
    const [tasks, setTasks] = React.useState<string[]>([]);

    const handleAddTask = () => {
        if (task) {
            setTasks([...tasks, task]);
            setTask('');
        }
    };

    return (
        <Box>
            <Typography variant="h4">Task Management</Typography>
            <TextField
                label="New Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                variant="outlined"
                margin="normal"
            />
            <Button onClick={handleAddTask} variant="contained" color="primary">
                Add Task
            </Button>
            <Box mt={2}>
                <Typography variant="h6">Task List:</Typography>
                <ul>
                    {tasks.map((t, index) => (
                        <li key={index}>{t}</li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
};

export default Tasks;
